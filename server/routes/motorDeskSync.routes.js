// routes/motorDeskSync.routes.js
import express from "express";
import { runMotorDeskSync } from "../controllers/motorDeskSync.controller.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 POST /sync/motor-desk/run (admin only) — pulls referred payments from
// Motor Desk (GET /api/abacco/referrals) and upserts them into the
// Referral table. Same pull-based pattern as School CRM's
// /sync/school-crm/run.
router.post("/run", protect, requireAdmin, runMotorDeskSync);

export default router;