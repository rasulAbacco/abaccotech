// whatsapp/whatsappContact.service.js
//
// 🆕 WhatsApp contacts: phone cleaning, CSV/Excel import, opt-in/opt-out.
// Phones are stored as digits with country code, no "+" (e.g. 919876543210),
// which is the format Meta expects — same rule as the School CRM's formatPhone.

import ExcelJS from "exceljs";
import prisma from "./prisma.js";

const DEFAULT_COUNTRY_CODE = "91";
const MAX_IMPORT_ROWS = 50_000;
const CHUNK = 500;

// Contacts a campaign is allowed to message.
export const ACTIVE_CONTACT_WHERE = { optedIn: true, optedOutAt: null };

// ── Phone cleaning ──────────────────────────────────────────────────────

// "+91 98765-43210" / "098765 43210" / "9876543210" → "919876543210"; invalid → null
export function normalizePhone(raw) {
  if (raw === null || raw === undefined) return null;
  let s = typeof raw === "number" ? String(Math.trunc(raw)) : String(raw).trim();
  if (!s || /e\+?\d/i.test(s)) return null; // Excel scientific notation lost digits — reject

  const hadPlus = s.startsWith("+");
  let digits = s.replace(/\D/g, "");
  if (!digits) return null;

  if (!hadPlus && digits.startsWith("00")) digits = digits.slice(2); // 0091… international prefix
  else if (!hadPlus && digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1); // 0 + 10-digit mobile

  if (!hadPlus && digits.length === 10) digits = DEFAULT_COUNTRY_CODE + digits;

  // Indian numbers: 91 + 10 digits starting 6–9
  if (digits.startsWith("91") && digits.length === 12 && !/^91[6-9]/.test(digits)) return null;
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

// ── File parsing ────────────────────────────────────────────────────────

// Minimal RFC-4180 CSV parser (quoted fields, commas/newlines inside quotes).
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') inQuotes = false;
      else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ""));
}

async function parseXlsx(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const rows = [];
  sheet.eachRow({ includeEmpty: false }, (r) => {
    const cells = [];
    for (let c = 1; c <= r.cellCount; c += 1) {
      const cell = r.getCell(c);
      const v = cell.value;
      cells.push(typeof v === "number" ? String(Math.trunc(v)) : (cell.text ?? "").toString());
    }
    rows.push(cells);
  });
  return rows;
}

// Finds phone / name / tag columns from the header row; falls back to
// "column 1 = phone, column 2 = name" when there's no recognisable header.
function mapColumns(rows) {
  const header = (rows[0] || []).map((h) => String(h).trim().toLowerCase());
  const findCol = (re) => header.findIndex((h) => re.test(h));

  const phoneCol = findCol(/phone|mobile|whats ?app|number|contact|cell/);
  if (phoneCol === -1) {
    return { phoneCol: 0, nameCol: 1, tagCol: -1, dataRows: rows };
  }
  return {
    phoneCol,
    nameCol: findCol(/name/),
    tagCol: findCol(/tag|group|segment|category/),
    dataRows: rows.slice(1),
  };
}

export async function parseContactFile(buffer, originalName = "") {
  const lower = originalName.toLowerCase();
  let rows;
  if (lower.endsWith(".xlsx")) rows = await parseXlsx(buffer);
  else if (lower.endsWith(".csv") || lower.endsWith(".txt")) rows = parseCsv(buffer.toString("utf8"));
  else throw new Error("Only .csv and .xlsx files are supported");

  const { phoneCol, nameCol, tagCol, dataRows } = mapColumns(rows);
  if (dataRows.length > MAX_IMPORT_ROWS) {
    throw new Error(`File has ${dataRows.length} rows — the limit is ${MAX_IMPORT_ROWS} per import`);
  }

  return dataRows.map((r, i) => ({
    rowNumber: i + 1,
    rawPhone: r[phoneCol],
    name: nameCol >= 0 ? String(r[nameCol] ?? "").trim() || null : null,
    tag: tagCol >= 0 ? String(r[tagCol] ?? "").trim() || null : null,
  }));
}

// ── Import ──────────────────────────────────────────────────────────────

export async function importContacts(rows, { defaultTag = null } = {}) {
  const summary = {
    totalRows: rows.length,
    created: 0,
    updated: 0,
    invalid: 0,
    duplicatesInFile: 0,
    skippedOptedOut: 0,
    invalidSamples: [], // first few bad rows, so the admin can fix the file
  };

  const byPhone = new Map();
  for (const row of rows) {
    const phone = normalizePhone(row.rawPhone);
    if (!phone) {
      summary.invalid += 1;
      if (summary.invalidSamples.length < 10) {
        summary.invalidSamples.push({ row: row.rowNumber, value: String(row.rawPhone ?? "") });
      }
      continue;
    }
    if (byPhone.has(phone)) {
      summary.duplicatesInFile += 1;
      continue;
    }
    byPhone.set(phone, { phone, name: row.name, tag: row.tag || defaultTag || null });
  }

  const entries = [...byPhone.values()];
  for (let i = 0; i < entries.length; i += CHUNK) {
    const chunk = entries.slice(i, i + CHUNK);
    const existing = await prisma.whatsAppContact.findMany({
      where: { phone: { in: chunk.map((c) => c.phone) } },
    });
    const existingByPhone = new Map(existing.map((c) => [c.phone, c]));

    const toCreate = chunk.filter((c) => !existingByPhone.has(c.phone));
    if (toCreate.length) {
      const { count } = await prisma.whatsAppContact.createMany({ data: toCreate, skipDuplicates: true });
      summary.created += count;
    }

    const updates = [];
    for (const c of chunk) {
      const ex = existingByPhone.get(c.phone);
      if (!ex) continue;
      // 🔒 Never re-subscribe someone who opted out just because they're in a file again.
      if (ex.optedOutAt || !ex.optedIn) {
        summary.skippedOptedOut += 1;
        continue;
      }
      const data = {};
      if (c.name && c.name !== ex.name) data.name = c.name;
      if (c.tag && c.tag !== ex.tag) data.tag = c.tag;
      if (Object.keys(data).length) {
        updates.push(prisma.whatsAppContact.update({ where: { id: ex.id }, data }));
      }
    }
    if (updates.length) {
      await prisma.$transaction(updates);
      summary.updated += updates.length;
    }
  }

  return summary;
}

// ── Queries / single-contact actions ────────────────────────────────────

export async function listContacts({ search, tag, status = "active", page = 1, pageSize = 50 }) {
  const where = {};
  const AND = [];
  if (status === "active") Object.assign(where, ACTIVE_CONTACT_WHERE);
  else if (status === "opted_out") AND.push({ OR: [{ optedOutAt: { not: null } }, { optedIn: false }] });
  if (tag) where.tag = tag;
  if (search) {
    const digits = search.replace(/\D/g, "");
    AND.push({
      OR: [
        ...(digits ? [{ phone: { contains: digits } }] : []),
        { name: { contains: search, mode: "insensitive" } },
      ],
    });
  }
  if (AND.length) where.AND = AND;

  const take = Math.min(Math.max(Number(pageSize) || 50, 1), 200);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const [total, contacts] = await Promise.all([
    prisma.whatsAppContact.count({ where }),
    prisma.whatsAppContact.findMany({ where, orderBy: { createdAt: "desc" }, skip, take }),
  ]);
  return { total, page: Math.floor(skip / take) + 1, pageSize: take, contacts };
}

// Tags with how many active (messageable) contacts each has.
export async function listTags() {
  const rows = await prisma.whatsAppContact.groupBy({
    by: ["tag"],
    where: ACTIVE_CONTACT_WHERE,
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ tag: r.tag, count: r._count._all }))
    .sort((a, b) => (a.tag ?? "").localeCompare(b.tag ?? ""));
}

export async function countAudience(tag) {
  return prisma.whatsAppContact.count({ where: { ...ACTIVE_CONTACT_WHERE, ...(tag ? { tag } : {}) } });
}

export async function addContact({ phone, name, tag }) {
  const clean = normalizePhone(phone);
  if (!clean) {
    const err = new Error("Invalid phone number");
    err.status = 400;
    throw err;
  }
  const existing = await prisma.whatsAppContact.findUnique({ where: { phone: clean } });
  if (existing) {
    const err = new Error("This number is already in your contacts");
    err.status = 409;
    throw err;
  }
  return prisma.whatsAppContact.create({
    data: { phone: clean, name: name?.trim() || null, tag: tag?.trim() || null },
  });
}

// Admin opt-out / opt-in from the dashboard.
export async function setContactOptOut(id, optedOut) {
  return prisma.whatsAppContact.update({
    where: { id },
    data: optedOut ? { optedOutAt: new Date() } : { optedOutAt: null, optedIn: true },
  });
}

export async function deleteContact(id) {
  return prisma.whatsAppContact.delete({ where: { id } });
}

// Used by the webhook when someone replies STOP (or Meta says they stopped marketing).
export async function optOutByPhone(phone) {
  const clean = normalizePhone(phone.startsWith("+") ? phone : `+${phone}`);
  if (!clean) return 0;
  const { count } = await prisma.whatsAppContact.updateMany({
    where: { phone: clean, optedOutAt: null },
    data: { optedOutAt: new Date() },
  });
  return count;
}

// Someone who replied STOP and later replies START asked to be messaged again.
export async function optInByPhone(phone) {
  const clean = normalizePhone(phone.startsWith("+") ? phone : `+${phone}`);
  if (!clean) return 0;
  const { count } = await prisma.whatsAppContact.updateMany({
    where: { phone: clean, optedOutAt: { not: null } },
    data: { optedOutAt: null, optedIn: true },
  });
  return count;
}
