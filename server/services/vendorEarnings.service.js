// services/vendorEarnings.service.js
//
// 🆕 Vendor Earnings & Commission — powers the vendor-facing "Vendor
// Earnings & Commission" dashboard page. Reads ONLY from the Referral
// table (kept in sync by schoolSync.service.js / motorDeskSync.service.js)
// — no external API calls here, and no changes to either sync file.
//
// Scoped to "my own referrals" (resolved from the logged-in user's JWT),
// same pattern as GET /referral/me — this is a vendor's own earnings page,
// not an admin-wide view.
//
// ⚠️ Two things worth knowing about how this is computed, since the
// Referral table has no explicit support for either:
//
// 1. New Deal vs. Renewal — there's no column linking one referral row to
//    an earlier one as "this is a renewal of that." So referrals are
//    grouped by customer (phone, falling back to email) per vendor, sorted
//    by payment date: the FIRST purchase for a given customer = New Deal
//    (20% commission), any LATER purchase by that same customer = Renewal
//    (10% commission). This is the closest honest approximation the
//    existing data supports — if Motor Desk/School CRM later expose an
//    explicit "renewal of externalId X" link, this grouping should be
//    replaced with that instead.
//
// 2. Withdrawn Amount / Available Balance — there is no payout/withdrawal
//    ledger anywhere in the schema. `withdrawnAmount` is therefore always
//    0, and `availableBalance` simply mirrors total paid (payable)
//    commission. Once a real withdrawal feature/table exists, wire it in
//    here instead of these placeholders.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class VendorEarningsError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const NEW_DEAL_RATE = 0.2; // 20%
const RENEWAL_RATE = 0.1; // 10%

// Per the Commission Rules: cancelled/refunded/failed subscriptions are
// never eligible for commission, regardless of new-deal or renewal.
const INELIGIBLE_STATUSES = ["CANCELLED", "EXPIRED", "PAYMENT_FAILED"];

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// 🔒 Resolve the logged-in user's own vendor id — same lookup as
// referralService.getVendorDetailsByUserId.
const getVendorIdForUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { vendor: { select: { id: true } } },
  });

  if (!user || !user.vendor) {
    throw new VendorEarningsError("No vendor profile found for this account.", 404);
  }

  return user.vendor.id;
};

// "Same customer" key — prefers phone (more stable identifier when
// present, same preference order used elsewhere in this codebase, e.g.
// referralService.registerReferral's dedup), falls back to email, and
// falls back to a per-row unique key so a referral with neither never
// gets accidentally grouped with an unrelated one.
const customerKeyFor = (referral) => referral.phone || referral.email || `referral:${referral.id}`;

// 🟢 GET /api/vendor-earnings — the whole page's data in one call.
export const getVendorEarnings = async (userId) => {
  const vendorId = await getVendorIdForUser(userId);

  const allReferrals = await prisma.referral.findMany({
    where: { vendorId },
    orderBy: { createdAt: "asc" },
  });

  const eligible = allReferrals.filter((r) => !INELIGIBLE_STATUSES.includes(r.status));

  // Group by customer, then sort each group chronologically by payment
  // date (falling back to createdAt for rows that haven't been paid yet).
  const groups = new Map();
  for (const referral of eligible) {
    const key = customerKeyFor(referral);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(referral);
  }

  const newDeals = [];
  const renewals = [];

  for (const group of groups.values()) {
    group.sort(
      (a, b) => new Date(a.paidAt || a.createdAt).getTime() - new Date(b.paidAt || b.createdAt).getTime()
    );

    group.forEach((referral, index) => {
      const isPaid = referral.status === "PAID";
      const amount = referral.amount != null ? Number(referral.amount) : 0;
      const date = referral.paidAt || referral.createdAt;

      if (index === 0) {
        newDeals.push({
          id: referral.id,
          customerName: referral.customerName || referral.userName,
          companyName: referral.companyName || null,
          product: referral.website,
          plan: referral.plan,
          dealAmount: referral.amount,
          commission: round2(amount * NEW_DEAL_RATE),
          status: isPaid ? "Paid" : "Pending",
          date,
        });
      } else {
        const previous = group[index - 1];
        renewals.push({
          id: referral.id,
          customerName: referral.customerName || referral.userName,
          companyName: referral.companyName || null,
          previousPlan: previous.plan,
          renewedPlan: referral.plan,
          renewalAmount: referral.amount,
          commission: round2(amount * RENEWAL_RATE),
          status: isPaid ? "Paid" : "Pending",
          date,
        });
      }
    });
  }

  const byDateDesc = (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime();
  newDeals.sort(byDateDesc);
  renewals.sort(byDateDesc);

  const sumCommission = (rows, statusFilter) =>
    round2(rows.filter((r) => !statusFilter || r.status === statusFilter).reduce((sum, r) => sum + r.commission, 0));

  const totalCommissionEarned = round2(sumCommission(newDeals) + sumCommission(renewals));
  const paidCommission = round2(sumCommission(newDeals, "Paid") + sumCommission(renewals, "Paid"));
  const pendingCommission = round2(totalCommissionEarned - paidCommission);

  const newDealCommission = sumCommission(newDeals, "Paid");
  const renewalCommission = sumCommission(renewals, "Paid");
  const totalEarnings = round2(newDealCommission + renewalCommission); // === paidCommission

  // 🆕 See file header note #2 — no withdrawal ledger exists yet.
  const withdrawnAmount = 0;
  const availableBalance = round2(totalEarnings - withdrawnAmount);

  const history = [
    ...newDeals.map((d) => ({
      date: d.date,
      customer: d.customerName,
      product: d.product,
      transactionType: "New Deal",
      amountPaid: d.dealAmount,
      commissionPercent: 20,
      commissionAmount: d.commission,
      status: d.status,
    })),
    ...renewals.map((r) => ({
      date: r.date,
      customer: r.customerName,
      product: r.product,
      transactionType: "Renewal",
      amountPaid: r.renewalAmount,
      commissionPercent: 10,
      commissionAmount: r.commission,
      status: r.status,
    })),
  ].sort(byDateDesc);

  return {
    overview: {
      totalCommissionEarned,
      pendingCommission,
      paidCommission,
      totalDeals: newDeals.length,
      totalRenewals: renewals.length,
    },
    newDeals,
    renewals,
    earningsSummary: {
      newDealCommission,
      renewalCommission,
      totalEarnings,
      withdrawnAmount,
      availableBalance,
    },
    history,
  };
};