// src/pages/dashboard/whatsapp/WhatsAppTemplates.jsx
//
// 🆕 Templates are created and approved in Meta (WhatsApp Manager). This page
// pulls them in with "Sync from Meta" and shows how each one looks.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2, RefreshCw, Send, XCircle } from "lucide-react";
import { waApi } from "./whatsappApi";
import { TEMPLATE_STATUS, formatDateTime } from "./whatsappUtils";
import {
  ErrorBox,
  MessagePreview,
  Spinner,
  StatusBadge,
  SuccessBox,
  WhatsAppShell,
  cardCls,
  primaryBtn,
} from "./WhatsAppUI";

const FILTERS = [
  { key: "usable", label: "Ready to use" },
  { key: "all", label: "All" },
];

export default function WhatsAppTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("usable");
  const [showDeleted, setShowDeleted] = useState(false);
  const [emptyResult, setEmptyResult] = useState(null); // Meta answered, but with 0 templates
  const autoSynced = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await waApi.templates(showDeleted);
      setTemplates(data.templates);
      return data.templates;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showDeleted]);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setNotice("");
    setEmptyResult(null);
    try {
      const { summary } = await waApi.syncTemplates();
      if (summary.total === 0) {
        setEmptyResult(summary);
      } else {
        setNotice(
          `Synced ${summary.total} template${summary.total === 1 ? "" : "s"} from Meta ` +
            `(${summary.approved} approved) — ${summary.created} new, ${summary.updated} updated` +
            (summary.markedDeleted ? `, ${summary.markedDeleted} removed in Meta` : "") +
            "."
        );
      }
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSyncing(false);
    }
  }, [load]);

  // First visit: nothing saved yet → fetch from Meta automatically.
  useEffect(() => {
    load().then((list) => {
      if (list && list.length === 0 && !autoSynced.current) {
        autoSynced.current = true;
        sync();
      }
    });
  }, [load, sync]);

  const shown = filter === "usable" ? templates.filter((t) => t.usable) : templates;
  const usableCount = templates.filter((t) => t.usable).length;

  return (
    <WhatsAppShell
      title="Message Templates"
      subtitle="Create and get templates approved in Meta's WhatsApp Manager, then sync them here."
      actions={
        <>
          <a
            href="https://business.facebook.com/wa/manage/message-templates/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-2.5"
          >
            <ExternalLink className="w-4 h-4" />
            Open WhatsApp Manager
          </a>
          <button onClick={sync} disabled={syncing} className={primaryBtn}>
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync from Meta"}
          </button>
        </>
      }
    >
      <ConnectionPanel />
      <ErrorBox error={error} onClose={() => setError(null)} />
      <SuccessBox message={notice} onClose={() => setNotice("")} />
      {emptyResult && (
        <div className="flex gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-100 rounded-xl px-4 py-3 text-sm mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-amber-300">
              Meta returned 0 templates for WhatsApp Business Account {emptyResult.businessAccountId}
            </p>
            <p className="mt-1">
              The connection works, but this account has no templates. Your templates are probably in a different
              WhatsApp Business Account. In WhatsApp Manager, open the account that shows your templates, copy its{" "}
              <b>WhatsApp Business Account ID</b> (not the Business portfolio ID or the App ID), put it in{" "}
              <code>WHATSAPP_BUSINESS_ACCOUNT_ID</code> in <code>server/.env</code>, restart the backend and sync again.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              filter === f.key
                ? "bg-gray-800 border-gray-600 text-white"
                : "border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-gray-500">{f.key === "usable" ? usableCount : templates.length}</span>
          </button>
        ))}
        <label className="flex items-center gap-2 text-sm text-gray-400 ml-auto cursor-pointer">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
            className="accent-green-500"
          />
          Show templates deleted in Meta
        </label>
      </div>

      {loading || (syncing && templates.length === 0) ? (
        <Spinner label={syncing ? "Fetching templates from Meta..." : "Loading templates..."} />
      ) : templates.length === 0 ? (
        <div className={`${cardCls} p-10 text-center`}>
          <p className="text-white font-semibold">No templates yet</p>
          <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
            Click <span className="text-green-400">Sync from Meta</span> to load the templates from your WhatsApp
            Business Account. Only templates Meta has approved can be used in campaigns.
          </p>
        </div>
      ) : shown.length === 0 ? (
        <div className={`${cardCls} p-10 text-center text-gray-400 text-sm`}>
          None of your templates are approved and usable yet. Check their status under "All".
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {shown.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onUse={() => navigate(`/whatsapp/campaigns/new?template=${t.id}`)}
            />
          ))}
        </div>
      )}
    </WhatsAppShell>
  );
}

function TemplateCard({ template: t, onUse }) {
  const varCount =
    (t.header?.variables?.length || 0) +
    (t.body?.variables?.length || 0) +
    (t.buttons || []).filter((b) => b.hasVariable).length;

  return (
    <div className={`${cardCls} p-5 flex flex-col`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-white font-semibold break-all">{t.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {t.language} · {t.category || "—"}
            {t.header && ` · ${t.header.format.toLowerCase()} header`}
          </p>
        </div>
        <StatusBadge status={t.status} map={TEMPLATE_STATUS} />
      </div>

      <MessagePreview template={t} />

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-500">
        <span>
          {varCount ? `${varCount} value${varCount === 1 ? "" : "s"} to fill` : "No variables"} · synced{" "}
          {formatDateTime(t.lastSyncedAt)}
        </span>
      </div>

      <div className="pt-4 border-t border-gray-800 mt-auto">
        {t.usable ? (
          <button onClick={onUse} className={`${primaryBtn} w-full`}>
            <Send className="w-4 h-4" />
            Use in a campaign
          </button>
        ) : (
          <p className="text-xs text-amber-300/90">
            {t.unsupportedReason ||
              (t.status === "PENDING"
                ? "Waiting for Meta's approval — sync again later."
                : `Can't be used while it's ${TEMPLATE_STATUS[t.status]?.label?.toLowerCase() || t.status}.`)}
          </p>
        )}
      </div>
    </div>
  );
}

// Shows which WhatsApp Business Account and number the backend's .env points
// to, straight from Meta — the quickest way to spot a wrong ID.
function ConnectionPanel() {
  const [state, setState] = useState({ loading: true });

  const check = useCallback(async () => {
    setState({ loading: true });
    try {
      const d = await waApi.status(true);
      setState({ loading: false, connection: d.connection, config: d.config });
    } catch (err) {
      setState({ loading: false, error: err.message });
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const Row = ({ ok, warn, label, children }) => {
    const Icon = ok ? CheckCircle2 : warn ? AlertTriangle : XCircle;
    const color = ok ? "text-green-400" : warn ? "text-amber-400" : "text-red-400";
    return (
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
        <p className="text-gray-300">
          <span className="text-gray-500">{label}: </span>
          {children}
        </p>
      </div>
    );
  };

  const { connection: c } = state;
  const waba = c?.businessAccount;
  const phone = c?.phoneNumber;

  return (
    <div className={`${cardCls} p-4 mb-6 text-sm`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-white font-medium">Meta connection</p>
        <button onClick={check} disabled={state.loading} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
          {state.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Check again
        </button>
      </div>
      {state.loading ? (
        <p className="text-gray-500">Checking with Meta...</p>
      ) : state.error ? (
        <Row label="Backend">
          {state.error} — if you just added the WhatsApp files, restart the backend (nodemon server.js).
        </Row>
      ) : (
        <div className="space-y-1.5">
          {!waba ? (
            <Row label="Business Account">WHATSAPP_TOKEN or WHATSAPP_BUSINESS_ACCOUNT_ID is missing in server/.env</Row>
          ) : waba.error ? (
            <Row label="Business Account">
              Meta rejected the ID or token: {waba.error}. Check that WHATSAPP_BUSINESS_ACCOUNT_ID is the WhatsApp
              Business Account ID and the token has whatsapp_business_management permission.
              {c.accessibleBusinessAccounts?.length > 0 && (
                <span className="block mt-1.5 text-amber-200">
                  Your token can access{" "}
                  {c.accessibleBusinessAccounts.length === 1 ? "this WhatsApp Business Account" : "these WhatsApp Business Accounts"}
                  :{" "}
                  {c.accessibleBusinessAccounts.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ", "}
                      {a.name ? `${a.name} ` : ""}
                      <code className="text-white bg-gray-800 px-1.5 py-0.5 rounded select-all">{a.id}</code>
                    </span>
                  ))}
                  {" "}— put the right one in WHATSAPP_BUSINESS_ACCOUNT_ID and restart the backend.
                </span>
              )}
            </Row>
          ) : (
            <Row ok label="Business Account">
              {waba.name || "Unnamed"} <span className="text-gray-500">({waba.id})</span>
            </Row>
          )}
          {!phone ? (
            <Row label="Sending number">WHATSAPP_PHONE_NUMBER_ID is missing in server/.env</Row>
          ) : phone.error ? (
            <Row label="Sending number">Meta rejected WHATSAPP_PHONE_NUMBER_ID: {phone.error}</Row>
          ) : (
            <Row ok={c.phoneInAccount !== false} warn={c.phoneInAccount === false} label="Sending number">
              {phone.displayPhoneNumber} {phone.verifiedName && `· ${phone.verifiedName}`}{" "}
              <span className="text-gray-500">({phone.id})</span>
              {c.phoneInAccount === false && (
                <span className="block text-amber-300 mt-0.5">
                  This number is not in the Business Account above, so its templates can't be sent from it. Use a number
                  from that account
                  {c.accountNumbers?.length
                    ? `: ${c.accountNumbers.map((n) => `${n.displayPhoneNumber} (${n.id})`).join(", ")}`
                    : ""}
                  .
                </span>
              )}
            </Row>
          )}
        </div>
      )}
    </div>
  );
}