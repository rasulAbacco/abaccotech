// routes/vendorEarnings.routes.js
import express from "express";
import { getEarnings } from "../controllers/vendorEarnings.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 GET /api/vendor-earnings (protected) — vendor's own earnings/commission
// data, resolved from the JWT. Not admin-only — this is a per-vendor page.
router.get("/", protect, getEarnings);

export default router;