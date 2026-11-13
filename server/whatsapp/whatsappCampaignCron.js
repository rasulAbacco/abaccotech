// whatsapp/whatsappCampaignCron.js
//
// 🆕 Runs the WhatsApp campaign queue every minute: starts scheduled
// campaigns that are due, sends the next batches of running campaigns,
// retries temporary failures, and applies late webhook statuses.
// Same pattern as schoolSyncCron / motorDeskSyncCron. Launching or resuming
// a campaign also runs the queue immediately, so "Send now" doesn't wait
// for the next minute.

import cron from "node-cron";
import { processCampaignQueue } from "./whatsappCampaign.service.js";

const CRON_SCHEDULE = "* * * * *"; // every minute

const runTick = async () => {
  try {
    const summary = await processCampaignQueue();
    if (summary.skipped) return; // previous run still sending
    const { started, sent, failed, retried, completed } = summary;
    if (started || sent || failed || retried || completed) {
      console.log(
        `📨 [whatsappCampaignCron] ${new Date().toISOString()} — started: ${started}, sent: ${sent}, ` +
          `failed: ${failed}, retrying: ${retried}, completed: ${completed}`
      );
    }
  } catch (err) {
    console.error(`❌ [whatsappCampaignCron] ${new Date().toISOString()} — run failed: ${err.message}`);
  }
};

export const startWhatsAppCampaignCron = () => {
  cron.schedule(CRON_SCHEDULE, runTick);
  console.log(`🕒 [whatsappCampaignCron] Registered — runs every minute (${CRON_SCHEDULE}).`);
};
