// routes/auth.js
import express from "express";
import {
  register,
  login,
  getMe,
  listUsers,
  getUserById,
  deleteUser,
  changePassword, 
} from "../controllers/authController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public
router.post("/register", register);
router.post("/login", login);

// 🟢 Protected (needs Authorization: Bearer <token>)
router.get("/me", protect, getMe);

// 🟢 Admin only — powers the Admin page (user table + user details + delete)
router.get("/users", protect, requireAdmin, listUsers);
router.get("/users/:id", protect, requireAdmin, getUserById);
router.delete("/users/:id", protect, requireAdmin, deleteUser);
router.put("/change-password", protect, changePassword); // 🆕
export default router;