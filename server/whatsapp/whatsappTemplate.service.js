// whatsapp/whatsappTemplate.service.js
//
// 🆕 Templates are created and approved in Meta (WhatsApp Manager), never
// here. This file:
//   1. syncs them from Meta into the WhatsAppTemplate table,
//   2. reads each template's structure (header / variables / buttons) so the
//      dashboard can show the right form for ANY template,
//   3. validates a campaign's values against that structure, and
//   4. builds the `components` array Meta needs for each contact.

import prisma from "./prisma.js";
import { fetchAllTemplates } from "./whatsappMeta.service.js";

const MEDIA_HEADERS = new Set(["IMAGE", "VIDEO", "DOCUMENT"]);
const SUPPORTED_BUTTONS = new Set(["QUICK_REPLY", "URL", "PHONE_NUMBER", "COPY_CODE"]);
const NAME_FALLBACK = "Customer";

// ── Parsing ─────────────────────────────────────────────────────────────

// "Hi {{1}}, get {{2}}" → ["1","2"];  "Hi {{customer_name}}" → ["customer_name"]
export function extractVariables(text, parameterFormat = "POSITIONAL") {
  if (!text) return [];
  const found = [];
  for (const m of text.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)) {
    if (!found.includes(m[1])) found.push(m[1]);
  }
  if (parameterFormat !== "NAMED") found.sort((a, b) => Number(a) - Number(b));
  return found;
}

// Turns Meta's raw template into the fields we store.
export function parseMetaTemplate(t) {
  const parameterFormat = (t.parameter_format || "POSITIONAL").toUpperCase();
  const components = Array.isArray(t.components) ? t.components : [];
  const find = (type) => components.find((c) => (c.type || "").toUpperCase() === type);

  const header = find("HEADER");
  const body = find("BODY");
  const footer = find("FOOTER");
  const buttonsComp = find("BUTTONS");

  const headerFormat = header ? (header.format || "TEXT").toUpperCase() : null;
  const headerText = headerFormat === "TEXT" ? header.text || "" : null;

  const buttons = (buttonsComp?.buttons || []).map((b, index) => {
    const type = (b.type || "").toUpperCase();
    return {
      index,
      type,
      text: b.text || "",
      url: b.url || null,
      hasVariable: type === "URL" ? /\{\{.*?\}\}/.test(b.url || "") : type === "COPY_CODE",
    };
  });

  return {
    metaTemplateId: String(t.id),
    name: t.name,
    language: t.language,
    category: t.category || null,
    status: (t.status || "UNKNOWN").toUpperCase(),
    parameterFormat,
    headerFormat,
    headerText,
    headerVariables: extractVariables(headerText, parameterFormat),
    bodyText: body?.text || null,
    bodyVariables: extractVariables(body?.text, parameterFormat),
    footerText: footer?.text || null,
    buttons,
    components,
  };
}

// Why a template can't be used for a bulk campaign (null = usable).
export function getUnsupportedReason(template) {
  if (template.category === "AUTHENTICATION") return "Authentication (OTP) templates can't be used in campaigns";
  if (template.headerFormat === "LOCATION") return "Location headers aren't supported yet";
  const types = (template.components || []).map((c) => (c.type || "").toUpperCase());
  if (types.includes("CAROUSEL")) return "Carousel templates aren't supported yet";
  if (types.includes("LIMITED_TIME_OFFER")) return "Limited-time-offer templates aren't supported yet";
  const badButton = (template.buttons || []).find((b) => !SUPPORTED_BUTTONS.has(b.type));
  if (badButton) return `${badButton.type} buttons aren't supported yet`;
  return null;
}

// Shape sent to the dashboard: everything it needs to build the form.
export function toTemplateDto(t) {
  const unsupportedReason = getUnsupportedReason(t);
  return {
    id: t.id,
    metaTemplateId: t.metaTemplateId,
    name: t.name,
    language: t.language,
    category: t.category,
    status: t.status,
    parameterFormat: t.parameterFormat,
    header: t.headerFormat
      ? { format: t.headerFormat, text: t.headerText, variables: t.headerVariables || [] }
      : null,
    body: { text: t.bodyText, variables: t.bodyVariables || [] },
    footer: t.footerText,
    buttons: t.buttons || [],
    usable: t.status === "APPROVED" && !unsupportedReason,
    unsupportedReason,
    lastSyncedAt: t.lastSyncedAt,
  };
}

// ── Sync from Meta ──────────────────────────────────────────────────────

export async function syncTemplatesFromMeta() {
  const metaTemplates = await fetchAllTemplates();
  const now = new Date();
  const seenIds = [];
  let created = 0;
  let updated = 0;

  for (const raw of metaTemplates) {
    const data = parseMetaTemplate(raw);
    seenIds.push(data.metaTemplateId);

    // Match by Meta id first; fall back to name+language (a template deleted
    // and re-created in Meta gets a new id but should reuse our row).
    const existing =
      (await prisma.whatsAppTemplate.findUnique({ where: { metaTemplateId: data.metaTemplateId } })) ||
      (await prisma.whatsAppTemplate.findUnique({
        where: { name_language: { name: data.name, language: data.language } },
      }));

    if (existing) {
      await prisma.whatsAppTemplate.update({
        where: { id: existing.id },
        data: { ...data, lastSyncedAt: now },
      });
      updated += 1;
    } else {
      await prisma.whatsAppTemplate.create({ data: { ...data, lastSyncedAt: now } });
      created += 1;
    }
  }

  // Anything we have locally that Meta no longer returns was deleted in Meta.
  const { count: markedDeleted } = await prisma.whatsAppTemplate.updateMany({
    where: { metaTemplateId: { notIn: seenIds }, status: { not: "DELETED" } },
    data: { status: "DELETED", lastSyncedAt: now },
  });

  return {
    total: metaTemplates.length,
    approved: metaTemplates.filter((t) => String(t.status).toUpperCase() === "APPROVED").length,
    created,
    updated,
    markedDeleted,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID?.trim() || null,
  };
}

export async function listTemplates({ includeAll = false } = {}) {
  const templates = await prisma.whatsAppTemplate.findMany({
    where: includeAll ? {} : { status: { not: "DELETED" } },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
  return templates.map(toTemplateDto);
}

// ── Campaign values: validation + building the message ──────────────────

const isHttpsUrl = (v) => {
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
};

// Normalises what the dashboard sent into the shape we store on the campaign.
export function normaliseCampaignParams(template, input = {}) {
  const headerVars = template.headerVariables || [];
  const bodyVars = template.bodyVariables || [];
  const asArray = (v, n) => Array.from({ length: n }, (_, i) => String(v?.[i] ?? "").trim());

  const buttonParams = {};
  for (const b of template.buttons || []) {
    if (b.hasVariable) buttonParams[b.index] = String(input.buttonParams?.[b.index] ?? "").trim();
  }

  return {
    headerImageUrl: MEDIA_HEADERS.has(template.headerFormat)
      ? String(input.headerImageUrl || "").trim() || null
      : null,
    headerParams: asArray(input.headerParams, headerVars.length),
    bodyParams: asArray(input.bodyParams, bodyVars.length),
    buttonParams,
  };
}

// Returns a list of human-readable problems (empty = OK).
export function validateCampaignParams(template, params) {
  const errors = [];
  const reason = getUnsupportedReason(template);
  if (reason) errors.push(reason);
  if (template.status !== "APPROVED") errors.push(`Template "${template.name}" is ${template.status}, not APPROVED`);

  if (MEDIA_HEADERS.has(template.headerFormat)) {
    if (!params.headerImageUrl) {
      errors.push(`This template needs a ${template.headerFormat.toLowerCase()} for its header`);
    } else if (!isHttpsUrl(params.headerImageUrl)) {
      errors.push("Header media must be a public https:// link");
    }
  }

  (template.headerVariables || []).forEach((v, i) => {
    if (!params.headerParams?.[i]) errors.push(`Header variable {{${v}}} is empty`);
  });
  (template.bodyVariables || []).forEach((v, i) => {
    if (!params.bodyParams?.[i]) errors.push(`Body variable {{${v}}} is empty`);
  });
  for (const b of template.buttons || []) {
    if (b.hasVariable && !params.buttonParams?.[b.index]) {
      errors.push(`Button "${b.text}" needs a value`);
    }
  }
  return errors;
}

// {{name}} / {{phone}} inside a value → this contact's details.
export function personalise(value, contact) {
  return String(value ?? "")
    .replace(/\{\{\s*name\s*\}\}/gi, contact?.name?.trim() || NAME_FALLBACK)
    .replace(/\{\{\s*phone\s*\}\}/gi, contact?.phone || "");
}

// Builds Meta's `components` array for one contact.
export function buildTemplateComponents(template, params, contact) {
  const named = template.parameterFormat === "NAMED";
  const textParam = (varName, value) => ({
    type: "text",
    text: personalise(value, contact),
    ...(named ? { parameter_name: varName } : {}),
  });

  const components = [];

  if (MEDIA_HEADERS.has(template.headerFormat) && params.headerImageUrl) {
    const kind = template.headerFormat.toLowerCase(); // image | video | document
    components.push({
      type: "header",
      parameters: [{ type: kind, [kind]: { link: params.headerImageUrl } }],
    });
  } else if (template.headerFormat === "TEXT" && (template.headerVariables || []).length) {
    components.push({
      type: "header",
      parameters: template.headerVariables.map((v, i) => textParam(v, params.headerParams?.[i])),
    });
  }

  if ((template.bodyVariables || []).length) {
    components.push({
      type: "body",
      parameters: template.bodyVariables.map((v, i) => textParam(v, params.bodyParams?.[i])),
    });
  }

  for (const b of template.buttons || []) {
    if (!b.hasVariable) continue;
    const value = personalise(params.buttonParams?.[b.index], contact);
    if (b.type === "URL") {
      components.push({
        type: "button",
        sub_type: "url",
        index: String(b.index),
        parameters: [{ type: "text", text: value }],
      });
    } else if (b.type === "COPY_CODE") {
      components.push({
        type: "button",
        sub_type: "copy_code",
        index: String(b.index),
        parameters: [{ type: "coupon_code", coupon_code: value }],
      });
    }
  }

  return components;
}

// Plain-text preview of the message for one contact (dashboard preview / test send).
export function renderPreview(template, params, contact) {
  const fill = (text, vars, values) =>
    (vars || []).reduce(
      (out, v, i) => out.replaceAll(new RegExp(`\\{\\{\\s*${v}\\s*\\}\\}`, "g"), personalise(values?.[i], contact)),
      text || ""
    );
  return {
    header:
      template.headerFormat === "TEXT"
        ? fill(template.headerText, template.headerVariables, params.headerParams)
        : template.headerFormat
          ? `[${template.headerFormat.toLowerCase()}] ${params.headerImageUrl || ""}`.trim()
          : null,
    body: fill(template.bodyText, template.bodyVariables, params.bodyParams),
    footer: template.footerText,
    buttons: (template.buttons || []).map((b) => b.text),
  };
}