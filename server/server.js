// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
// 🗑️ REMOVED: import { startBounceCureSyncCron } from "./cron/bounceCureSyncCron.js";
// Both Bounce Cure and School CRM push referrals directly now — this cron
// job was pulling from an endpoint/env-var setup that's no longer part of
// the design, and would silently fail every 15 minutes if left running.

dotenv.config();

const app = express();

// 🌍 Allowed Frontend Origins
const allowedOrigins = [
  "https://abaccotech.com",          // Live domain
  "https://www.abaccotech.com",      // Live domain with www
  "https://abaccotech-1.onrender.com", // Render frontend (if used)

  "http://localhost:5173",           // Your Vite frontend (correct one)
  "http://127.0.0.1:5173"            // Alternate localhost
];

// 🔥 CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow mobile apps / curl / postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// 🖼️ Serve uploaded vendor files (images/pdfs/docs) statically
//
// ⚠️ Worth knowing: this makes anything in /uploads directly fetchable by
// URL if someone has (or guesses) the exact filename — including the
// Aadhaar/PAN files vendors upload. Filenames include a timestamp + random
// suffix, so they're not easily guessable, but they WERE being handed out
// by the two unprotected vendor endpoints fixed in vendor.js. Now that those
// require admin auth, this is much less of a concern, but consider an
// auth-gated download route instead of static serving if these documents
// need to stay fully private long-term.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🟢 Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend Running — CORS Working!");
});

// 🟢 Auth Routes (register / login / me)
app.use("/auth", authRoute);

// 🟢 Payment Routes
app.use("/payment", paymentRoute);

// 🟢 Vendor Routes
app.use("/vendor", vendorRoute);

app.use("/referral", referralRoutes);

// 🆕 School CRM referral sync — pull-based replacement for the old
// push-based /referral/register calls. POST /sync/school-crm/run
// (admin-only) still works for an on-demand/manual trigger.
app.use("/sync/school-crm", schoolSyncRoutes);

// 🆕 Automatic referral sync — runs the same syncSchoolCrmReferrals logic
// on a schedule (every 5 minutes) so nobody has to call
// POST /sync/school-crm/run by hand. One failed run just logs and waits
// for the next tick; it never crashes the server or cancels future runs.
startSchoolSyncCron();

// 🆕 Motor Desk referral sync — same pull-based pattern as School CRM.
// POST /sync/motor-desk/run (admin-only) for an on-demand/manual trigger.
app.use("/sync/motor-desk", motorDeskSyncRoutes);

// 🆕 Automatic Motor Desk referral sync every 5 minutes, same pattern as
// the School CRM cron above.
startMotorDeskSyncCron();

// 🆕 Referral Dashboard — Deals / Follow Ups / Renewals / Renewal
// Cancelled / Reports, all reading from the Referral table only (no
// external API calls from these routes).
app.use("/api/referral-dashboard", referralDashboardRoutes);

// 🟢 Start Server
app.listen(5001, () => {
  console.log("🚀 Backend running on http://localhost:5001");
});