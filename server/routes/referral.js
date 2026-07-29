// routes/referral.js
import express from "express";
import * as referralController from "../controllers/referralController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Called by external projects (Bounce Cure, School CRM, etc.) when a user
// registers there using a vendor's referral code. Intentionally public/unauthenticated
// since the caller is another server, not a logged-in Abacco Tech user.
router.post("/register", referralController.registerReferral);

// 🆕 GET /referral/me (protected) — the logged-in vendor's own details + stats +
// referral list, resolved from the JWT. Powers VendorsList.jsx and the
// User Dashboard's "Total Referral Websites" / "Total Referral Users" cards.
router.get("/me", protect, referralController.getMyVendorDetails);

// 🆕 GET /referral/admin/overview (admin only) — platform-wide counts
// (Total Vendors, Total Referral Users) for the Admin Dashboard cards.
router.get("/admin/overview", protect, requireAdmin, referralController.getAdminOverview);

// 🟢 All referred users for a vendor, newest first
router.get("/vendor/:vendorId", referralController.getVendorReferrals);

// 🟢 Aggregate counts (total / active / paid / trial) for a vendor
router.get("/stats/:vendorId", referralController.getVendorStats);

// 🟢 Combined payload for the Vendor Details page: vendor info + stats + referrals
router.get("/details/:vendorId", referralController.getVendorDetails);

// 🗑️ REMOVED: POST /referral/sync/bounce-cure and its runBounceCureSync
// import. Both Bounce Cure and School CRM push referrals directly to
// /register now (see conversation history) — this pull-based manual sync
// trigger and its underlying cron job are leftover from the earlier design
// and were left running against endpoints/env vars that may no longer
// exist, producing silent errors every 15 minutes for nothing. Safe to
// delete services/referralSyncService.js, controllers/referralSyncController.js,
// and cron/bounceCureSyncCron.js entirely if you don't want to keep them
// around as a manual fallback option.

export default router;