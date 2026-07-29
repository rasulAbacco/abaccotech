// services/referralService.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReferralError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 🟢 A vendor's referral code lives on their User record (User.referralCode),
// not on the Vendor row itself — resolving a code means: find the User, then
// their Vendor.
export const findVendorByReferralCode = async (referralCode) => {
  const user = await prisma.user.findUnique({
    where: { referralCode },
    include: { vendor: true },
  });

  if (!user || !user.vendor) {
    return null;
  }

  return user.vendor;
};

// 🟢 POST /referral/register — called directly by external projects (Bounce
// Cure, School CRM, etc.) the moment someone signs up / checks out using a
// vendor's referral code. Public/unauthenticated by design — the caller is
// another server, not a logged-in Abacco Tech user.
//
// 🔄 Changed from "reject on duplicate" to "update on repeat call":
//   - FIXED BUG: the old dedup check used `{ website, phone }`, which broke
//     for any source with no phone number (like Bounce Cure) — every null-
//     phone row matched every other null-phone row, so the SECOND Bounce
//     Cure referral would always be wrongly rejected as a duplicate of the
//     first one.
//   - NEW: dedup prefers phone when present, falls back to email when it
//     isn't, so every source works correctly regardless of what fields it
//     actually has.
//   - NEW: instead of throwing a 409 on a repeat call for the same person,
//     this now UPDATES their existing row (status, plan, etc.). That's
//     important for the push model: a site can call this once at signup
//     (status starts TRIAL) and call it again later when payment succeeds
//     (status flips to PAID) — same endpoint, no separate "update" route
//     needed.
export const registerReferral = async ({
  referralCode,
  website,
  userName,
  email,
  phone,
  plan,
  status, // optional — defaults to "TRIAL" on first insert if not provided
}) => {
  const vendor = await findVendorByReferralCode(referralCode);
  if (!vendor) {
    throw new ReferralError("Invalid Referral Code", 404);
  }

  // Build a dedup filter from whatever identifying info we actually have.
  // Prefer phone (more stable per-person identifier when present), fall
  // back to email. If somehow neither is present, skip dedup entirely
  // rather than matching everything with a null-vs-null comparison.
  const dedupFilters = [];
  if (phone) dedupFilters.push({ website, phone });
  if (email) dedupFilters.push({ website, email });

  const existing =
    dedupFilters.length > 0
      ? await prisma.referral.findFirst({ where: { OR: dedupFilters } })
      : null;

  const data = {
    vendorId: vendor.id,
    referralCode,
    website,
    userName,
    email: email || null,
    phone: phone || null,
    plan: plan || null,
    ...(status && { status }), // only overwrite status if the caller actually sent one
  };

  if (existing) {
    return prisma.referral.update({ where: { id: existing.id }, data });
  }

  return prisma.referral.create({
    data: { ...data, status: status || "TRIAL" },
  });
};

// 🟢 GET /referral/vendor/:vendorId — all referrals for a vendor, newest first
export const getReferralsByVendor = async (vendorId) => {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    throw new ReferralError("Vendor not found", 404);
  }

  return prisma.referral.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
};

// 🟢 GET /referral/stats/:vendorId
export const getReferralStats = async (vendorId) => {
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    throw new ReferralError("Vendor not found", 404);
  }

  const [totalReferrals, activeUsers, paidUsers, trialUsers] = await Promise.all([
    prisma.referral.count({ where: { vendorId } }),
    prisma.referral.count({ where: { vendorId, status: "ACTIVE" } }),
    prisma.referral.count({ where: { vendorId, status: "PAID" } }),
    prisma.referral.count({ where: { vendorId, status: "TRIAL" } }),
  ]);

  return { totalReferrals, activeUsers, paidUsers, trialUsers };
};

// 🟢 Powers the Vendor Details page: vendor info + stats + referral list in one call
export const getVendorDetails = async (vendorId) => {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      files: true,
      user: {
        select: { username: true, email: true, referralCode: true },
      },
    },
  });

  if (!vendor) {
    throw new ReferralError("Vendor not found", 404);
  }

  const [totalReferrals, activeUsers, paidUsers, trialUsers, referrals] = await Promise.all([
    prisma.referral.count({ where: { vendorId } }),
    prisma.referral.count({ where: { vendorId, status: "ACTIVE" } }),
    prisma.referral.count({ where: { vendorId, status: "PAID" } }),
    prisma.referral.count({ where: { vendorId, status: "TRIAL" } }),
    prisma.referral.findMany({ where: { vendorId }, orderBy: { createdAt: "desc" } }),
  ]);

  return {
    vendor,
    stats: { totalReferrals, activeUsers, paidUsers, trialUsers },
    referrals,
  };
};

// 🆕 GET /referral/me — powers VendorsList.jsx for the logged-in vendor.
export const getVendorDetailsByUserId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vendor: { select: { id: true } } },
  });

  if (!user || !user.vendor) {
    throw new ReferralError("No vendor profile found for this account.", 404);
  }

  return getVendorDetails(user.vendor.id);
};

// 🆕 GET /referral/admin/overview — powers the Admin Dashboard's
// "Total Vendors" and "Total Referral Users" cards. Unlike the other stats
// functions above, this one isn't scoped to a single vendor — it's a
// platform-wide count across every vendor and every referral.
export const getAdminOverviewStats = async () => {
  const [totalVendors, totalReferralUsers] = await Promise.all([
    prisma.vendor.count(),
    prisma.referral.count(),
  ]);

  return { totalVendors, totalReferralUsers };
};

export { ReferralError };