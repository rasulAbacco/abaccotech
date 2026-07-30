// services/schoolSync.service.js
//
// 🆕 Referral SYNC architecture (replaces the old PUSH architecture).
//
// Previously, School CRM called POST /referral/register on every payment
// event (createOrder, verifyPayment, webhook), pushing data into Abacco.
// That push logic has been removed from School CRM entirely.
//
// Now Abacco Tech is the one who reaches out: this service calls
// GET /api/payment/referrals on School CRM, reads back every payment that
// used a referral code, resolves the vendor from User.referralCode, and
// upserts a Referral row per external record — deduped on
// (website, externalId) so repeated syncs never create duplicates, and
// existing rows just get their status/plan/payment details refreshed.
//
// 🆕 UPDATE: School CRM's GET /api/payment/referrals now also sends
// customerName, companyName, billingPeriod, amount, orderId, paymentId,
// paidAt, and expiryDate (see payment.controller.js's getReferredUsers).
// This service now stores all of that on the Referral row too, mirroring
// what motorDeskSync.service.js already does — the dedup key
// (website + externalId) and the create/update branching below are
// UNCHANGED, this only adds more fields to the `data` object that was
// already being written. originalAmount, discountAmount, discountPercent,
// subscriptionId, nextBillingDate, trialEndDate, and isTrial have no
// School CRM equivalent and are simply left untouched (null on create,
// whatever they already were on update).

import { PrismaClient } from "@prisma/client";
import { findVendorByReferralCode } from "./referralService.js";

const prisma = new PrismaClient();

const WEBSITE_NAME = "School CRM";
const REQUEST_TIMEOUT_MS = 15000;

export class SchoolSyncError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// School CRM's Payment.status is one of PENDING / SUCCESS / FAILED.
// Abacco's Referral.status vocabulary is TRIAL / ACTIVE / PAID / PENDING /
// CANCELLED / EXPIRED / PAYMENT_FAILED / (custom).
//
// 🆕 WIDENED: PENDING and FAILED now pass through as PENDING and
// PAYMENT_FAILED respectively (previously both collapsed into "TRIAL"),
// so School CRM referrals show up correctly in the Follow Ups and
// Renewal Cancelled dashboards, the same way Motor Desk's mapper was
// widened earlier. SUCCESS still maps to PAID, exactly as before.
const mapPaymentStatusToReferralStatus = (schoolCrmStatus) => {
  switch (schoolCrmStatus) {
    case "SUCCESS":
      return "PAID";
    case "PENDING":
      return "PENDING";
    case "FAILED":
      return "PAYMENT_FAILED";
    default:
      return "TRIAL";
  }
};

// 🌐 Fetch the raw list of referred users from School CRM.
const fetchReferredUsersFromSchoolCrm = async () => {
  const baseUrl = process.env.SCHOOL_CRM_API_URL;
  const apiKey = process.env.SCHOOL_CRM_API_KEY;

  if (!baseUrl) {
    throw new SchoolSyncError("SCHOOL_CRM_API_URL is not configured on this server.", 500);
  }
  if (!apiKey) {
    throw new SchoolSyncError("SCHOOL_CRM_API_KEY is not configured on this server.", 500);
  }

  let response;
  try {
    response = await Promise.race([
      fetch(`${baseUrl}/api/payment/referrals`, {
        method: "GET",
        headers: { "x-api-key": apiKey },
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new SchoolSyncError("Timed out waiting for School CRM.", 504)),
          REQUEST_TIMEOUT_MS
        )
      ),
    ]);
  } catch (err) {
    if (err instanceof SchoolSyncError) throw err;
    throw new SchoolSyncError(`Failed to reach School CRM: ${err.message}`, 502);
  }

  if (!response.ok) {
    let bodyText = "";
    try {
      bodyText = await response.text();
    } catch {
      // ignore — body may not be readable
    }
    throw new SchoolSyncError(
      `School CRM responded with ${response.status} ${response.statusText}${
        bodyText ? `: ${bodyText}` : ""
      }`,
      502
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new SchoolSyncError("School CRM returned invalid JSON.", 502);
  }

  if (!Array.isArray(data)) {
    throw new SchoolSyncError("Unexpected response shape from School CRM (expected an array).", 502);
  }

  return data;
};

// 🔧 Small helpers — same as motorDeskSync.service.js. Defensive: if
// School CRM omits a field, or sends something that doesn't parse
// cleanly, the result is null rather than a thrown error or bad data.
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

// 🔁 Upsert a single referred-user record into the Referral table.
// Dedup key: (website, externalId) — UNCHANGED. Vendor is resolved from
// the referral code on the incoming record — UNCHANGED.
const upsertReferralRecord = async (entry) => {
  const {
    externalId,
    referralCode,
    userName,
    // 🆕 richer fields — read defensively, each ends up null in `data`
    // below if School CRM's payload doesn't include it.
    customerName,
    companyName,
    email,
    phone,
    plan,
    billingPeriod,
    amount,
    orderId,
    paymentId,
    status,
    paidAt,
    expiryDate,
    createdAt,
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
    userName: userName || customerName || companyName || "",
    email: email || null,
    phone: phone || null,
    plan: plan || null,
    status: mapPaymentStatusToReferralStatus(status),

    // 🆕 Payment/subscription details — stored as-is when School CRM
    // sends them, left null otherwise. None of this changes the dedup
    // key or the create/update branching below.
    customerName: customerName || null,
    companyName: companyName || null,
    billingPeriod: billingPeriod || null,
    amount: toNullableNumber(amount),
    orderId: orderId || null,
    paymentId: paymentId || null,
    paidAt: toNullableDate(paidAt),
    expiryDate: toNullableDate(expiryDate),
  };

  // Look up any existing row for this (website, externalId) pair first —
  // UNCHANGED. The Referral model already has @@unique([website,
  // externalId]), so this could be a single prisma.referral.upsert(...) —
  // findFirst + create/update is used here instead to stay consistent with
  // this file's existing pattern.
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

// 🟢 Main entry point — run a full sync pass against School CRM. UNCHANGED.
export const syncSchoolCrmReferrals = async () => {
  const referredUsers = await fetchReferredUsersFromSchoolCrm();

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