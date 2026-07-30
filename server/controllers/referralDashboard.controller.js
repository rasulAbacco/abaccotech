// controllers/referralDashboard.controller.js
import * as referralDashboardService from "../services/referralDashboard.service.js";

// 🟢 GET /api/referral-dashboard/deals (admin only) — every referred user
// across every vendor, with complete synced payment details.
export const getDeals = async (req, res) => {
  try {
    const deals = await referralDashboardService.getDeals();

    return res.status(200).json({
      success: true,
      message: "Deals fetched successfully",
      data: deals,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get deals error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching deals.",
    });
  }
};

// 🟢 GET /api/referral-dashboard/follow-ups (admin only) — referrals that
// need a follow-up: pending payment, trial users, expired plans, upcoming
// expiry/billing, or any other unpaid/cancelled subscription.
export const getFollowUps = async (req, res) => {
  try {
    const followUps = await referralDashboardService.getFollowUps();

    return res.status(200).json({
      success: true,
      message: "Follow-ups fetched successfully",
      data: followUps,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get follow-ups error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching follow-ups.",
    });
  }
};

// 🟢 GET /api/referral-dashboard/renewals (admin only) — referrals whose
// expiryDate or nextBillingDate falls within the next 30 days, with
// daysLeft computed per row.
export const getRenewals = async (req, res) => {
  try {
    const renewals = await referralDashboardService.getRenewals();

    return res.status(200).json({
      success: true,
      message: "Renewals fetched successfully",
      data: renewals,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get renewals error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching renewals.",
    });
  }
};

// 🟢 GET /api/referral-dashboard/renewals-cancelled (admin only) —
// referrals with a CANCELLED / EXPIRED / PAYMENT_FAILED status.
export const getRenewalsCancelled = async (req, res) => {
  try {
    const cancelled = await referralDashboardService.getRenewalsCancelled();

    return res.status(200).json({
      success: true,
      message: "Cancelled renewals fetched successfully",
      data: cancelled,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get cancelled renewals error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cancelled renewals.",
    });
  }
};

// 🟢 GET /api/referral-dashboard/reports (admin only) — aggregate stats:
// totals, revenue, plan-wise/status-wise counts, monthly revenue summary.
export const getReports = async (req, res) => {
  try {
    const reports = await referralDashboardService.getReports();

    return res.status(200).json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get reports error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching reports.",
    });
  }
};