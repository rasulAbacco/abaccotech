// src/pages/dashboard/whatsapp/WhatsAppCampaigns.jsx
//
// 🆕 WhatsApp campaigns list — route /whatsapp. Refreshes itself while any
// campaign is sending or scheduled.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCheck, FileText, Megaphone, Plus, Send, Trash2, Users, XCircle, Eye } from "lucide-react";
import { waApi } from "./whatsappApi";
import { CAMPAIGN_STATUS, campaignAudienceLabel, formatDateTime, formatNumber, percent } from "./whatsappUtils";
import { ErrorBox, Spinner, StatusBadge, SuccessBox, WhatsAppShell, cardCls, dangerBtn, primaryBtn } from "./WhatsAppUI";

const LIVE = new Set(["SENDING", "SCHEDULED"]);
// A campaign that is sending right now must be paused or cancelled before it can be deleted.
const canDelete = (c) => c.status !== "SENDING";

export default function WhatsAppCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await waApi.campaigns();
      setCampaigns(data.campaigns);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const anyLive = campaigns.some((c) => LIVE.has(c.status));
  useEffect(() => {
    if (!anyLive) return undefined;
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [anyLive, load]);

  // Keep the selection in step with the list (deleted ones, or ones that started sending, drop out).
  useEffect(() => {
    setSelected((prev) => {
      const ok = new Set(campaigns.filter(canDelete).map((c) => c.id));
      const next = new Set([...prev].filter((id) => ok.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [campaigns]);

  const selectable = useMemo(() => campaigns.filter(canDelete), [campaigns]);
  const allSelected = selectable.length > 0 && selectable.every((c) => selected.has(c.id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(selectable.map((c) => c.id)));

  // One function for single and bulk delete.
  const remove = async (ids) => {
    const names = campaigns.filter((c) => ids.includes(c.id)).map((c) => `"${c.name}"`);
    const what = ids.length === 1 ? names[0] : `${ids.length} campaigns`;
    if (
      !window.confirm(
        `Delete ${what} and ${ids.length === 1 ? "its report" : "their reports"}?\n\n` +
          "Contacts are kept, and messages already sent can't be recalled. This can't be undone."
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    setNotice("");
    try {
      const r = ids.length === 1 ? (await waApi.deleteCampaign(ids[0]), { deleted: 1, skipped: [] }) : await waApi.deleteCampaigns(ids);
      setNotice(
        `Deleted ${r.deleted} campaign${r.deleted === 1 ? "" : "s"}.` +
          (r.skipped?.length
            ? ` Skipped ${r.skipped.map((x) => `"${x.name}"`).join(", ")} — sending right now, pause or cancel it first.`
            : "")
      );
      setSelected(new Set());
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setDeleting(false);
    }
  };

  const totals = campaigns.reduce(
    (acc, c) => {
      acc.sent += c.stats?.sent || 0;
      acc.delivered += c.stats?.delivered || 0;
      acc.read += c.stats?.read || 0;
      acc.failed += c.stats?.failed || 0;
      return acc;
    },
    { sent: 0, delivered: 0, read: 0, failed: 0 }
  );

  const summary = [
    { icon: Send, label: "Messages sent", value: formatNumber(totals.sent) },
    { icon: CheckCheck, label: "Delivered", value: `${formatNumber(totals.delivered)} · ${percent(totals.delivered, totals.sent)}%` },
    { icon: Eye, label: "Read", value: `${formatNumber(totals.read)} · ${percent(totals.read, totals.sent)}%` },
    { icon: XCircle, label: "Failed", value: formatNumber(totals.failed) },
  ];

  return (
    <WhatsAppShell
      title="WhatsApp Campaigns"
      subtitle="Send approved Meta templates to your contact lists in bulk and track delivery."
      actions={
        <Link to="/whatsapp/campaigns/new" className={primaryBtn}>
          <Plus className="w-4 h-4" />
          New campaign
        </Link>
      }
    >
      <ErrorBox error={error} onClose={() => setError(null)} />
      <SuccessBox message={notice} onClose={() => setNotice("")} />

      {loading ? (
        <Spinner label="Loading campaigns..." />
      ) : campaigns.length === 0 ? (
        <GettingStarted />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summary.map(({ icon: Icon, label, value }) => (
              <div key={label} className={`${cardCls} p-6`}>
                <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <div className="text-gray-400 text-sm">{label}</div>
              </div>
            ))}
          </div>

          <div className={`${cardCls} p-6`}>
            {/* Bulk actions — shown while something is selected */}
            {selected.size > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-4 px-4 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700">
                <span className="text-sm text-white font-medium">{selected.size} selected</span>
                <button onClick={() => setSelected(new Set())} className="text-sm text-gray-400 hover:text-white">
                  Clear
                </button>
                <button
                  onClick={() => remove([...selected])}
                  disabled={deleting}
                  className={`${dangerBtn} ml-auto py-2`}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Deleting..." : `Delete selected (${selected.size})`}
                </button>
              </div>
            )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="py-2.5 pr-3 w-8">
                    <input
                      type="checkbox"
                      aria-label="Select all campaigns"
                      checked={allSelected}
                      ref={(el) => el && (el.indeterminate = someSelected)}
                      onChange={toggleAll}
                      disabled={!selectable.length}
                      className="w-4 h-4 accent-green-500 cursor-pointer align-middle"
                    />
                  </th>
                  <th className="py-2.5 pr-4 font-medium">Campaign</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 pr-4 font-medium">Progress</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Sent</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Delivered</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Read</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Failed</th>
                  <th className="py-2.5 pr-4 font-medium">Date</th>
                  <th className="py-2.5 w-10" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const s = c.stats || {};
                  const done = (s.total || 0) - (s.pending || 0) - (s.queued || 0);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/whatsapp/campaigns/${c.id}`)}
                      className={`border-b border-gray-800/60 hover:bg-gray-800/30 cursor-pointer ${
                        selected.has(c.id) ? "bg-green-500/5" : ""
                      }`}
                    >
                      <td className="py-3 pr-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${c.name}`}
                          checked={selected.has(c.id)}
                          onChange={() => toggleOne(c.id)}
                          disabled={!canDelete(c)}
                          title={canDelete(c) ? "" : "Sending right now — pause or cancel it to delete"}
                          className="w-4 h-4 accent-green-500 cursor-pointer align-middle disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {c.templateName} · {campaignAudienceLabel(c.audienceTag)}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={c.status} map={CAMPAIGN_STATUS} />
                      </td>
                      <td className="py-3 pr-4 w-40">
                        {s.total ? (
                          <>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${percent(done, s.total)}%` }} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatNumber(done)} / {formatNumber(s.total)}
                            </p>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right text-gray-300">{formatNumber(s.sent)}</td>
                      <td className="py-3 pr-4 text-right text-gray-300">{formatNumber(s.delivered)}</td>
                      <td className="py-3 pr-4 text-right text-gray-300">{formatNumber(s.read)}</td>
                      <td className={`py-3 pr-4 text-right ${s.failed ? "text-red-400" : "text-gray-500"}`}>
                        {formatNumber(s.failed)}
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-400 whitespace-nowrap">
                        {c.status === "SCHEDULED"
                          ? `Sends ${formatDateTime(c.scheduledAt)}`
                          : formatDateTime(c.startedAt || c.createdAt)}
                      </td>
                      <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => remove([c.id])}
                          disabled={deleting || !canDelete(c)}
                          aria-label={`Delete ${c.name}`}
                          title={canDelete(c) ? "Delete campaign" : "Sending right now — pause or cancel it to delete"}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        </>
      )}
    </WhatsAppShell>
  );
}

function GettingStarted() {
  const steps = [
    {
      icon: FileText,
      title: "Sync your templates",
      text: "Create templates in Meta's WhatsApp Manager, get them approved, then sync them here.",
      to: "/whatsapp/templates",
      cta: "Templates",
    },
    {
      icon: Users,
      title: "Import contacts",
      text: "Upload a CSV or Excel list of people who agreed to receive your messages.",
      to: "/whatsapp/contacts",
      cta: "Contacts",
    },
    {
      icon: Megaphone,
      title: "Create a campaign",
      text: "Pick a template, fill its values, choose a tag and send to everyone at once.",
      to: "/whatsapp/campaigns/new",
      cta: "New campaign",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map(({ icon: Icon, title, text, to, cta }, i) => (
        <div key={title} className={`${cardCls} p-6 flex flex-col`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-gray-500">Step {i + 1}</span>
          </div>
          <p className="text-white font-semibold">{title}</p>
          <p className="text-gray-400 text-sm mt-1 flex-1">{text}</p>
          <Link to={to} className="text-green-400 hover:text-green-300 text-sm font-medium mt-4">
            {cta} →
          </Link>
        </div>
      ))}
    </div>
  );
}