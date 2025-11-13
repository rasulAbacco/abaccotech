
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoute from "./routes/payment.js";

dotenv.config();

const app = express();

// ✅ Allow both local and production frontends
const allowedOrigins = [
  "https://abaccotech.com",     // 🌐 Your live domain
  "http://localhost:5173",      // 🧑‍💻 Local development
  "http://127.0.0.1:5173"
];

// ✅ Enhanced CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
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

app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("✅ Razorpay + Prisma Backend Running (CORS Fixed)");
});

// ✅ Payment Routes
app.use("/payment", paymentRoute);

// ✅ Start Server
app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
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

