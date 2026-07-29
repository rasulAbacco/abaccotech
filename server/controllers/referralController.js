// controllers/referralController.js
import * as referralService from "../services/referralService.js";

// ✅ Basic validators — phone/email are validated for FORMAT when present,
// but neither is hard-required anymore, since not every source has both
// (Bounce Cure has no phone field at all; some sources might not collect
// email either).
const isValidPhone = (val) => !val || /^\d{7,15}$/.test(val);
const isValidEmail = (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

// 🟢 POST /referral/register
// Public/unauthenticated by design — called directly by external sites
// (Bounce Cure, School CRM, etc.) right when someone signs up or checks out
// using a vendor's referral code. Safe to call more than once for the same
// person (e.g. once at signup, again when payment succeeds) — see
// referralService.registerReferral, which updates rather than duplicates.
export const registerReferral = async (req, res) => {
  try {
    const { referralCode, website, userName, email, phone, plan, status } = req.body;

    if (!referralCode) {
      return res.status(400).json({ success: false, message: "Referral code is required." });
    }
    if (!website) {
      return res.status(400).json({ success: false, message: "Website is required." });
    }
    if (!userName) {
      return res.status(400).json({ success: false, message: "User name is required." });
    }
    // 🔄 phone is no longer required — some sources genuinely don't have one.
    // At least ONE of phone/email is still needed so referrals can be
    // deduplicated and are actually contactable.
    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: "At least one of phone or email is required.",
      });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, message: "Phone number format is invalid." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Email format is invalid." });
    }

    const referral = await referralService.registerReferral({
      referralCode,
      website,
      userName,
      email,
      phone,
      plan,
      status, // optional — e.g. School CRM can pass "PAID" once a payment succeeds
    });

    return res.status(201).json({
      success: true,
      message: "Referral saved successfully",
      data: referral,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Referral registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving the referral.",
    });
  }
};

// 🟢 GET /referral/vendor/:vendorId
export const getVendorReferrals = async (req, res) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (Number.isNaN(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor id." });
    }

    const referrals = await referralService.getReferralsByVendor(vendorId);

    return res.status(200).json({
      success: true,
      message: "Referrals fetched successfully",
      data: referrals,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor referrals error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching referrals.",
    });
  }
};

// 🟢 GET /referral/stats/:vendorId
export const getVendorStats = async (req, res) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (Number.isNaN(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor id." });
    }

    const stats = await referralService.getReferralStats(vendorId);

    return res.status(200).json({
      success: true,
      message: "Referral stats fetched successfully",
      data: stats,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor stats error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching referral stats.",
    });
  }
};

// 🟢 GET /referral/details/:vendorId — powers the Vendor Details page
export const getVendorDetails = async (req, res) => {
  try {
    const vendorId = Number(req.params.vendorId);
    if (Number.isNaN(vendorId)) {
      return res.status(400).json({ success: false, message: "Invalid vendor id." });
    }

    const details = await referralService.getVendorDetails(vendorId);

    return res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      data: details,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor details error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching vendor details.",
    });
  }
};

// 🆕 GET /referral/me (protected) — powers VendorsList.jsx.
export const getMyVendorDetails = async (req, res) => {
  try {
    const details = await referralService.getVendorDetailsByUserId(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Vendor details fetched successfully",
      data: details,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get my vendor details error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your vendor details.",
    });
  }
};

// 🆕 GET /referral/admin/overview (admin only) — powers the Admin
// Dashboard's "Total Vendors" and "Total Referral Users" cards.
export const getAdminOverview = async (req, res) => {
  try {
    const overview = await referralService.getAdminOverviewStats();

    return res.status(200).json({
      success: true,
      message: "Admin referral overview fetched successfully",
      data: overview,
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    console.error("❌ Get admin referral overview error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the admin overview.",
    });
  }
};