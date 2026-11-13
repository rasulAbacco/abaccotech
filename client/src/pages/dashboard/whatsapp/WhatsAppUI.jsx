// src/pages/dashboard/whatsapp/WhatsAppUI.jsx
//
// 🆕 Shared building blocks for the WhatsApp pages: page shell with tabs +
// setup check, status badge, error box, pagination and the message preview.

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  Reply,
  Users,
  Video,
  Copy,
  Phone,
} from "lucide-react";
import DashboardLayout from "../../../Components/DashboardLayout";
import { waApi } from "./whatsappApi";
import { fillVariables, personalise } from "./whatsappUtils";

const TABS = [
  { label: "Campaigns", to: "/whatsapp", icon: Megaphone, match: (p) => p === "/whatsapp" || p.startsWith("/whatsapp/campaigns") },
  { label: "Templates", to: "/whatsapp/templates", icon: FileText, match: (p) => p.startsWith("/whatsapp/templates") },
  { label: "Contacts", to: "/whatsapp/contacts", icon: Users, match: (p) => p.startsWith("/whatsapp/contacts") },
];

// Fetched once per page load and shared by every page.
let configPromise = null;
const loadConfig = () => {
  configPromise ??= waApi.status().then((d) => d.config).catch(() => {
    configPromise = null;
    return null;
  });
  return configPromise;
};

export function WhatsAppShell({ title, subtitle, actions, back, children }) {
  const { pathname } = useLocation();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    let alive = true;
    loadConfig().then((c) => alive && setConfig(c));
    return () => {
      alive = false;
    };
  }, []);

  const missingSend = config
    ? [
        !config.token && "WHATSAPP_TOKEN",
        !config.phoneNumberId && "WHATSAPP_PHONE_NUMBER_ID",
        !config.businessAccountId && "WHATSAPP_BUSINESS_ACCOUNT_ID",
      ].filter(Boolean)
    : [];
  const missingWebhook = config
    ? [!config.webhookVerifyToken && "WHATSAPP_VERIFY_TOKEN", !config.appSecret && "META_APP_SECRET"].filter(Boolean)
    : [];

  return (
    <DashboardLayout>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ label, to, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                active
                  ? "bg-green-500/15 border-green-500/40 text-green-400"
                  : "bg-gray-900/50 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          {back && (
            <Link to={back.to} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-2">
              <ChevronLeft className="w-4 h-4" />
              {back.label}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-white break-words">{title}</h1>
          {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>

      {missingSend.length > 0 && (
        <div className="flex gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">WhatsApp isn't connected yet</p>
            <p className="mt-0.5">
              Add {missingSend.join(", ")} to <code className="text-amber-100">server/.env</code> and restart the
              backend. Templates can't be synced and messages can't be sent until then.
            </p>
          </div>
        </div>
      )}
      {missingSend.length === 0 && missingWebhook.length > 0 && (
        <div className="flex gap-3 bg-gray-900/60 border border-gray-800 text-gray-300 rounded-xl px-4 py-3 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 text-gray-400" />
          <p>
            Sending works, but delivered/read reports and STOP replies need {missingWebhook.join(" and ")} in{" "}
            <code>server/.env</code> plus the webhook set up in Meta.
          </p>
        </div>
      )}

      {children}
    </DashboardLayout>
  );
}

export function StatusBadge({ status, map }) {
  const s = map[status] || { label: status, cls: "bg-gray-500/10 text-gray-300 border-gray-500/30" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${s.cls}`}>
      {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
      {s.label}
    </span>
  );
}

export function ErrorBox({ error, onClose }) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;
  const list = typeof error === "string" ? [] : error.errors || [];
  return (
    <div className="flex gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="break-words">{message}</p>
        {list.length > 0 && (
          <ul className="list-disc ml-5 mt-1 space-y-0.5 text-red-300">
            {list.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-300 hover:text-white text-xs shrink-0">
          Dismiss
        </button>
      )}
    </div>
  );
}

export function SuccessBox({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="flex gap-2 bg-green-500/10 border border-green-500/30 text-green-300 rounded-xl px-4 py-3 text-sm mb-6">
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-green-200 hover:text-white text-xs shrink-0">
          Dismiss
        </button>
      )}
    </div>
  );
}

export function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-16">
      <Loader2 className="w-5 h-5 animate-spin" />
      {label}
    </div>
  );
}

export function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  return (
    <div className="flex items-center justify-between gap-3 pt-4 text-sm text-gray-400">
      <span>
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString("en-IN")}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="p-2 rounded-lg border border-gray-800 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-2 py-2">
          {page} / {pages}
        </span>
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="p-2 rounded-lg border border-gray-800 hover:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export const inputCls =
  "w-full bg-gray-800/60 border border-gray-700 rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";

export const primaryBtn =
  "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed";

export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 bg-gray-800/70 border border-gray-700 text-gray-200 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed";

export const dangerBtn =
  "inline-flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed";

export const cardCls = "bg-gray-900/50 border border-gray-800 rounded-2xl";

const BUTTON_ICONS = { URL: ExternalLink, QUICK_REPLY: Reply, PHONE_NUMBER: Phone, COPY_CODE: Copy };

// WhatsApp-style bubble showing how the message will look for one contact.
// `values` = { headerImageUrl, headerParams, bodyParams } as typed in the form.
export function MessagePreview({ template, values = {}, contactName = "Customer" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const url = values.headerImageUrl || "";
  useEffect(() => setImgFailed(false), [url]);

  if (!template) {
    return <div className="text-sm text-gray-500 italic">Pick a template to see the preview.</div>;
  }

  const header = template.header;
  const isHttps = /^https:\/\//i.test(url);
  const MediaIcon = header?.format === "VIDEO" ? Video : header?.format === "DOCUMENT" ? FileText : ImageIcon;

  return (
    <div className="bg-[#0b141a] rounded-2xl p-4 border border-gray-800">
      <div className="max-w-sm">
        <div className="bg-[#202c33] rounded-xl rounded-tl-sm overflow-hidden shadow">
          {header && header.format !== "TEXT" && (
            <div className="p-1">
              {header.format === "IMAGE" && isHttps && !imgFailed ? (
                <img
                  src={url}
                  alt="Header"
                  onError={() => setImgFailed(true)}
                  className="w-full max-h-56 object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 h-32 rounded-lg bg-gray-700/40 text-gray-400 text-xs">
                  <MediaIcon className="w-7 h-7" />
                  {imgFailed
                    ? "Image couldn't be loaded from this link"
                    : isHttps
                      ? `${header.format.toLowerCase()} from your link`
                      : `${header.format.toLowerCase()} header — add a link`}
                </div>
              )}
            </div>
          )}
          <div className="px-3 pt-2 pb-1.5">
            {header?.format === "TEXT" && (
              <p className="font-bold text-white text-sm mb-1 whitespace-pre-wrap break-words">
                {fillVariables(header.text, header.variables, values.headerParams, contactName)}
              </p>
            )}
            <p className="text-[#e9edef] text-sm whitespace-pre-wrap break-words leading-relaxed">
              {fillVariables(template.body?.text, template.body?.variables, values.bodyParams, contactName) || (
                <span className="italic text-gray-500">No body text</span>
              )}
            </p>
            {template.footer && <p className="text-xs text-gray-400 mt-1.5">{template.footer}</p>}
            <p className="text-[10px] text-gray-500 text-right mt-0.5">12:00</p>
          </div>
          {template.buttons?.length > 0 && (
            <div className="border-t border-gray-700/70">
              {template.buttons.map((b) => {
                const Icon = BUTTON_ICONS[b.type] || Reply;
                return (
                  <div
                    key={b.index}
                    className="flex items-center justify-center gap-2 py-2 text-sm text-[#53bdeb] border-b border-gray-700/70 last:border-b-0"
                  >
                    <Icon className="w-4 h-4" />
                    {b.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {template.body?.variables?.length > 0 && (
        <p className="text-[11px] text-gray-500 mt-3">
          Preview for a contact named "{personalise("{{name}}", contactName)}".
        </p>
      )}
    </div>
  );
}
