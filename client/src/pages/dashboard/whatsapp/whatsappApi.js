// src/pages/dashboard/whatsapp/whatsappApi.js
//
// 🆕 One place for every call to the backend's /api/whatsapp routes.
// The React app never talks to Meta directly — only to our backend.

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = Array.isArray(errors) ? errors : [];
  }
}

export async function waRequest(path, { method = "GET", body, form } = {}) {
  const token = localStorage.getItem("token");
  let res;
  try {
    res = await fetch(`${API_URL}/api/whatsapp${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: form ?? (body ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (res.status === 401) {
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }
  if (!res.ok || data.success === false) {
    throw new ApiError(data.message || `Request failed (HTTP ${res.status})`, res.status, data.errors);
  }
  return data;
}

const q = (params) => {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") s.set(k, v);
  });
  const str = s.toString();
  return str ? `?${str}` : "";
};

export const waApi = {
  status: (check = false) => waRequest(`/status${check ? "?check=1" : ""}`),

  // Templates
  templates: (all = false) => waRequest(`/templates${all ? "?all=1" : ""}`),
  syncTemplates: () => waRequest("/templates/sync", { method: "POST" }),

  // Contacts
  contacts: (params) => waRequest(`/contacts${q(params)}`),
  tags: () => waRequest("/contacts/tags"),
  audienceCount: (tag) => waRequest(`/contacts/audience-count${q({ tag })}`),
  addContact: (body) => waRequest("/contacts", { method: "POST", body }),
  importContacts: (form) => waRequest("/contacts/import", { method: "POST", form }),
  optOut: (id) => waRequest(`/contacts/${id}/opt-out`, { method: "PATCH" }),
  optIn: (id) => waRequest(`/contacts/${id}/opt-in`, { method: "PATCH" }),
  deleteContact: (id) => waRequest(`/contacts/${id}`, { method: "DELETE" }),

  // Campaigns
  campaigns: () => waRequest("/campaigns"),
  campaign: (id) => waRequest(`/campaigns/${id}`),
  createCampaign: (body) => waRequest("/campaigns", { method: "POST", body }),
  updateCampaign: (id, body) => waRequest(`/campaigns/${id}`, { method: "PUT", body }),
  deleteCampaign: (id) => waRequest(`/campaigns/${id}`, { method: "DELETE" }),
  recipients: (id, params) => waRequest(`/campaigns/${id}/recipients${q(params)}`),
  launch: (id, scheduledAt) =>
    waRequest(`/campaigns/${id}/launch`, { method: "POST", body: scheduledAt ? { scheduledAt } : {} }),
  pause: (id) => waRequest(`/campaigns/${id}/pause`, { method: "POST" }),
  resume: (id) => waRequest(`/campaigns/${id}/resume`, { method: "POST" }),
  cancel: (id) => waRequest(`/campaigns/${id}/cancel`, { method: "POST" }),
  retryFailed: (id) => waRequest(`/campaigns/${id}/retry-failed`, { method: "POST" }),
  testSend: (body) => waRequest("/campaigns/test-send", { method: "POST", body }),
};

// The sample CSV route needs the login token, so a plain <a href> won't work.
export async function downloadSampleCsv() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/whatsapp/contacts/sample.csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new ApiError("Could not download the sample file", res.status);
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = "whatsapp-contacts-sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}