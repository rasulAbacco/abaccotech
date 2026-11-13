// whatsapp/whatsappCampaign.service.js
//
// 🆕 Bulk WhatsApp campaigns.
//
// Meta has no "send to a list" API — every message is one call per phone.
// "Bulk" happens here: one click queues every contact in the audience, and
// processCampaignQueue() sends them in parallel batches (default 20 at a
// time, well under Meta's ~80 messages/second per number), in the
// background, with retries, pause/resume/cancel and duplicate protection.
//
// Recipient lifecycle:
//   PENDING → QUEUED (claimed by the sender) → ACCEPTED (Meta returned a wamid)
//   → SENT → DELIVERED → READ   (from the webhook)
//   or FAILED / SKIPPED (opted out) / CANCELLED (campaign cancelled)

import prisma from "./prisma.js";
import { MetaApiError, WhatsAppConfigError, getWhatsAppConfig, sendTemplateMessage } from "./whatsappMeta.service.js";
import {
  buildTemplateComponents,
  normaliseCampaignParams,
  renderPreview,
  validateCampaignParams,
} from "./whatsappTemplate.service.js";
import { ACTIVE_CONTACT_WHERE, normalizePhone, optOutByPhone } from "./whatsappContact.service.js";

const SEND_CONCURRENCY = Math.min(Math.max(Number(process.env.WHATSAPP_SEND_CONCURRENCY) || 20, 1), 50);
const BATCH_SIZE = 100; // recipients claimed per round
const TICK_BUDGET_MS = 50_000; // stop each run before the next cron minute
const MAX_ATTEMPTS = 3; // for temporary errors
const RETRY_DELAY_MS = 2 * 60_000;
const RATE_LIMIT_DELAY_MS = 60_000;
const STUCK_AFTER_MS = 10 * 60_000;
const EARLY_FAILURE_LIMIT = 10; // stop a campaign whose first N sends all fail

const EDITABLE = new Set(["DRAFT"]);
const DELETABLE = new Set(["DRAFT", "COMPLETED", "FAILED", "CANCELLED"]);

export class CampaignError extends Error {
  constructor(message, status = 400, details) {
    super(message);
    this.name = "CampaignError";
    this.status = status;
    this.details = details;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

function campaignParams(c) {
  return {
    headerImageUrl: c.headerImageUrl,
    headerParams: c.headerParams || [],
    bodyParams: c.bodyParams || [],
    buttonParams: c.buttonParams || {},
  };
}

function assertSendingConfigured() {
  const c = getWhatsAppConfig();
  const missing = [];
  if (!c.token) missing.push("WHATSAPP_TOKEN");
  if (!c.phoneNumberId) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  if (missing.length) throw new WhatsAppConfigError(missing);
}

async function loadTemplateOrThrow(templateId) {
  const template = await prisma.whatsAppTemplate.findUnique({ where: { id: Number(templateId) } });
  if (!template) throw new CampaignError("Template not found. Sync templates from Meta first.", 404);
  return template;
}

function describeError(err) {
  if (err instanceof MetaApiError) {
    return { code: err.code != null ? String(err.code) : err.httpStatus ? `HTTP_${err.httpStatus}` : "NETWORK", text: err.message };
  }
  return { code: "INTERNAL", text: err?.message || String(err) };
}

// ── Stats ───────────────────────────────────────────────────────────────

function emptyStats() {
  return { total: 0, pending: 0, queued: 0, accepted: 0, sent: 0, delivered: 0, read: 0, failed: 0, skipped: 0, cancelled: 0 };
}

// "sent" / "delivered" are cumulative (a READ message was also delivered and sent).
function finaliseStats(raw) {
  const s = { ...raw };
  s.sent = raw.accepted + raw.sent + raw.delivered + raw.read; // accepted by Meta or better
  s.delivered = raw.delivered + raw.read;
  return s;
}

async function statsForCampaigns(ids) {
  const map = new Map(ids.map((id) => [id, emptyStats()]));
  if (!ids.length) return map;
  const rows = await prisma.whatsAppCampaignRecipient.groupBy({
    by: ["campaignId", "status"],
    where: { campaignId: { in: ids } },
    _count: { _all: true },
  });
  for (const r of rows) {
    const s = map.get(r.campaignId);
    const key = r.status.toLowerCase();
    if (key in s) s[key] += r._count._all;
    s.total += r._count._all;
  }
  for (const [id, s] of map) map.set(id, finaliseStats(s));
  return map;
}

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createCampaign(input, userId) {
  const name = String(input.name || "").trim();
  if (!name) throw new CampaignError("Campaign name is required");

  const template = await loadTemplateOrThrow(input.templateId);
  const params = normaliseCampaignParams(template, input);
  const errors = validateCampaignParams(template, params);
  if (errors.length) throw new CampaignError("Please fix the template values", 400, errors);

  return prisma.whatsAppCampaign.create({
    data: {
      name,
      templateId: template.id,
      templateName: template.name,
      languageCode: template.language,
      ...params,
      audienceTag: input.audienceTag?.trim() || null,
      createdById: userId ?? null,
    },
  });
}

export async function updateCampaign(id, input) {
  const campaign = await getCampaignOrThrow(id);
  if (!EDITABLE.has(campaign.status)) throw new CampaignError(`A ${campaign.status} campaign can't be edited`, 409);

  const templateId = input.templateId ?? campaign.templateId;
  const template = await loadTemplateOrThrow(templateId);
  const merged = { ...campaignParams(campaign), ...input };
  const params = normaliseCampaignParams(template, merged);
  const errors = validateCampaignParams(template, params);
  if (errors.length) throw new CampaignError("Please fix the template values", 400, errors);

  return prisma.whatsAppCampaign.update({
    where: { id: campaign.id },
    data: {
      name: input.name !== undefined ? String(input.name).trim() || campaign.name : campaign.name,
      templateId: template.id,
      templateName: template.name,
      languageCode: template.language,
      ...params,
      audienceTag: input.audienceTag !== undefined ? input.audienceTag?.trim() || null : campaign.audienceTag,
    },
  });
}

async function getCampaignOrThrow(id) {
  const campaign = await prisma.whatsAppCampaign.findUnique({ where: { id: Number(id) } });
  if (!campaign) throw new CampaignError("Campaign not found", 404);
  return campaign;
}

export async function listCampaigns({ status } = {}) {
  const campaigns = await prisma.whatsAppCampaign.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  });
  const stats = await statsForCampaigns(campaigns.map((c) => c.id));
  return campaigns.map((c) => ({ ...c, stats: stats.get(c.id) }));
}

export async function getCampaignDetails(id) {
  const campaign = await prisma.whatsAppCampaign.findUnique({
    where: { id: Number(id) },
    include: { template: true },
  });
  if (!campaign) throw new CampaignError("Campaign not found", 404);
  const stats = (await statsForCampaigns([campaign.id])).get(campaign.id);
  const audienceCount = await prisma.whatsAppContact.count({
    where: { ...ACTIVE_CONTACT_WHERE, ...(campaign.audienceTag ? { tag: campaign.audienceTag } : {}) },
  });
  const preview = campaign.template
    ? renderPreview(campaign.template, campaignParams(campaign), { name: "Customer", phone: "" })
    : null;
  return { ...campaign, stats, audienceCount, preview };
}

export async function listRecipients(id, { status, search, page = 1, pageSize = 50 } = {}) {
  const where = { campaignId: Number(id) };
  if (status) where.status = status;
  if (search) where.phone = { contains: String(search).replace(/\D/g, "") };
  const take = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;
  const [total, recipients] = await Promise.all([
    prisma.whatsAppCampaignRecipient.count({ where }),
    prisma.whatsAppCampaignRecipient.findMany({
      where,
      orderBy: { id: "asc" },
      skip,
      take,
      include: { contact: { select: { name: true, tag: true } } },
    }),
  ]);
  return { total, page: Math.floor(skip / take) + 1, pageSize: take, recipients };
}

export async function deleteCampaign(id) {
  const campaign = await getCampaignOrThrow(id);
  if (!DELETABLE.has(campaign.status)) {
    throw new CampaignError(`A ${campaign.status} campaign can't be deleted — pause or cancel it first`, 409);
  }
  await prisma.whatsAppCampaign.delete({ where: { id: campaign.id } });
}

// ── Launch / schedule / pause / resume / cancel / retry ─────────────────

// Creates one PENDING row per active contact in the audience. The
// (campaignId, contactId) unique index makes this safe to run twice.
async function materialiseRecipients(campaign) {
  const where = { ...ACTIVE_CONTACT_WHERE, ...(campaign.audienceTag ? { tag: campaign.audienceTag } : {}) };
  let cursor;
  let added = 0;
  for (;;) {
    const contacts = await prisma.whatsAppContact.findMany({
      where,
      select: { id: true, phone: true },
      orderBy: { id: "asc" },
      take: 1000,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    if (!contacts.length) break;
    const { count } = await prisma.whatsAppCampaignRecipient.createMany({
      data: contacts.map((c) => ({ campaignId: campaign.id, contactId: c.id, phone: c.phone })),
      skipDuplicates: true,
    });
    added += count;
    cursor = contacts[contacts.length - 1].id;
  }
  return added;
}

async function startCampaign(campaign) {
  const added = await materialiseRecipients(campaign);
  const total = await prisma.whatsAppCampaignRecipient.count({ where: { campaignId: campaign.id } });
  if (!total) {
    await prisma.whatsAppCampaign.update({
      where: { id: campaign.id },
      data: { status: "FAILED", lastError: "No active contacts in the selected audience" },
    });
    throw new CampaignError("No active contacts in the selected audience");
  }
  await prisma.whatsAppCampaign.update({
    where: { id: campaign.id },
    data: { status: "SENDING", startedAt: campaign.startedAt ?? new Date(), lastError: null },
  });
  return added;
}

// mode: send now (no scheduledAt) or schedule for later.
export async function launchCampaign(id, { scheduledAt } = {}) {
  const campaign = await getCampaignOrThrow(id);
  if (!["DRAFT", "SCHEDULED"].includes(campaign.status)) {
    throw new CampaignError(`A ${campaign.status} campaign can't be launched`, 409);
  }

  assertSendingConfigured();
  const template = campaign.templateId ? await loadTemplateOrThrow(campaign.templateId) : null;
  if (!template) throw new CampaignError("This campaign's template no longer exists — pick another one");
  const errors = validateCampaignParams(template, campaignParams(campaign));
  if (errors.length) throw new CampaignError("This campaign can't be sent yet", 400, errors);

  const audience = await prisma.whatsAppContact.count({
    where: { ...ACTIVE_CONTACT_WHERE, ...(campaign.audienceTag ? { tag: campaign.audienceTag } : {}) },
  });
  if (!audience) throw new CampaignError("No active contacts in the selected audience");

  if (scheduledAt) {
    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime())) throw new CampaignError("Invalid schedule time");
    if (when.getTime() > Date.now() + 60_000) {
      return prisma.whatsAppCampaign.update({
        where: { id: campaign.id },
        data: { status: "SCHEDULED", scheduledAt: when, lastError: null },
      });
    }
  }

  await startCampaign(campaign);
  kickCampaignQueue();
  return prisma.whatsAppCampaign.findUnique({ where: { id: campaign.id } });
}

export async function pauseCampaign(id) {
  const { count } = await prisma.whatsAppCampaign.updateMany({
    where: { id: Number(id), status: { in: ["SENDING", "SCHEDULED"] } },
    data: { status: "PAUSED" },
  });
  if (!count) throw new CampaignError("Only sending or scheduled campaigns can be paused", 409);
  return getCampaignOrThrow(id);
}

export async function resumeCampaign(id) {
  const campaign = await getCampaignOrThrow(id);
  if (!["PAUSED", "FAILED"].includes(campaign.status)) {
    throw new CampaignError("Only paused or failed campaigns can be resumed", 409);
  }
  assertSendingConfigured();

  // A campaign paused before its scheduled time goes back to waiting for it.
  if (!campaign.startedAt && campaign.scheduledAt && campaign.scheduledAt > new Date()) {
    return prisma.whatsAppCampaign.update({ where: { id: campaign.id }, data: { status: "SCHEDULED", lastError: null } });
  }
  await startCampaign(campaign);
  kickCampaignQueue();
  return getCampaignOrThrow(id);
}

export async function cancelCampaign(id) {
  const campaign = await getCampaignOrThrow(id);
  if (["COMPLETED", "CANCELLED"].includes(campaign.status)) {
    throw new CampaignError(`Campaign is already ${campaign.status}`, 409);
  }
  await prisma.$transaction([
    prisma.whatsAppCampaign.update({
      where: { id: campaign.id },
      data: { status: "CANCELLED", completedAt: new Date() },
    }),
    prisma.whatsAppCampaignRecipient.updateMany({
      where: { campaignId: campaign.id, status: "PENDING" },
      data: { status: "CANCELLED" },
    }),
  ]);
  return getCampaignOrThrow(id);
}

// Puts FAILED recipients back in the queue (e.g. after Meta's marketing
// frequency limit). Never retries people who opted out.
export async function retryFailedRecipients(id) {
  const campaign = await getCampaignOrThrow(id);
  if (["SENDING", "SCHEDULED"].includes(campaign.status)) {
    throw new CampaignError("Wait until the campaign finishes (or pause it) before retrying failures", 409);
  }
  assertSendingConfigured();
  const { count } = await prisma.whatsAppCampaignRecipient.updateMany({
    where: {
      campaignId: campaign.id,
      status: "FAILED",
      OR: [{ errorCode: null }, { errorCode: { not: "131050" } }], // 131050 = they stopped marketing messages
      contact: { is: ACTIVE_CONTACT_WHERE },
    },
    data: { status: "PENDING", attempts: 0, nextAttemptAt: null, errorCode: null, errorText: null, failedAt: null },
  });
  if (!count) throw new CampaignError("No failed messages to retry");
  await prisma.whatsAppCampaign.update({
    where: { id: campaign.id },
    data: { status: "SENDING", completedAt: null, lastError: null },
  });
  kickCampaignQueue();
  return { requeued: count };
}

// Sends the campaign's template to one number (usually your own) without
// recording it — check how it looks before sending to everyone.
export async function sendTestMessage({ templateId, phone, ...input }) {
  assertSendingConfigured();
  const to = normalizePhone(phone);
  if (!to) throw new CampaignError("Invalid phone number");
  const template = await loadTemplateOrThrow(templateId);
  const params = normaliseCampaignParams(template, input);
  const errors = validateCampaignParams(template, params);
  if (errors.length) throw new CampaignError("Please fix the template values", 400, errors);

  const contact = { name: input.testName || "Customer", phone: to };
  const { messageId } = await sendTemplateMessage({
    to,
    templateName: template.name,
    languageCode: template.language,
    components: buildTemplateComponents(template, params, contact),
  });
  return { messageId, to };
}

// ── Background sender ───────────────────────────────────────────────────

let queueRunning = false;

// Run the queue now (after launch/resume) without waiting for the next cron tick.
export function kickCampaignQueue() {
  setImmediate(() => {
    processCampaignQueue().catch((err) => console.error("❌ [whatsappCampaign] queue run failed:", err));
  });
}

export async function processCampaignQueue() {
  if (queueRunning) return { skipped: true };
  queueRunning = true;
  const deadline = Date.now() + TICK_BUDGET_MS;
  const summary = { started: 0, sent: 0, failed: 0, retried: 0, completed: 0 };

  try {
    await recoverStuckRecipients();
    await reconcileWebhookEvents();
    summary.started = await startDueScheduledCampaigns();

    const campaigns = await prisma.whatsAppCampaign.findMany({
      where: { status: "SENDING" },
      orderBy: { startedAt: "asc" },
    });

    for (const campaign of campaigns) {
      if (Date.now() >= deadline) break;
      const result = await processCampaign(campaign, deadline);
      summary.sent += result.sent;
      summary.failed += result.failed;
      summary.retried += result.retried;
      if (result.completed) summary.completed += 1;
      if (result.rateLimited) break; // the number is rate-limited — every campaign would hit it
    }
    return summary;
  } finally {
    queueRunning = false;
  }
}

async function startDueScheduledCampaigns() {
  const due = await prisma.whatsAppCampaign.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
  });
  let started = 0;
  for (const campaign of due) {
    try {
      assertSendingConfigured();
      await startCampaign(campaign);
      started += 1;
    } catch (err) {
      await prisma.whatsAppCampaign.update({
        where: { id: campaign.id },
        data: { status: "FAILED", lastError: err.message },
      });
      console.error(`❌ [whatsappCampaign] scheduled campaign ${campaign.id} could not start: ${err.message}`);
    }
  }
  return started;
}

// QUEUED for too long means the server stopped mid-send (deploy/crash). We
// can't know whether Meta got it, so we mark it FAILED instead of risking a
// duplicate message — "Retry failed" can resend it deliberately.
async function recoverStuckRecipients() {
  await prisma.whatsAppCampaignRecipient.updateMany({
    where: { status: "QUEUED", updatedAt: { lt: new Date(Date.now() - STUCK_AFTER_MS) } },
    data: {
      status: "FAILED",
      failedAt: new Date(),
      errorCode: "INTERRUPTED",
      errorText: "Server restarted before Meta confirmed — not resent automatically to avoid a duplicate",
    },
  });
}

async function processCampaign(campaign, deadline) {
  const result = { sent: 0, failed: 0, retried: 0, completed: false, rateLimited: false };

  const template = campaign.templateId
    ? await prisma.whatsAppTemplate.findUnique({ where: { id: campaign.templateId } })
    : null;
  if (!template || template.status === "DELETED") {
    await failCampaign(campaign.id, "The template was deleted in Meta");
    return result;
  }
  const params = campaignParams(campaign);

  const priorSuccesses = await prisma.whatsAppCampaignRecipient.count({
    where: { campaignId: campaign.id, messageId: { not: null } },
  });
  let successes = priorSuccesses;
  let hardFailuresInARow = 0;

  while (Date.now() < deadline) {
    // Admin may have paused/cancelled since the last round
    const fresh = await prisma.whatsAppCampaign.findUnique({ where: { id: campaign.id }, select: { status: true } });
    if (fresh?.status !== "SENDING") {
      if (fresh?.status === "CANCELLED") {
        await prisma.whatsAppCampaignRecipient.updateMany({
          where: { campaignId: campaign.id, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
      }
      break;
    }

    const now = new Date();
    const batch = await prisma.whatsAppCampaignRecipient.findMany({
      where: {
        campaignId: campaign.id,
        status: "PENDING",
        OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: now } }],
      },
      orderBy: { id: "asc" },
      take: BATCH_SIZE,
      include: { contact: { select: { name: true, optedIn: true, optedOutAt: true } } },
    });

    if (!batch.length) {
      const remaining = await prisma.whatsAppCampaignRecipient.count({
        where: { campaignId: campaign.id, status: { in: ["PENDING", "QUEUED"] } },
      });
      if (!remaining) {
        await prisma.whatsAppCampaign.updateMany({
          where: { id: campaign.id, status: "SENDING" },
          data: { status: "COMPLETED", completedAt: new Date() },
        });
        result.completed = true;
      }
      break; // either done, or only future retries left
    }

    // People who opted out after the campaign was queued are skipped.
    const optedOut = batch.filter((r) => r.contact.optedOutAt || !r.contact.optedIn);
    if (optedOut.length) {
      await prisma.whatsAppCampaignRecipient.updateMany({
        where: { id: { in: optedOut.map((r) => r.id) }, status: "PENDING" },
        data: { status: "SKIPPED", errorText: "Contact opted out" },
      });
    }
    const toSend = batch.filter((r) => !optedOut.includes(r));
    if (!toSend.length) continue;

    // Claim: only rows still PENDING become QUEUED (guards against double sends).
    await prisma.whatsAppCampaignRecipient.updateMany({
      where: { id: { in: toSend.map((r) => r.id) }, status: "PENDING" },
      data: { status: "QUEUED" },
    });

    let stop = null; // { kind, error }
    const outcomes = await mapWithConcurrency(toSend, SEND_CONCURRENCY, async (r) => {
      if (stop) return "deferred"; // stop signal from another worker — don't send
      try {
        const { messageId } = await sendTemplateMessage({
          to: r.phone,
          templateName: template.name,
          languageCode: template.language,
          components: buildTemplateComponents(template, params, { name: r.contact.name, phone: r.phone }),
        });
        successes += 1;
        hardFailuresInARow = 0;
        await prisma.whatsAppCampaignRecipient.update({
          where: { id: r.id },
          data: {
            status: "ACCEPTED",
            messageId,
            attempts: { increment: 1 },
            nextAttemptAt: null,
            errorCode: null,
            errorText: null,
          },
        });
        return "sent";
      } catch (err) {
        const kind = err instanceof MetaApiError ? err.kind : "RECIPIENT";
        const { code, text } = describeError(err);

        if (kind === "AUTH" || kind === "TEMPLATE" || kind === "RATE_LIMIT") {
          stop ??= { kind, error: err };
          await requeue(r.id, kind === "RATE_LIMIT" ? RATE_LIMIT_DELAY_MS : 0, false);
          return "deferred";
        }
        if (kind === "TEMPORARY" && r.attempts + 1 < MAX_ATTEMPTS) {
          await requeue(r.id, RETRY_DELAY_MS, true, code, text);
          return "retried";
        }
        await prisma.whatsAppCampaignRecipient.update({
          where: { id: r.id },
          data: { status: "FAILED", attempts: { increment: 1 }, failedAt: new Date(), errorCode: code, errorText: text },
        });
        if (kind === "OPTED_OUT") await optOutByPhone(r.phone);
        // Safety net: nothing has ever succeeded and the first sends all
        // fail → something campaign-wide is wrong (e.g. a bad image link).
        // Stop now instead of burning through the whole list.
        if (kind === "RECIPIENT") hardFailuresInARow += 1;
        if (successes === 0 && hardFailuresInARow >= EARLY_FAILURE_LIMIT) stop ??= { kind: "EARLY_FAILURE", error: err };
        return "failed";
      }
    });

    // Rows never attempted because of a stop signal go back to PENDING.
    await prisma.whatsAppCampaignRecipient.updateMany({
      where: { campaignId: campaign.id, status: "QUEUED", id: { in: toSend.map((r) => r.id) }, messageId: null },
      data: { status: "PENDING" },
    });

    for (const o of outcomes) {
      if (o === "sent") result.sent += 1;
      else if (o === "failed") result.failed += 1;
      else if (o === "retried") result.retried += 1;
    }

    if (stop) {
      const msg = describeError(stop.error).text;
      if (stop.kind === "AUTH") {
        await prisma.whatsAppCampaign.update({
          where: { id: campaign.id },
          data: { status: "PAUSED", lastError: `Paused — Meta rejected our credentials: ${msg}` },
        });
      } else if (stop.kind === "TEMPLATE") {
        await failCampaign(campaign.id, `Meta rejected the template: ${msg}`);
      } else if (stop.kind === "EARLY_FAILURE") {
        await failCampaign(
          campaign.id,
          `Stopped: the first ${EARLY_FAILURE_LIMIT} messages all failed (${msg}). Fix it, then Resume.`
        );
      } else {
        result.rateLimited = true;
        console.warn(`⏸️  [whatsappCampaign] Meta rate limit hit on campaign ${campaign.id} — resuming next minute`);
      }
      break;
    }
  }

  return result;
}

async function requeue(recipientId, delayMs, countAttempt, code, text) {
  await prisma.whatsAppCampaignRecipient.update({
    where: { id: recipientId },
    data: {
      status: "PENDING",
      nextAttemptAt: delayMs ? new Date(Date.now() + delayMs) : null,
      ...(countAttempt ? { attempts: { increment: 1 } } : {}),
      ...(code ? { errorCode: code, errorText: text } : {}),
    },
  });
}

async function failCampaign(campaignId, message) {
  await prisma.whatsAppCampaign.update({
    where: { id: campaignId },
    data: { status: "FAILED", lastError: message },
  });
  console.error(`❌ [whatsappCampaign] campaign ${campaignId} stopped: ${message}`);
}

// ── Status updates from the webhook ─────────────────────────────────────

const STATUS_RANK = { PENDING: 0, QUEUED: 0, ACCEPTED: 1, SENT: 2, DELIVERED: 3, READ: 4 };

// Applies one Meta status ("sent" | "delivered" | "read" | "failed") to the
// recipient with that wamid. Never moves a status backwards (Meta may send
// "delivered" after "read"). Returns false if no campaign recipient has
// this message id (yet).
export async function applyMessageStatus({ messageId, status, timestamp, errors }) {
  const recipient = await prisma.whatsAppCampaignRecipient.findUnique({ where: { messageId } });
  if (!recipient) return false;

  const s = String(status || "").toUpperCase();
  const at = timestamp ? new Date(Number(timestamp) * 1000) : new Date();
  const data = {};

  if (s === "FAILED") {
    if ((STATUS_RANK[recipient.status] ?? 0) >= STATUS_RANK.DELIVERED) return true; // already delivered — ignore
    const e = errors?.[0] || {};
    Object.assign(data, {
      status: "FAILED",
      failedAt: at,
      errorCode: e.code != null ? String(e.code) : "FAILED",
      errorText: e.error_data?.details || e.message || e.title || "Delivery failed",
    });
    if (String(e.code) === "131050") await optOutByPhone(recipient.phone);
  } else if (s in STATUS_RANK) {
    if (s === "SENT") data.sentAt = recipient.sentAt ?? at;
    if (s === "DELIVERED") Object.assign(data, { deliveredAt: recipient.deliveredAt ?? at, sentAt: recipient.sentAt ?? at });
    if (s === "READ") {
      Object.assign(data, {
        readAt: recipient.readAt ?? at,
        deliveredAt: recipient.deliveredAt ?? at,
        sentAt: recipient.sentAt ?? at,
      });
    }
    if (recipient.status !== "FAILED" && STATUS_RANK[s] > (STATUS_RANK[recipient.status] ?? 0)) data.status = s;
    if (recipient.status === "FAILED" && STATUS_RANK[s] >= STATUS_RANK.DELIVERED) {
      Object.assign(data, { status: s, errorCode: null, errorText: null, failedAt: null });
    }
  } else {
    return true; // unknown status (e.g. "deleted") — nothing to do
  }

  if (Object.keys(data).length) {
    await prisma.whatsAppCampaignRecipient.update({ where: { id: recipient.id }, data });
  }
  return true;
}

// A webhook can arrive before we've saved the wamid it refers to (Meta is
// fast). Those events are stored unprocessed; this applies them once the
// wamid exists. Events older than a day (e.g. messages sent by other apps on
// the same number) are left alone.
export async function reconcileWebhookEvents() {
  const events = await prisma.whatsAppWebhookEvent.findMany({
    where: {
      processedAt: null,
      messageId: { not: null },
      createdAt: { gt: new Date(Date.now() - 24 * 60 * 60_000) },
    },
    orderBy: { id: "asc" },
    take: 500,
  });
  for (const ev of events) {
    const applied = await applyMessageStatus({
      messageId: ev.messageId,
      status: ev.status,
      timestamp: ev.payload?.timestamp,
      errors: ev.payload?.errors,
    });
    if (applied) {
      await prisma.whatsAppWebhookEvent.update({ where: { id: ev.id }, data: { processedAt: new Date() } });
    }
  }
}
