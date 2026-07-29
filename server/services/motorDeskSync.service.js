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
// existing rows just get their status/plan refreshed.

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
// something outside TRIAL/ACTIVE/PAID, fall back to TRIAL rather than
// writing an unrecognized status into the Referral table.
const mapMotorDeskStatusToReferralStatus = (motorDeskStatus) => {
  switch (motorDeskStatus) {
    case "FIRST_PAYMENT_COMPLETED":
    case "PAID":
      return "PAID";

    case "ACTIVE":
      return "ACTIVE";

    case "TRIAL":
      return "TRIAL";

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

// 🔁 Upsert a single referred-payment record into the Referral table.
// Dedup key: (website, externalId). Vendor is resolved from the referral
// code on the incoming record.
const upsertReferralRecord = async (entry) => {
  const { externalId, referralCode, customerName, companyName, email, phone, plan, status, createdAt } = entry;

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
  };

  // Look up any existing row for this (website, externalId) pair first.
  // The Referral model already has @@unique([website, externalId]), so
  // this could be a single prisma.referral.upsert({ where: { website_externalId: {...} }, ... }) —
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

// 🟢 Main entry point — run a full sync pass against Motor Desk.
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