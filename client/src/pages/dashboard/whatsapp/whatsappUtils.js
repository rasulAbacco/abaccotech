// src/pages/dashboard/whatsapp/whatsappUtils.js
//
// 🆕 Small helpers shared by the WhatsApp pages: dates, status colours and
// the message preview text.

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const formatNumber = (n) => Number(n || 0).toLocaleString("en-IN");

export const percent = (part, total) => (total ? Math.round((part / total) * 100) : 0);

// Full class strings (Tailwind needs to see them written out).
const GRAY = "bg-gray-500/10 text-gray-300 border-gray-500/30";
const BLUE = "bg-sky-500/10 text-sky-300 border-sky-500/30";
const GREEN = "bg-green-500/10 text-green-400 border-green-500/30";
const AMBER = "bg-amber-500/10 text-amber-300 border-amber-500/30";
const RED = "bg-red-500/10 text-red-400 border-red-500/30";
const TEAL = "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";

export const CAMPAIGN_STATUS = {
  DRAFT: { label: "Draft", cls: GRAY },
  SCHEDULED: { label: "Scheduled", cls: BLUE },
  SENDING: { label: "Sending", cls: GREEN, pulse: true },
  PAUSED: { label: "Paused", cls: AMBER },
  COMPLETED: { label: "Completed", cls: TEAL },
  FAILED: { label: "Failed", cls: RED },
  CANCELLED: { label: "Cancelled", cls: GRAY },
};

export const RECIPIENT_STATUS = {
  PENDING: { label: "Pending", cls: GRAY },
  QUEUED: { label: "Sending", cls: GRAY },
  ACCEPTED: { label: "Accepted", cls: BLUE },
  SENT: { label: "Sent", cls: BLUE },
  DELIVERED: { label: "Delivered", cls: GREEN },
  READ: { label: "Read", cls: TEAL },
  FAILED: { label: "Failed", cls: RED },
  SKIPPED: { label: "Skipped (opted out)", cls: AMBER },
  CANCELLED: { label: "Cancelled", cls: GRAY },
};

export const TEMPLATE_STATUS = {
  APPROVED: { label: "Approved", cls: GREEN },
  PENDING: { label: "Pending review", cls: AMBER },
  IN_APPEAL: { label: "In appeal", cls: AMBER },
  PAUSED: { label: "Paused by Meta", cls: AMBER },
  REJECTED: { label: "Rejected", cls: RED },
  DISABLED: { label: "Disabled", cls: RED },
  DELETED: { label: "Deleted in Meta", cls: GRAY },
};

export const MEDIA_FORMATS = ["IMAGE", "VIDEO", "DOCUMENT"];

// {{name}} / {{phone}} inside a value → the contact's details (same rule as the backend).
export const personalise = (value, contactName = "Customer") =>
  String(value ?? "")
    .replace(/\{\{\s*name\s*\}\}/gi, contactName || "Customer")
    .replace(/\{\{\s*phone\s*\}\}/gi, "91XXXXXXXXXX");

// Fills a template text's variables with the values typed in the form.
// Empty values stay visible as {{1}} so the admin sees what's missing.
export const fillVariables = (text, variables = [], values = [], contactName) => {
  if (!text) return "";
  return variables.reduce((out, v, i) => {
    const typed = values?.[i];
    const replacement = typed ? personalise(typed, contactName) : `{{${v}}}`;
    return out.replace(new RegExp(`\\{\\{\\s*${v}\\s*\\}\\}`, "g"), () => replacement);
  }, text);
};

export const campaignAudienceLabel = (tag) => (tag ? `Tag: ${tag}` : "All active contacts");
