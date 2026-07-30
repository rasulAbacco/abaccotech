// services/motorDeskSync.service.js
//
// 🆕 Referral SYNC architecture for Motor Desk — mirrors
// services/schoolSync.service.js exactly, just pointed at a different
// source system. Motor Desk's referral push (POST /referral/register) was
// never wired up in the first place, so there's no old push logic to
// remove here — this is a brand-new pull-based integration from day one.
//
// Abacco Tech reaches out to Motor Desk: this service calls
// GET /api/abacco/referrals on Motor Desk, reads back every payment that
// used a referral code, resolves the vendor from User.referralCode, and
// upserts a Referral row per external record — deduped on
// (website, externalId) so repeated syncs never create duplicates, and
// existing rows just get their status/plan/payment details refreshed.
//
// 🆕 UPDATE: now also stores the full payment/subscription details Motor
// Desk sends (customerName, companyName, billingPeriod, amount,
// originalAmount, discountAmount, discountPercent, paymentId, orderId,
// subscriptionId, paidAt, expiryDate, nextBillingDate, trialEndDate,
// isTrial) — these power the Referral Dashboard (see
// services/referralDashboard.service.js). The existing dedup key
// (website + externalId) and create/update branching below are
// UNCHANGED — this only adds more fields to the `data` object that was
// already being written.

import { PrismaClient } from "@prisma/client";
import { findVendorByReferralCode } from "./referralService.js";

const prisma = new PrismaClient();

const WEBSITE_NAME = "Motor Desk";
const REQUEST_TIMEOUT_MS = 15000;

export class MotorDeskSyncError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Motor Desk's Payment.status (as exposed by GET /api/abacco/referrals) is
// expected to already use values close to Abacco's own vocabulary
// (e.g. "PAID"). Still mapped defensively rather than trusted verbatim —
// same reasoning as schoolSync's mapper: if Motor Desk ever sends
// something completely unrecognized, fall back to TRIAL rather than
// writing an arbitrary string into the Referral table.
//
// 🆕 WIDENED: now also passes through PENDING / CANCELLED / EXPIRED /
// PAYMENT_FAILED as-is (previously any of these would have silently
// collapsed into "TRIAL", which made it impossible for the Referral
// Dashboard's "Renewal Cancelled" endpoint to ever see a
// cancelled/expired/failed row from Motor Desk). This is purely additive —
// every previously-recognized value still maps exactly the same as before.
const mapMotorDeskStatusToReferralStatus = (motorDeskStatus) => {
  switch (motorDeskStatus) {
    case "FIRST_PAYMENT_COMPLETED":
    case "PAID":
      return "PAID";

    case "ACTIVE":
      return "ACTIVE";

    case "TRIAL":
      return "TRIAL";

    case "PENDING":
      return "PENDING";

    case "CANCELLED":
    case "EXPIRED":
    case "PAYMENT_FAILED":
      return motorDeskStatus;

    default:
      return "TRIAL";
  }
};

// 🌐 Fetch the raw list of referred payments from Motor Desk.
const fetchReferredUsersFromMotorDesk = async () => {
  const baseUrl = process.env.MOTOR_DESK_API_URL;
  const apiKey = process.env.MOTOR_DESK_API_KEY;

  if (!baseUrl) {
    throw new MotorDeskSyncError("MOTOR_DESK_API_URL is not configured on this server.", 500);
  }
  if (!apiKey) {
    throw new MotorDeskSyncError("MOTOR_DESK_API_KEY is not configured on this server.", 500);
  }

  let response;
  try {
    response = await Promise.race([
      fetch(`${baseUrl}/api/abacco/referrals`, {
        method: "GET",
        headers: { "x-api-key": apiKey },
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new MotorDeskSyncError("Timed out waiting for Motor Desk.", 504)),
          REQUEST_TIMEOUT_MS
        )
      ),
    ]);
  } catch (err) {
    if (err instanceof MotorDeskSyncError) throw err;
    throw new MotorDeskSyncError(`Failed to reach Motor Desk: ${err.message}`, 502);
  }

  if (!response.ok) {
    let bodyText = "";
    try {
      bodyText = await response.text();
    } catch {
      // ignore — body may not be readable
    }
    throw new MotorDeskSyncError(
      `Motor Desk responded with ${response.status} ${response.statusText}${
        bodyText ? `: ${bodyText}` : ""
      }`,
      502
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new MotorDeskSyncError("Motor Desk returned invalid JSON.", 502);
  }

  if (!Array.isArray(data)) {
    throw new MotorDeskSyncError("Unexpected response shape from Motor Desk (expected an array).", 502);
  }

  return data;
};

// 🔧 Small helpers — every one of these is defensive: if Motor Desk omits
// a field, or sends something that doesn't parse cleanly, the result is
// null rather than a thrown error or a garbage value written to the DB.
const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const toNullableDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// 🔁 Upsert a single referred-payment record into the Referral table.
// Dedup key: (website, externalId) — UNCHANGED. Vendor is resolved from
// the referral code on the incoming record — UNCHANGED.
const upsertReferralRecord = async (entry) => {
  const {
    externalId,
    referralCode,
    customerName,
    companyName,
    email,
    phone,
    plan,
    status,
    createdAt,
    // 🆕 Richer payment/subscription fields. Each is read defensively —
    // if Motor Desk's payload doesn't include one, it's simply undefined
    // here and ends up null in `data` below, same as School CRM rows.
    billingPeriod,
    amount,
    originalAmount,
    discountAmount,
    discountPercent,
    paymentId,
    orderId,
    subscriptionId,
    paidAt,
    expiryDate,
    nextBillingDate,
    trialEndDate,
    isTrial,
  } = entry;

  if (!externalId) {
    return { outcome: "skipped", reason: "Missing externalId" };
  }
  if (!referralCode) {
    return { outcome: "skipped", reason: "Missing referralCode" };
  }

  const vendor = await findVendorByReferralCode(referralCode);
  if (!vendor) {
    return { outcome: "skipped", reason: `No vendor found for referral code "${referralCode}"` };
  }

  const externalIdStr = String(externalId);

  const data = {
    vendorId: vendor.id,
    referralCode,
    website: WEBSITE_NAME,
    externalId: externalIdStr,
    // Referral.userName is required — Motor Desk's customerName can be
    // null, so fall back to companyName, and only as a last resort to a
    // placeholder (mirrors School CRM's `fullName || schoolName` fallback).
    userName: customerName || companyName || "Motor Desk Customer",
    email: email || null,
    phone: phone || null,
    plan: plan || null,
    status: mapMotorDeskStatusToReferralStatus(status),

    // 🆕 Payment/subscription details — stored as-is when Motor Desk sends
    // them, left null otherwise. None of this changes the dedup key or
    // the create/update branching below.
    customerName: customerName || null,
    companyName: companyName || null,
    billingPeriod: billingPeriod || null,
    amount: toNullableNumber(amount),
    originalAmount: toNullableNumber(originalAmount),
    discountAmount: toNullableNumber(discountAmount),
    discountPercent: toNullableNumber(discountPercent),
    paymentId: paymentId || null,
    orderId: orderId || null,
    subscriptionId: subscriptionId || null,
    paidAt: toNullableDate(paidAt),
    expiryDate: toNullableDate(expiryDate),
    nextBillingDate: toNullableDate(nextBillingDate),
    trialEndDate: toNullableDate(trialEndDate),
    isTrial: Boolean(isTrial),
  };

  // Look up any existing row for this (website, externalId) pair first —
  // UNCHANGED. The Referral model already has @@unique([website,
  // externalId]), so this could be a single prisma.referral.upsert(...) —
  // findFirst + create/update is used here instead to stay consistent with
  // schoolSync.service.js's existing pattern.
  const existing = await prisma.referral.findFirst({
    where: { website: WEBSITE_NAME, externalId: externalIdStr },
  });

  if (existing) {
    await prisma.referral.update({ where: { id: existing.id }, data });
    return { outcome: "updated" };
  }

  await prisma.referral.create({
    data: {
      ...data,
      ...(createdAt && { createdAt: new Date(createdAt) }),
    },
  });
  return { outcome: "created" };
};

// 🟢 Main entry point — run a full sync pass against Motor Desk. UNCHANGED.
export const syncMotorDeskReferrals = async () => {
  const referredUsers = await fetchReferredUsersFromMotorDesk();

  const summary = {
    website: WEBSITE_NAME,
    total: referredUsers.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  for (const entry of referredUsers) {
    try {
      const result = await upsertReferralRecord(entry);

      if (result.outcome === "created") summary.created++;
      else if (result.outcome === "updated") summary.updated++;
      else if (result.outcome === "skipped") {
        summary.skipped++;
        summary.errors.push({ externalId: entry.externalId, reason: result.reason });
      }
    } catch (err) {
      summary.failed++;
      summary.errors.push({
        externalId: entry?.externalId,
        reason: err.message || "Unknown error while upserting referral",
      });
      console.error("❌ Failed to sync referral entry:", entry?.externalId, err);
    }
  }

  return summary;
};