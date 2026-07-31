// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_EXPIRES_IN = "7d";

const REFERRAL_PREFIX = "ABARC";
const REFERRAL_PAD_LENGTH = 3; // ABARC001, ABARC002 ... ABARC999, then ABARC1000

// 🟢 Builds "ABARC001" style codes off the user's own auto-increment id.
// Using the id (rather than counting rows) means it's automatically unique
// and race-condition safe — Postgres hands out ids atomically, so two people
// registering at the same instant can never get the same code.
const buildReferralCode = (id) =>
  `${REFERRAL_PREFIX}${String(id).padStart(REFERRAL_PAD_LENGTH, "0")}`;

// 🟢 REGISTER
// Public self-registration ALWAYS creates role = "user".
// Admin accounts are never created from this endpoint (see note at bottom of file).
export const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        password: hashedPassword,
        role: "user", // 🔒 hard-coded — never trust role from client input
      },
    });

    // Now that we have the id, stamp on the referral code and save it
    const user = await prisma.user.update({
      where: { id: created.id },
      data: { referralCode: buildReferralCode(created.id) },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        referralCode: user.referralCode,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 GET CURRENT USER (protected route, uses req.user set by authMiddleware)
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (err) {
    console.error("❌ getMe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// NOTE on admin accounts:
// Nobody should be able to make themselves "admin" via a public API call.
// To promote a user to admin, either:
//   1. Update it directly in the database / Prisma Studio, or
//   2. Add a separate route protected by `requireAdmin` middleware that lets
//      an existing admin promote another user (only wire this up once you
//      have at least one trusted admin account).

// 🟢 LIST ALL USERS (admin only) — powers the Admin table
export const listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        referralCode: true,
        createdAt: true,
        vendor: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 🆕 FIXED: referredCount used to be a hard-coded 0 placeholder for
    // every single user, regardless of how many people they'd actually
    // referred. It's now the real count of Referral rows tied to each
    // user's Vendor profile.
    //
    // One grouped query gets every vendor's referral count in a single
    // round-trip (instead of an N+1 query per user), and it's counted
    // directly against Referral.vendorId rather than relying on a named
    // Prisma relation field — so this works regardless of whatever the
    // Vendor -> Referral back-relation happens to be called in your schema.
    const referralCounts = await prisma.referral.groupBy({
      by: ["vendorId"],
      _count: { vendorId: true },
    });
    const countByVendorId = new Map(
      referralCounts.map((row) => [row.vendorId, row._count.vendorId])
    );

    const usersWithCounts = users.map(({ vendor, ...u }) => ({
      ...u,
      referredCount: vendor ? countByVendorId.get(vendor.id) ?? 0 : 0,
    }));

    return res.status(200).json({ success: true, users: usersWithCounts });
  } catch (err) {
    console.error("❌ listUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 GET SINGLE USER + their vendor/KYC submission (admin only) — powers the User Details page
export const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        referralCode: true,
        createdAt: true,
        vendor: {
          include: { files: true },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 🆕 FIXED: previously returned a hard-coded referredCount: 0 and no
    // referred-client data at all. Now fetches the real list of Referral
    // rows for this user's vendor (if they have one) — powers both the
    // real referredCount and the "Referred Clients" table on the User
    // Details page.
    let referrals = [];
    if (user.vendor) {
      referrals = await prisma.referral.findMany({
        where: { vendorId: user.vendor.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        referredCount: referrals.length,
        vendor: user.vendor ? { ...user.vendor, referrals } : null,
      },
    });
  } catch (err) {
    console.error("❌ getUserById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 DELETE USER (admin only)
export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // Don't let an admin delete their own account by accident from this screen
    if (req.user.userId === id) {
      return res
        .status(400)
        .json({ message: "You can't delete your own account from here" });
    }

    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("❌ deleteUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟢 CHANGE PASSWORD (protected, self-service — used by Settings page)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ changePassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};