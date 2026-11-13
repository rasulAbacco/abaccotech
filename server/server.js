// server.js
import "dotenv/config"; // ⬅️ MUST be the very first import so every module sees .env values
import express from "express";
import cors from "cors";
import path from "path";
import paymentRoute from "./routes/payment.js";
import vendorRoute from "./routes/vendor.js";
import authRoute from "./routes/auth.js";
import referralRoutes from "./routes/referral.js";
import schoolSyncRoutes from "./routes/schoolSync.routes.js"; // 🆕 pull-based referral sync (manual trigger)
import { startSchoolSyncCron } from "./cron/schoolSyncCron.js"; // 🆕 automatic referral sync every 5 minutes
import motorDeskSyncRoutes from "./routes/motorDeskSync.routes.js"; // 🆕 Motor Desk pull-based referral sync (manual trigger)
import { startMotorDeskSyncCron } from "./cron/motorDeskSyncCron.js"; // 🆕 automatic Motor Desk referral sync every 5 minutes
import referralDashboardRoutes from "./routes/referralDashboard.routes.js"; // 🆕 Deals / Follow Ups / Renewals / Renewal Cancelled / Reports
import vendorEarningsRoutes from "./routes/vendorEarnings.routes.js";
import whatsappRoutes from "./whatsapp/whatsapp.routes.js"; // 🆕 WhatsApp campaigns (admin dashboard)
import whatsappWebhookRoutes from "./whatsapp/whatsappWebhook.routes.js"; // 🆕 Meta webhook (public, signature-checked)
import { startWhatsAppCampaignCron } from "./whatsapp/whatsappCampaignCron.js"; // 🆕 bulk sender, every minute

const app = express();

// 🌍 Allowed Frontend Origins
const allowedOrigins = [
  "https://abaccotech.com",            // Live domain
  "https://www.abaccotech.com",        // Live domain with www
  "https://abaccotech-1.onrender.com", // Render frontend (if used)

  "http://localhost:5173",             // Vite frontend
  "http://127.0.0.1:5173",             // Alternate localhost
];

// 🔥 CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps / curl / postman / Meta webhooks (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // 🆕 PATCH for contact opt-out/opt-in
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON
// 🆕 `verify` keeps the exact raw bytes on req.rawBody — the WhatsApp
// webhook needs them to check Meta's X-Hub-Signature-256. Nothing else
// changes for the other routes.
app.use(
  express.json({
    limit: "2mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// 🖼️ Serve uploaded vendor files (images/pdfs/docs) statically
//
// ⚠️ Worth knowing: this makes anything in /uploads directly fetchable by
// URL if someone has (or guesses) the exact filename — including the
// Aadhaar/PAN files vendors upload. Filenames include a timestamp + random
// suffix, so they're not easily guessable. Consider an auth-gated download
// route instead of static serving if these documents need to stay fully
// private long-term.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🟢 Test Route — open http://localhost:<PORT>/ to confirm THIS backend is the one answering
app.get("/", (req, res) => {
  res.send("✅ Abacco Backend Running — CORS Working!");
});

// 🟢 Auth Routes (register / login / me)
app.use("/auth", authRoute);

// 🟢 Payment Routes
app.use("/payment", paymentRoute);

// 🟢 Vendor Routes
app.use("/vendor", vendorRoute);

// 🟢 Referral Routes
app.use("/referral", referralRoutes);

// 🟢 Vendor Earnings
app.use("/api/vendor-earnings", vendorEarningsRoutes);

// 🆕 School CRM referral sync — pull-based. POST /sync/school-crm/run
// (admin-only) still works for an on-demand/manual trigger.
app.use("/sync/school-crm", schoolSyncRoutes);

// 🆕 Motor Desk referral sync — same pull-based pattern as School CRM.
// POST /sync/motor-desk/run (admin-only) for an on-demand/manual trigger.
app.use("/sync/motor-desk", motorDeskSyncRoutes);

// 🆕 Referral Dashboard — Deals / Follow Ups / Renewals / Renewal
// Cancelled / Reports, all reading from the Referral table only.
app.use("/api/referral-dashboard", referralDashboardRoutes);

// 🆕 WhatsApp campaigns — templates, contacts, campaigns, reports (admin only)
app.use("/api/whatsapp", whatsappRoutes);

// 🆕 Meta WhatsApp webhook — delivery statuses + STOP replies
app.use("/webhooks/whatsapp", whatsappWebhookRoutes);

// 🟢 Start Server
const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`🚀 Abacco backend running on http://localhost:${PORT}`);

  // Start the automatic jobs only once the server is actually listening,
  // so a failed start (e.g. port clash) doesn't leave crons running.
  // One failed run just logs and waits for the next tick.
  startSchoolSyncCron();
  startMotorDeskSyncCron();
  startWhatsAppCampaignCron();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} is already in use (probably Motor Desk CRM or another backend).\n` +
        `   Stop that app, or set PORT=5002 in server/.env and VITE_API_URL=http://localhost:5002 in client/.env`
    );
    process.exit(1);
  }
  throw err;
});