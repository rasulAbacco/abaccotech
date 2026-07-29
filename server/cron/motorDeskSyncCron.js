// cron/motorDeskSyncCron.js
//
// 🆕 Automatic referral synchronization for Motor Desk.
//
// This does NOT duplicate any sync logic — it just calls the existing
// `syncMotorDeskReferrals` from services/motorDeskSync.service.js on a
// schedule, exactly the same function that POST /sync/motor-desk/run
// already calls. That manual endpoint is untouched and still works if
// someone wants to trigger a sync on demand.
//
// Mirrors cron/schoolSyncCron.js exactly.

import cron from "node-cron";
import { syncMotorDeskReferrals, MotorDeskSyncError } from "../services/motorDeskSync.service.js";

const CRON_SCHEDULE = "*/5 * * * *"; // every 5 minutes

// Simple in-process lock: if a sync run somehow takes longer than 5
// minutes (e.g. Motor Desk is slow), skip the next tick instead of
// letting two runs overlap and race each other.
let isSyncRunning = false;

const runScheduledSync = async () => {
  if (isSyncRunning) {
    console.warn("⏭️  [motorDeskSyncCron] Previous sync still running — skipping this tick.");
    return;
  }

  isSyncRunning = true;
  const startedAt = new Date().toISOString();

  try {
    const summary = await syncMotorDeskReferrals();

    // 🆕 Required logging: created / updated / skipped / failed counts.
    console.log(
      `✅ [motorDeskSyncCron] ${startedAt} — Motor Desk referral sync completed | ` +
        `total: ${summary.total}, created: ${summary.created}, ` +
        `updated: ${summary.updated}, skipped: ${summary.skipped}, ` +
        `failed: ${summary.failed}`
    );

    if (summary.errors?.length > 0) {
      console.warn(`⚠️  [motorDeskSyncCron] ${summary.errors.length} record(s) had issues:`, summary.errors);
    }
  } catch (err) {
    // 🛡️ A failed run must never crash the process or cancel future
    // scheduled runs — node-cron keeps firing on schedule regardless of
    // whether this callback throws or resolves.
    if (err instanceof MotorDeskSyncError) {
      console.error(`❌ [motorDeskSyncCron] ${startedAt} — sync failed: ${err.message}`);
    } else {
      console.error(`❌ [motorDeskSyncCron] ${startedAt} — sync failed unexpectedly:`, err);
    }
  } finally {
    isSyncRunning = false;
  }
};

// 🟢 Call once from server.js at startup to register the schedule.
export const startMotorDeskSyncCron = () => {
  console.log(`🕒 [motorDeskSyncCron] Registered — runs every 5 minutes (${CRON_SCHEDULE}).`);

  // Run immediately on startup
  runScheduledSync().catch(console.error);

  // Then continue every 5 minutes
  cron.schedule(CRON_SCHEDULE, runScheduledSync);
};