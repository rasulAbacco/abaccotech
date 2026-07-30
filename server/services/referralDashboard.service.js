// services/referralDashboard.service.js
//
// 🆕 Referral Dashboard — powers the admin-only Deals / Follow Ups /
// Renewals / Renewal Cancelled / Reports pages. Reads ONLY from the
// Referral table (kept in sync by schoolSync.service.js and
// motorDeskSync.service.js) — this module never calls any external API
// directly, and does not touch either sync file's logic.
//
// 🔄 CHANGED: originally scoped to "my own referrals" (the logged-in
// vendor). Now that these routes are admin-only (see
// routes/referralDashboard.routes.js), that scoping no longer makes sense
// — an admin account typically has no Vendor profile of its own — so
// every function here now returns data across ALL vendors instead, with
// each row's owning vendor attached so the admin can tell who referred
// whom.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReferralDashboardError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Statuses that mean "this referral is no longer an active/paying
// subscription" — used by both Follow Ups and Renewal Cancelled below.
const CANCELLED_STATUSES = ["CANCELLED", "EXPIRED", "PAYMENT_FAILED"];

// How far ahead "upcoming" looks for follow-ups/renewals.
const UPCOMING_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 🆕 Attach the owning vendor (and that vendor's account info) to every
// row, so the admin views can show "Referred By".
const VENDOR_INCLUDE = {
  vendor: {
    select: {
      id: true,
      fullName: true,
      user: { select: { username: true, email: true, referralCode: true } },
    },
  },
};

// 🟢 GET /api/referral-dashboard/deals
// Every referred user across every vendor, with complete synced payment
// details.
export const getDeals = async () => {
  return prisma.referral.findMany({
    include: VENDOR_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
};

// 🟢 GET /api/referral-dashboard/follow-ups
// Anyone who needs a follow-up call: pending payment, trial users,
// expired plans, upcoming expiry/billing, or any other unpaid/cancelled
// subscription — across every vendor.
export const getFollowUps = async () => {
  const now = new Date();
  const upcomingWindow = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * MS_PER_DAY);

  return prisma.referral.findMany({
    where: {
      OR: [
        { status: "TRIAL" },
        { status: "PENDING" },
        { status: { in: CANCELLED_STATUSES } }, // expired/failed still need a follow-up call
        { isTrial: true },
        { expiryDate: { lte: upcomingWindow } }, // already expired OR expiring soon
        { nextBillingDate: { lte: upcomingWindow } }, // billing overdue OR due soon
      ],
    },
    include: VENDOR_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
};

// 🟢 GET /api/referral-dashboard/renewals
// Referrals (any vendor) whose expiryDate or nextBillingDate falls within
// the next 30 days, with a computed daysLeft per row.
export const getRenewals = async () => {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * MS_PER_DAY);

  const referrals = await prisma.referral.findMany({
    where: {
      OR: [
        { expiryDate: { gte: now, lte: windowEnd } },
        { nextBillingDate: { gte: now, lte: windowEnd } },
      ],
    },
    include: VENDOR_INCLUDE,
    orderBy: [{ expiryDate: "asc" }, { nextBillingDate: "asc" }],
  });

  // daysLeft is computed off whichever of the two dates is soonest — a
  // row might have expiryDate, nextBillingDate, or both.
  return referrals.map((referral) => {
    const upcomingDates = [referral.expiryDate, referral.nextBillingDate]
      .filter(Boolean)
      .map((d) => new Date(d))
      .filter((d) => d.getTime() >= now.getTime());

    const soonest = upcomingDates.length
      ? new Date(Math.min(...upcomingDates.map((d) => d.getTime())))
      : null;

    const daysLeft = soonest ? Math.ceil((soonest.getTime() - now.getTime()) / MS_PER_DAY) : null;

    return { ...referral, daysLeft };
  });
};

// 🟢 GET /api/referral-dashboard/renewals-cancelled
// Referrals (any vendor) with a CANCELLED / EXPIRED / PAYMENT_FAILED status.
export const getRenewalsCancelled = async () => {
  return prisma.referral.findMany({
    where: { status: { in: CANCELLED_STATUSES } },
    include: VENDOR_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
};

// 🟢 GET /api/referral-dashboard/reports
// Aggregate dashboard statistics across every vendor.
export const getReports = async () => {
  const now = new Date();
  const upcomingWindow = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * MS_PER_DAY);

  const [
    totalReferredUsers,
    activePlans,
    trialPlans,
    expiredPlans,
    cancelledPlans,
    renewalsDue,
    totalVendors, // 🆕 bonus platform-wide stat, now that this is admin-only
    allReferrals,
  ] = await Promise.all([
    prisma.referral.count(),
    prisma.referral.count({ where: { status: "ACTIVE" } }),
    prisma.referral.count({ where: { status: "TRIAL" } }),
    prisma.referral.count({ where: { status: "EXPIRED" } }),
    prisma.referral.count({ where: { status: { in: CANCELLED_STATUSES } } }),
    prisma.referral.count({
      where: {
        OR: [
          { expiryDate: { gte: now, lte: upcomingWindow } },
          { nextBillingDate: { gte: now, lte: upcomingWindow } },
        ],
      },
    }),
    prisma.vendor.count(),
    // Pulled once and reused below for revenue/plan-wise/status-wise/
    // monthly breakdowns, instead of running a separate query for each.
    prisma.referral.findMany(),
  ]);

  let totalRevenue = 0;
  let pendingRevenue = 0;
  const planCounts = {};
  const statusCounts = {};
  const monthlyRevenueMap = {};

  for (const referral of allReferrals) {
    // Plan-wise counts
    const planKey = referral.plan || "Unspecified";
    planCounts[planKey] = (planCounts[planKey] || 0) + 1;

    // Status-wise counts
    const statusKey = referral.status || "UNKNOWN";
    statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;

    if (referral.amount == null) continue;

    const isCollected =
      Boolean(referral.paidAt) || referral.status === "PAID" || referral.status === "ACTIVE";
    const isCancelled = CANCELLED_STATUSES.includes(referral.status);

    if (isCollected) {
      totalRevenue += Number(referral.amount);

      // Monthly revenue summary — grouped by the month money was collected.
      const groupingDate = referral.paidAt || referral.createdAt;
      if (groupingDate) {
        const d = new Date(groupingDate);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyRevenueMap[monthKey] = (monthlyRevenueMap[monthKey] || 0) + Number(referral.amount);
      }
    } else if (!isCancelled) {
      // Not yet collected and not written off — counts as pending revenue.
      pendingRevenue += Number(referral.amount);
    }
  }

  const monthlyRevenue = Object.entries(monthlyRevenueMap)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([month, revenue]) => ({ month, revenue }));

  return {
    totalReferredUsers,
    totalVendors,
    totalRevenue,
    pendingRevenue,
    activePlans,
    trialPlans,
    expiredPlans,
    cancelledPlans,
    renewalsDue,
    planCounts,
    statusCounts,
    monthlyRevenue,
  };
};