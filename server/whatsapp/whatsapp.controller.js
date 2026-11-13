// whatsapp/whatsapp.controller.js
//
// 🆕 Admin-only WhatsApp campaign endpoints (mounted at /api/whatsapp).
// Thin layer: reads the request, calls a service, maps errors to HTTP.

import { MetaApiError, WhatsAppConfigError, checkConnection, getConfigStatus } from "./whatsappMeta.service.js";
import { listTemplates, syncTemplatesFromMeta } from "./whatsappTemplate.service.js";
import {
  addContact,
  countAudience,
  deleteContact,
  importContacts,
  listContacts,
  listTags,
  parseContactFile,
  setContactOptOut,
} from "./whatsappContact.service.js";
import {
  CampaignError,
  cancelCampaign,
  createCampaign,
  deleteCampaign,
  getCampaignDetails,
  launchCampaign,
  listCampaigns,
  listRecipients,
  pauseCampaign,
  resumeCampaign,
  retryFailedRecipients,
  sendTestMessage,
  updateCampaign,
} from "./whatsappCampaign.service.js";

// Every handler goes through this so errors come back as { message, ... }
// (the shape the React app already reads).
const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    if (!res.headersSent) res.status(200).json({ success: true, ...result });
  } catch (err) {
    if (err instanceof CampaignError) {
      return res.status(err.status).json({ success: false, message: err.message, errors: err.details });
    }
    if (err instanceof WhatsAppConfigError) {
      return res.status(400).json({ success: false, message: err.message, missing: err.missing });
    }
    if (err instanceof MetaApiError) {
      return res.status(502).json({
        success: false,
        message: `Meta: ${err.message}`,
        metaCode: err.code,
        kind: err.kind,
      });
    }
    if (err?.code === "P2025") return res.status(404).json({ success: false, message: "Not found" });
    if (err?.status) return res.status(err.status).json({ success: false, message: err.message });
    console.error("❌ [whatsapp] request failed:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const idParam = (req) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new CampaignError("Invalid id");
  return id;
};

// ── Setup ───────────────────────────────────────────────────────────────

// ?check=1 also asks Meta which account/number these values point to.
export const getStatus = handle(async (req) => ({
  config: getConfigStatus(),
  ...(req.query.check === "1" ? { connection: await checkConnection() } : {}),
}));

// ── Templates ───────────────────────────────────────────────────────────

export const getTemplates = handle(async (req) => ({
  templates: await listTemplates({ includeAll: req.query.all === "1" }),
}));

export const syncTemplates = handle(async () => {
  const summary = await syncTemplatesFromMeta();
  return { summary, templates: await listTemplates() };
});

// ── Contacts ────────────────────────────────────────────────────────────

export const getContacts = handle(async (req) =>
  listContacts({
    search: req.query.search?.trim() || undefined,
    tag: req.query.tag || undefined,
    status: req.query.status || "active",
    page: req.query.page,
    pageSize: req.query.pageSize,
  })
);

export const getTags = handle(async () => ({ tags: await listTags() }));

export const getAudienceCount = handle(async (req) => ({
  count: await countAudience(req.query.tag || null),
}));

export const createContact = handle(async (req) => ({ contact: await addContact(req.body || {}) }));

export const uploadContacts = handle(async (req) => {
  if (!req.file) throw new CampaignError("Choose a .csv or .xlsx file");
  // Meta requires recipients to have agreed to receive messages.
  if (String(req.body.confirmOptIn) !== "true") {
    throw new CampaignError("Please confirm these contacts agreed to receive WhatsApp messages");
  }
  let rows;
  try {
    rows = await parseContactFile(req.file.buffer, req.file.originalname);
  } catch (err) {
    throw new CampaignError(err.message);
  }
  if (!rows.length) throw new CampaignError("The file has no rows");
  const summary = await importContacts(rows, { defaultTag: req.body.tag?.trim() || null });
  return { summary };
});

export const optOutContact = handle(async (req) => ({ contact: await setContactOptOut(idParam(req), true) }));
export const optInContact = handle(async (req) => ({ contact: await setContactOptOut(idParam(req), false) }));

export const removeContact = handle(async (req) => {
  await deleteContact(idParam(req));
  return {};
});

export const downloadSampleCsv = (req, res) => {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="whatsapp-contacts-sample.csv"');
  res.send("phone,name,tag\n9876543210,Ravi Kumar,supermarkets\n+919812345678,Priya,supermarkets\n");
};

// ── Campaigns ───────────────────────────────────────────────────────────

export const getCampaigns = handle(async (req) => ({
  campaigns: await listCampaigns({ status: req.query.status || undefined }),
}));

export const postCampaign = handle(async (req, res) => {
  const campaign = await createCampaign(req.body || {}, req.user?.userId);
  res.status(201).json({ success: true, campaign });
});

export const getCampaign = handle(async (req) => ({ campaign: await getCampaignDetails(idParam(req)) }));

export const putCampaign = handle(async (req) => ({ campaign: await updateCampaign(idParam(req), req.body || {}) }));

export const removeCampaign = handle(async (req) => {
  await deleteCampaign(idParam(req));
  return {};
});

export const getRecipients = handle(async (req) =>
  listRecipients(idParam(req), {
    status: req.query.status || undefined,
    search: req.query.search || undefined,
    page: req.query.page,
    pageSize: req.query.pageSize,
  })
);

// body: {} = send now, { scheduledAt: ISO string } = schedule
export const launch = handle(async (req) => ({
  campaign: await launchCampaign(idParam(req), { scheduledAt: req.body?.scheduledAt || null }),
}));

export const pause = handle(async (req) => ({ campaign: await pauseCampaign(idParam(req)) }));
export const resume = handle(async (req) => ({ campaign: await resumeCampaign(idParam(req)) }));
export const cancel = handle(async (req) => ({ campaign: await cancelCampaign(idParam(req)) }));
export const retryFailed = handle(async (req) => retryFailedRecipients(idParam(req)));

export const testSend = handle(async (req) => ({ result: await sendTestMessage(req.body || {}) }));