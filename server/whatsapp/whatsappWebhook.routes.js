// whatsapp/whatsappWebhook.routes.js
//
// 🆕 Public webhook for Meta — mounted at /webhooks/whatsapp.
// No login middleware on purpose: requests are verified by Meta's
// signature (META_APP_SECRET) inside the controller instead.
//
// Callback URL to enter in Meta → WhatsApp → Configuration:
//   https://<your-backend>/webhooks/whatsapp

import express from "express";
import { receiveWebhook, verifyWebhook } from "./whatsappWebhook.controller.js";

const router = express.Router();

router.get("/", verifyWebhook);
router.post("/", receiveWebhook);

export default router;
