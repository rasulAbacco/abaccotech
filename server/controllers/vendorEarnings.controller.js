// controllers/vendorEarnings.controller.js
import { getVendorEarnings, VendorEarningsError } from "../services/vendorEarnings.service.js";

// 🟢 GET /api/vendor-earnings (protected) — the logged-in vendor's own
// commission overview, new-deal/renewal breakdowns, earnings summary, and
// commission history, all in one response.
export const getEarnings = async (req, res) => {
  try {
    const data = await getVendorEarnings(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Vendor earnings fetched successfully",
      data,
    });
  } catch (err) {
    if (err instanceof VendorEarningsError || err.statusCode) {
      return res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
    console.error("❌ Get vendor earnings error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching your earnings.",
    });
  }
};