// whatsapp/whatsappMeta.service.js
//
// 🆕 The ONLY file that talks to Meta's WhatsApp Cloud API (Graph API).
// Same call style as the School CRM (POST /{PHONE_NUMBER_ID}/messages with
// a template), plus template fetching and error classification for bulk
// campaigns.
//
// Required in server/.env:
//   WHATSAPP_TOKEN                 system-user token (whatsapp_business_messaging + whatsapp_business_management)
//   WHATSAPP_PHONE_NUMBER_ID       the sending number's id
//   WHATSAPP_BUSINESS_ACCOUNT_ID   the WABA id — needed to fetch templates
//   WHATSAPP_API_VERSION           e.g. v23.0 (same as School CRM)
// Optional:
//   WHATSAPP_GRAPH_BASE_URL        defaults to https://graph.facebook.com

const REQUEST_TIMEOUT_MS = 20_000;

export class WhatsAppConfigError extends Error {
  constructor(missing) {
    super(`WhatsApp is not configured. Missing in server/.env: ${missing.join(", ")}`);
    this.name = "WhatsAppConfigError";
    this.missing = missing;
  }
}

// Error kinds the campaign sender reacts to differently:
//   AUTH        token/permission/number problem → pause the whole campaign
//   TEMPLATE    template missing/paused/disabled/wrong params → stop the campaign
//   RATE_LIMIT  Meta asked us to slow down → stop this round, retry later
//   TEMPORARY   Meta/network hiccup → retry this recipient later
//   OPTED_OUT   recipient stopped marketing messages → fail + opt the contact out
//   RECIPIENT   problem with this one number/message → fail this recipient only
export class MetaApiError extends Error {
  constructor({ httpStatus, code, subcode, title, message, details, fbtraceId }) {
    super(message || title || `Meta API error ${code ?? httpStatus}`);
    this.name = "MetaApiError";
    this.httpStatus = httpStatus ?? null;
    this.code = code ?? null;
    this.subcode = subcode ?? null;
    this.details = details ?? null;
    this.fbtraceId = fbtraceId ?? null;
    this.kind = classifyMetaError(this);
  }
}

const AUTH_CODES = new Set([0, 10, 190, 200, 368, 131031, 133010]);
const TEMPLATE_CODES = new Set([132000, 132001, 132005, 132007, 132012, 132015, 132016]);
const RATE_LIMIT_CODES = new Set([4, 80007, 130429, 131048]);
const TEMPORARY_CODES = new Set([1, 2, 131000, 131016, 131056]);
const OPTED_OUT_CODES = new Set([131050]);

export function classifyMetaError({ httpStatus, code }) {
  const c = Number(code);
  if (AUTH_CODES.has(c)) return "AUTH";
  if (TEMPLATE_CODES.has(c)) return "TEMPLATE";
  if (RATE_LIMIT_CODES.has(c) || httpStatus === 429) return "RATE_LIMIT";
  if (OPTED_OUT_CODES.has(c)) return "OPTED_OUT";
  if (TEMPORARY_CODES.has(c)) return "TEMPORARY";
  if (httpStatus == null || httpStatus >= 500) return "TEMPORARY"; // network error / Meta outage
  if (httpStatus === 401 || httpStatus === 403) return "AUTH";
  return "RECIPIENT";
}

export function getWhatsAppConfig() {
  const config = {
    token: process.env.WHATSAPP_TOKEN?.trim(),
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID?.trim(),
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID?.trim(),
    apiVersion: (process.env.WHATSAPP_API_VERSION || "v23.0").trim(),
    baseUrl: (process.env.WHATSAPP_GRAPH_BASE_URL || "https://graph.facebook.com").replace(/\/+$/, ""),
  };
  return config;
}

// Which settings are present (never the values) — powers the dashboard's setup check.
export function getConfigStatus() {
  const c = getWhatsAppConfig();
  return {
    token: Boolean(c.token),
    phoneNumberId: Boolean(c.phoneNumberId),
    businessAccountId: Boolean(c.businessAccountId),
    apiVersion: c.apiVersion,
    webhookVerifyToken: Boolean(process.env.WHATSAPP_VERIFY_TOKEN?.trim()),
    appSecret: Boolean(process.env.META_APP_SECRET?.trim()),
  };
}

function requireConfig(...keys) {
  const c = getWhatsAppConfig();
  const envNames = {
    token: "WHATSAPP_TOKEN",
    phoneNumberId: "WHATSAPP_PHONE_NUMBER_ID",
    businessAccountId: "WHATSAPP_BUSINESS_ACCOUNT_ID",
  };
  const missing = keys.filter((k) => !c[k]).map((k) => envNames[k]);
  if (missing.length) throw new WhatsAppConfigError(missing);
  return c;
}

async function graphRequest(url, { method = "GET", body, token }) {
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    // Network failure or timeout — no HTTP status, treated as TEMPORARY
    throw new MetaApiError({ httpStatus: null, message: `Could not reach Meta: ${err.message}` });
  }

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 500) };
  }

  if (!res.ok || data.error) {
    const e = data.error || {};
    throw new MetaApiError({
      httpStatus: res.status,
      code: e.code,
      subcode: e.error_subcode,
      title: e.error_user_title,
      message: e.error_data?.details || e.error_user_msg || e.message || `HTTP ${res.status}`,
      details: e.error_data ?? null,
      fbtraceId: e.fbtrace_id,
    });
  }

  return data;
}

// 🟢 GET /{WABA_ID}/message_templates — every template, all pages.
export async function fetchAllTemplates() {
  const c = requireConfig("token", "businessAccountId");
  // No `fields=` list: Meta's default response already has id, name,
  // language, status, category, parameter_format and components, and an
  // explicit list can be rejected when a field isn't available on a version.
  let url = `${c.baseUrl}/${c.apiVersion}/${c.businessAccountId}/message_templates?limit=100`;

  const templates = [];
  let pages = 0;
  while (url && pages < 50) {
    const data = await graphRequest(url, { token: c.token });
    templates.push(...(data.data || []));
    url = data.paging?.next || null;
    pages += 1;
  }
  return templates;
}

// 🟢 Connection check for the dashboard: which WhatsApp Business Account and
// which phone number the .env values point to, and whether that number
// belongs to that account. Templates live in the account, so if the number
// is in a different account, sends fail with "template does not exist".
export async function checkConnection() {
  const c = getWhatsAppConfig();
  const result = { businessAccount: null, phoneNumber: null, phoneInAccount: null };
  const base = `${c.baseUrl}/${c.apiVersion}`;
  const wrap = async (fn) => {
    try {
      return await fn();
    } catch (err) {
      return { error: err.message, code: err.code ?? null };
    }
  };

  if (c.token && c.businessAccountId) {
    result.businessAccount = await wrap(async () => {
      const d = await graphRequest(`${base}/${c.businessAccountId}?fields=id,name`, { token: c.token });
      return { id: d.id, name: d.name || null };
    });
    if (!result.businessAccount.error && c.phoneNumberId) {
      const numbers = await wrap(async () => {
        const d = await graphRequest(`${base}/${c.businessAccountId}/phone_numbers?fields=id,display_phone_number`, {
          token: c.token,
        });
        return d.data || [];
      });
      if (Array.isArray(numbers)) {
        result.phoneInAccount = numbers.some((n) => String(n.id) === c.phoneNumberId);
        result.accountNumbers = numbers.map((n) => ({ id: n.id, displayPhoneNumber: n.display_phone_number }));
      }
    }
  }

  // Wrong / unreadable Business Account ID → list the accounts this token CAN
  // reach (from the token's granted scopes), so the admin can copy the right ID.
  if (c.token && result.businessAccount?.error) {
    const found = await wrap(async () => {
      const d = await graphRequest(
        `${base}/debug_token?input_token=${encodeURIComponent(c.token)}`,
        { token: c.token }
      );
      const ids = new Set();
      for (const s of d.data?.granular_scopes || []) {
        if (String(s.scope).startsWith("whatsapp_business")) (s.target_ids || []).forEach((id) => ids.add(String(id)));
      }
      const accounts = [];
      for (const id of ids) {
        try {
          const a = await graphRequest(`${base}/${id}?fields=id,name`, { token: c.token });
          accounts.push({ id: a.id, name: a.name || null });
        } catch {
          accounts.push({ id, name: null });
        }
      }
      return accounts;
    });
    if (Array.isArray(found)) result.accessibleBusinessAccounts = found;
  }

  if (c.token && c.phoneNumberId) {
    result.phoneNumber = await wrap(async () => {
      const d = await graphRequest(
        `${base}/${c.phoneNumberId}?fields=id,display_phone_number,verified_name,quality_rating`,
        { token: c.token }
      );
      return {
        id: d.id,
        displayPhoneNumber: d.display_phone_number || null,
        verifiedName: d.verified_name || null,
        qualityRating: d.quality_rating || null,
      };
    });
  }
  return result;
}

// 🟢 POST /{PHONE_NUMBER_ID}/messages — send one approved template.
// Returns the message id (wamid) Meta assigned.
export async function sendTemplateMessage({ to, templateName, languageCode, components }) {
  const c = requireConfig("token", "phoneNumberId");

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components?.length ? { components } : {}),
    },
  };

  const data = await graphRequest(`${c.baseUrl}/${c.apiVersion}/${c.phoneNumberId}/messages`, {
    method: "POST",
    body,
    token: c.token,
  });

  const messageId = data.messages?.[0]?.id;
  if (!messageId) {
    throw new MetaApiError({ httpStatus: 200, message: "Meta accepted the request but returned no message id" });
  }
  return { messageId, waId: data.contacts?.[0]?.wa_id ?? null };
}