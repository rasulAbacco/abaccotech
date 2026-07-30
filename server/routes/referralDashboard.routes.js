// routes/referralDashboard.routes.js
import express from "express";
import * as referralDashboardController from "../controllers/referralDashboard.controller.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔄 CHANGED: now admin-only (previously just `protect`, scoped to the
// logged-in vendor's own referrals). These pages show platform-wide data
// across every vendor, so they're admin-only both in the sidebar
// (Sidebar.jsx), the frontend route guard (AdminRoute.jsx), and here.
router.get("/deals", protect, requireAdmin, referralDashboardController.getDeals);
router.get("/follow-ups", protect, requireAdmin, referralDashboardController.getFollowUps);
router.get("/renewals", protect, requireAdmin, referralDashboardController.getRenewals);
router.get(
  "/renewals-cancelled",
  protect,
  requireAdmin,
  referralDashboardController.getRenewalsCancelled
);
router.get("/reports", protect, requireAdmin, referralDashboardController.getReports);

export default router;