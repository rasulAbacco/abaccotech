// controllers/motorDeskSync.controller.js
import { syncMotorDeskReferrals, MotorDeskSyncError } from "../services/motorDeskSync.service.js";

// 🟢 POST /sync/motor-desk/run (admin only)
// Pulls the current list of referred payments from Motor Desk and upserts
// them into the Referral table. Safe to call repeatedly — the underlying
// service dedupes on (website, externalId), so re-running never creates
// duplicate rows, it just refreshes status/plan on existing ones.
//
// Trigger this manually from an admin panel button, or point a scheduled
// cron job at it (e.g. every 5 minutes) — see cron/motorDeskSyncCron.js.
export const runMotorDeskSync = async (req, res) => {
  try {
    const summary = await syncMotorDeskReferrals();

    return res.status(200).json({
      success: true,
      message: "Motor Desk referral sync completed.",
      data: summary,
    });
  } catch (err) {
    if (err instanceof MotorDeskSyncError) {
      return res.status(err.statusCode || 502).json({
        success: false,
        message: err.message,
      });
    }

    console.error("❌ Motor Desk sync error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while syncing referrals from Motor Desk.",
    });
  }
};