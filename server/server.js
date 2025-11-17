// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoute from "./routes/payment.js";

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

// 🟢 Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend Running — CORS Working!");
});

// 🟢 Payment Routes
app.use("/payment", paymentRoute);

// 🟢 Start Server
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});




// // server.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import paymentRoute from "./routes/payment.js";

// dotenv.config();

// const app = express();

// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"]
// }));

// app.use(express.json());

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("✅ Razorpay + Prisma Backend Running");
// });

// // ✅ Payment Routes
// app.use("/payment", paymentRoute);

// // ✅ Start Server
// app.listen(5000, () => {
//   console.log("✅ Backend running on http://localhost:5000");
// });

