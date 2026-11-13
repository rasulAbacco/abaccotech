// whatsapp/whatsappWebhook.controller.js
//
// 🆕 Public endpoint Meta calls (NO login — Meta can't log in). Security is
// the X-Hub-Signature-256 check against META_APP_SECRET instead.
//
//   GET  /webhooks/whatsapp  → one-time verification when you add the URL in Meta
//   POST /webhooks/whatsapp  → message statuses (sent/delivered/read/failed)
//                              and incoming replies (STOP / START)
//
// If the School CRM number is in the same Meta app, its events arrive here
// too — they're ignored because their phone_number_id doesn't match ours.

import crypto from "crypto";
import prisma from "./prisma.js";
import { applyMessageStatus } from "./whatsappCampaign.service.js";
import { optInByPhone, optOutByPhone } from "./whatsappContact.service.js";

const STOP_WORDS = new Set(["STOP", "UNSUBSCRIBE", "STOP PROMOTIONS", "STOP PROMOTION", "OPT OUT", "OPTOUT"]);
const START_WORDS = new Set(["START", "SUBSCRIBE", "RESUME PROMOTIONS"]);

// 🟢 GET — Meta sends hub.mode / hub.verify_token / hub.challenge
export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const expected = process.env.WHATSAPP_VERIFY_TOKEN?.trim();

  if (mode === "subscribe" && expected && token === expected) {
    console.log("✅ [whatsappWebhook] Webhook verified by Meta");
    return res.status(200).type("text/plain").send(String(challenge ?? ""));
  }
  console.warn("❌ [whatsappWebhook] Verification failed — check WHATSAPP_VERIFY_TOKEN");
  return res.sendStatus(403);
};

export function isValidSignature(rawBody, signatureHeader, appSecret) {
  if (!rawBody || !signatureHeader || !appSecret) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signatureHeader));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// 🟢 POST — answer 200 fast (Meta retries slow/failed calls), then process.
export const receiveWebhook = (req, res) => {
  const appSecret = process.env.META_APP_SECRET?.trim();
  if (!appSecret) {
    console.error("❌ [whatsappWebhook] META_APP_SECRET is not set — rejecting webhook");
    return res.sendStatus(500);
  }
  if (!isValidSignature(req.rawBody, req.get("x-hub-signature-256"), appSecret)) {
    console.warn("❌ [whatsappWebhook] Invalid signature — ignored");
    return res.sendStatus(401);
  }

  res.sendStatus(200);

  processWebhookPayload(req.body).catch((err) =>
    console.error("❌ [whatsappWebhook] processing failed:", err)
  );
};

// Stores the event once; returns null if we've already seen it (Meta re-delivers).
async function recordEvent({ eventKey, messageId = null, status = null, payload }) {
  try {
    return await prisma.whatsAppWebhookEvent.create({
      data: { eventKey, messageId, status, payload },
    });
  } catch (err) {
    if (err.code === "P2002") return null; // duplicate
    throw err;
  }
}

export async function processWebhookPayload(body) {
  if (body?.object !== "whatsapp_business_account") return;
  const ourNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "messages") continue;
      const value = change.value || {};
      if (ourNumberId && value.metadata?.phone_number_id !== ourNumberId) continue; // another number's event

      // Delivery statuses for messages we sent
      for (const st of value.statuses || []) {
        const event = await recordEvent({
          eventKey: `${st.id}:${st.status}`,
          messageId: st.id,
          status: st.status,
          payload: st,
        });
        if (!event) continue;
        const applied = await applyMessageStatus({
          messageId: st.id,
          status: st.status,
          timestamp: st.timestamp,
          errors: st.errors,
        });
        // Not applied = wamid not saved yet (or not a campaign message);
        // the campaign cron retries these for 24h.
        if (applied) {
          await prisma.whatsAppWebhookEvent.update({ where: { id: event.id }, data: { processedAt: new Date() } });
        }
      }

      // Incoming replies — only STOP/START matter here
      for (const msg of value.messages || []) {
        const text = (
          msg.text?.body ||
          msg.button?.text ||
          msg.button?.payload ||
          msg.interactive?.button_reply?.title ||
          ""
        )
          .trim()
          .toUpperCase();

        const action = STOP_WORDS.has(text) ? "STOP" : START_WORDS.has(text) ? "START" : null;
        if (!action || !msg.from) continue;

        const event = await recordEvent({
          eventKey: `msg:${msg.id}`,
          status: action,
          payload: { from: msg.from, text, timestamp: msg.timestamp },
        });
        if (!event) continue;

        const count = action === "STOP" ? await optOutByPhone(msg.from) : await optInByPhone(msg.from);
        await prisma.whatsAppWebhookEvent.update({ where: { id: event.id }, data: { processedAt: new Date() } });
        if (count) console.log(`📵 [whatsappWebhook] ${msg.from} replied ${action} — contact updated`);
      }
    }
  }
}
