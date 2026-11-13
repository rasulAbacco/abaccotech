// whatsapp/whatsapp.routes.js
//
// 🆕 WhatsApp campaign API for the dashboard — mounted at /api/whatsapp.
// Every route is admin-only: sending messages costs money, so unlike the
// School CRM's /api/whatsapp routes, nothing here is public.

import express from "express";
import multer from "multer";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import * as wa from "./whatsapp.controller.js";

const router = express.Router();

// Contact files are parsed in memory and never written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (/\.(csv|xlsx|txt)$/i.test(file.originalname)) return cb(null, true);
    cb(Object.assign(new Error("Only .csv and .xlsx files are supported"), { status: 400 }));
  },
});

const uploadContactFile = (req, res, next) =>
  upload.single("file")(req, res, (err) => {
    if (!err) return next();
    const message = err.code === "LIMIT_FILE_SIZE" ? "File is larger than 5 MB" : err.message;
    return res.status(400).json({ success: false, message });
  });

router.use(protect, requireAdmin);

// Setup check (which .env values are present — never the values)
router.get("/status", wa.getStatus);

// Templates (created/approved in Meta, synced here)
router.get("/templates", wa.getTemplates);
router.post("/templates/sync", wa.syncTemplates);

// Contacts
router.get("/contacts", wa.getContacts);
router.get("/contacts/tags", wa.getTags);
router.get("/contacts/audience-count", wa.getAudienceCount);
router.get("/contacts/sample.csv", wa.downloadSampleCsv);
router.post("/contacts", wa.createContact);
router.post("/contacts/import", uploadContactFile, wa.uploadContacts);
router.patch("/contacts/:id/opt-out", wa.optOutContact);
router.patch("/contacts/:id/opt-in", wa.optInContact);
router.delete("/contacts/:id", wa.removeContact);

// Campaigns
router.get("/campaigns", wa.getCampaigns);
router.post("/campaigns", wa.postCampaign);
router.post("/campaigns/test-send", wa.testSend);
router.get("/campaigns/:id", wa.getCampaign);
router.put("/campaigns/:id", wa.putCampaign);
router.delete("/campaigns/:id", wa.removeCampaign);
router.get("/campaigns/:id/recipients", wa.getRecipients);
router.post("/campaigns/:id/launch", wa.launch);
router.post("/campaigns/:id/pause", wa.pause);
router.post("/campaigns/:id/resume", wa.resume);
router.post("/campaigns/:id/cancel", wa.cancel);
router.post("/campaigns/:id/retry-failed", wa.retryFailed);

export default router;
