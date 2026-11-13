// src/pages/dashboard/whatsapp/WhatsAppCampaignDetails.jsx
//
// 🆕 One campaign's report — route /whatsapp/campaigns/:id. Live progress,
// sent / delivered / read / failed counts, controls (send, schedule, pause,
// resume, cancel, retry failed, delete) and the per-number recipient list.

import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CalendarClock,
  CheckCheck,
  Clock,
  Eye,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { waApi } from "./whatsappApi";
import {
  CAMPAIGN_STATUS,
  RECIPIENT_STATUS,
  campaignAudienceLabel,
  formatDateTime,
  formatNumber,
  percent,
} from "./whatsappUtils";
import {
  ErrorBox,
  MessagePreview,
  Pagination,
  Spinner,
  StatusBadge,
  SuccessBox,
  WhatsAppShell,
  cardCls,
  dangerBtn,
  inputCls,
  primaryBtn,
  secondaryBtn,
} from "./WhatsAppUI";

const LIVE = new Set(["SENDING", "SCHEDULED"]);

const RECIPIENT_FILTERS = [
  { key: "", label: "All" },
  { key: "READ", label: "Read" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "SENT", label: "Sent" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "PENDING", label: "Pending" },
  { key: "FAILED", label: "Failed" },
  { key: "SKIPPED", label: "Skipped" },
];

const toLocalInput = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function WhatsAppCampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(location.state?.error || null);
  const [notice, setNotice] = useState("");
  const [acting, setActing] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => toLocalInput(Date.now() + 60 * 60_000));

  const [recipients, setRecipients] = useState({ recipients: [], total: 0, page: 1, pageSize: 50 });
  const [rFilter, setRFilter] = useState("");
  const [rSearch, setRSearch] = useState("");
  const [rSearchInput, setRSearchInput] = useState("");
  const [rPage, setRPage] = useState(1);

  const loadCampaign = useCallback(async () => {
    try {
      const data = await waApi.campaign(id);
      setCampaign(data.campaign);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadRecipients = useCallback(async () => {
    try {
      const data = await waApi.recipients(id, { status: rFilter, search: rSearch, page: rPage, pageSize: 50 });
      setRecipients(data);
    } catch {
      /* campaign error box covers it */
    }
  }, [id, rFilter, rSearch, rPage]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  useEffect(() => {
    loadRecipients();
  }, [loadRecipients]);

  useEffect(() => {
    const t = setTimeout(() => {
      setRSearch(rSearchInput.replace(/\D/g, ""));
      setRPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [rSearchInput]);

  // Live refresh while sending/scheduled, and for 10 minutes after it
  // completes (delivered/read reports keep arriving from Meta).
  const recentlyDone =
    campaign?.status === "COMPLETED" && campaign.completedAt && Date.now() - new Date(campaign.completedAt) < 10 * 60_000;
  const live = campaign && (LIVE.has(campaign.status) || recentlyDone);
  useEffect(() => {
    if (!live) return undefined;
    const t = setInterval(() => {
      loadCampaign();
      loadRecipients();
    }, 4000);
    return () => clearInterval(t);
  }, [live, loadCampaign, loadRecipients]);

  const run = async (fn, okMessage, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return false;
    setActing(true);
    setError(null);
    setNotice("");
    try {
      const result = await fn();
      setNotice(typeof okMessage === "function" ? okMessage(result) : okMessage);
      await Promise.all([loadCampaign(), loadRecipients()]);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <WhatsAppShell title="Campaign" back={{ to: "/whatsapp", label: "All campaigns" }}>
        <Spinner />
      </WhatsAppShell>
    );
  }
  if (!campaign) {
    return (
      <WhatsAppShell title="Campaign not found" back={{ to: "/whatsapp", label: "All campaigns" }}>
        <ErrorBox error={error} />
      </WhatsAppShell>
    );
  }

  const c = campaign;
  const s = c.stats || {};
  const waiting = (s.pending || 0) + (s.queued || 0);
  const processed = (s.total || 0) - waiting;
  const audience = c.audienceCount ?? 0;

  const sendNow = () =>
    run(() => waApi.launch(c.id), "Sending started.", `Send "${c.name}" to ${formatNumber(audience)} contacts now?`);
  const schedule = () => {
    const when = new Date(scheduledAt);
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now() + 2 * 60_000) {
      setError("Pick a schedule time at least a few minutes from now.");
      return;
    }
    run(() => waApi.launch(c.id, when.toISOString()), `Scheduled for ${formatDateTime(when)}.`).then(
      (ok) => ok && setScheduleOpen(false)
    );
  };
  const remove = async () => {
    if (!window.confirm(`Delete "${c.name}" and its report? This can't be undone.`)) return;
    setActing(true);
    try {
      await waApi.deleteCampaign(c.id);
      navigate("/whatsapp");
    } catch (err) {
      setError(err);
      setActing(false);
    }
  };

  const actions = (
    <>
      {c.status === "DRAFT" && (
        <>
          <Link to={`/whatsapp/campaigns/${c.id}/edit`} className={secondaryBtn}>
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button onClick={() => setScheduleOpen((v) => !v)} disabled={acting} className={secondaryBtn}>
            <CalendarClock className="w-4 h-4" /> Schedule
          </button>
          <button onClick={sendNow} disabled={acting || audience === 0} className={primaryBtn}>
            <Send className="w-4 h-4" /> Send now
          </button>
        </>
      )}
      {(c.status === "SENDING" || c.status === "SCHEDULED") && (
        <button onClick={() => run(() => waApi.pause(c.id), "Paused. No more messages will go out until you resume.")} disabled={acting} className={secondaryBtn}>
          <Pause className="w-4 h-4" /> Pause
        </button>
      )}
      {(c.status === "PAUSED" || (c.status === "FAILED" && waiting > 0)) && (
        <button onClick={() => run(() => waApi.resume(c.id), "Resumed.")} disabled={acting} className={primaryBtn}>
          <Play className="w-4 h-4" /> Resume
        </button>
      )}
      {["COMPLETED", "FAILED", "PAUSED", "CANCELLED"].includes(c.status) && s.failed > 0 && (
        <button
          onClick={() =>
            run(
              () => waApi.retryFailed(c.id),
              (r) => `${formatNumber(r.requeued)} failed message${r.requeued === 1 ? "" : "s"} queued again.`,
              `Retry the ${formatNumber(s.failed)} failed messages? Contacts who opted out are never retried.`
            )
          }
          disabled={acting}
          className={secondaryBtn}
        >
          <RotateCcw className="w-4 h-4" /> Retry failed
        </button>
      )}
      {["SENDING", "SCHEDULED", "PAUSED", "FAILED"].includes(c.status) && (
        <button
          onClick={() =>
            run(() => waApi.cancel(c.id), "Campaign cancelled.", "Cancel this campaign? Messages already sent can't be recalled.")
          }
          disabled={acting}
          className={dangerBtn}
        >
          <XCircle className="w-4 h-4" /> Cancel
        </button>
      )}
      {["DRAFT", "COMPLETED", "FAILED", "CANCELLED"].includes(c.status) && (
        <button onClick={remove} disabled={acting} className={dangerBtn} aria-label="Delete campaign">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </>
  );

  const stats = [
    { icon: Users, label: "Recipients", value: formatNumber(s.total || (c.status === "DRAFT" || c.status === "SCHEDULED" ? audience : 0)), sub: s.total ? null : "when sent" },
    { icon: Send, label: "Sent", value: formatNumber(s.sent), sub: `${percent(s.sent, s.total)}%` },
    { icon: CheckCheck, label: "Delivered", value: formatNumber(s.delivered), sub: `${percent(s.delivered, s.sent)}% of sent` },
    { icon: Eye, label: "Read", value: formatNumber(s.read), sub: `${percent(s.read, s.delivered)}% of delivered` },
    { icon: XCircle, label: "Failed", value: formatNumber(s.failed), sub: s.skipped ? `+${formatNumber(s.skipped)} skipped` : null, red: s.failed > 0 },
    { icon: Clock, label: "Waiting", value: formatNumber(waiting), sub: waiting && c.status === "SENDING" ? "sending..." : null },
  ];

  return (
    <WhatsAppShell
      title={c.name}
      subtitle={`${c.templateName} · ${campaignAudienceLabel(c.audienceTag)}`}
      back={{ to: "/whatsapp", label: "All campaigns" }}
      actions={actions}
    >
      <ErrorBox error={error} onClose={() => setError(null)} />
      <SuccessBox message={notice} onClose={() => setNotice("")} />

      {c.lastError && ["FAILED", "PAUSED"].includes(c.status) && (
        <ErrorBox error={c.lastError} />
      )}

      {scheduleOpen && c.status === "DRAFT" && (
        <div className={`${cardCls} p-5 mb-6 flex flex-col sm:flex-row sm:items-end gap-3`}>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">Send at (your local time)</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              min={toLocalInput(Date.now())}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={`${inputCls} sm:w-72 [color-scheme:dark]`}
            />
          </div>
          <button onClick={schedule} disabled={acting} className={primaryBtn}>
            <CalendarClock className="w-4 h-4" /> Schedule
          </button>
        </div>
      )}

      {/* Status + progress */}
      <div className={`${cardCls} p-6 mb-6`}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <StatusBadge status={c.status} map={CAMPAIGN_STATUS} />
          {c.status === "SCHEDULED" && <span className="text-sky-300">Sends {formatDateTime(c.scheduledAt)}</span>}
          <span className="text-gray-400">Created {formatDateTime(c.createdAt)}</span>
          {c.startedAt && <span className="text-gray-400">Started {formatDateTime(c.startedAt)}</span>}
          {c.completedAt && <span className="text-gray-400">Finished {formatDateTime(c.completedAt)}</span>}
          {live && (
            <span className="flex items-center gap-1.5 text-gray-500 text-xs ml-auto">
              <RefreshCw className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" /> Updating live
            </span>
          )}
        </div>
        {s.total > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-400" style={{ width: `${percent(s.read, s.total)}%` }} />
              <div className="h-full bg-green-600" style={{ width: `${percent(s.delivered - s.read, s.total)}%` }} />
              <div className="h-full bg-sky-600" style={{ width: `${percent(s.sent - s.delivered, s.total)}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${percent(s.failed, s.total)}%` }} />
              <div className="h-full bg-amber-500/70" style={{ width: `${percent((s.skipped || 0) + (s.cancelled || 0), s.total)}%` }} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
              <span>
                {formatNumber(processed)} of {formatNumber(s.total)} processed ({percent(processed, s.total)}%)
              </span>
              <Legend cls="bg-emerald-400" label="Read" />
              <Legend cls="bg-green-600" label="Delivered" />
              <Legend cls="bg-sky-600" label="Sent" />
              <Legend cls="bg-red-500" label="Failed" />
              <Legend cls="bg-amber-500/70" label="Skipped / cancelled" />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map(({ icon: Icon, label, value, sub, red }) => (
          <div key={label} className={`${cardCls} p-5`}>
            <Icon className={`w-5 h-5 mb-3 ${red ? "text-red-400" : "text-green-400"}`} />
            <p className={`text-2xl font-bold ${red ? "text-red-400" : "text-white"}`}>{value}</p>
            <p className="text-gray-400 text-xs mt-1">
              {label}
              {sub && <span className="text-gray-500"> · {sub}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recipients */}
        <div className={`${cardCls} p-6 xl:col-span-2 min-w-0`}>
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-white mr-auto">Recipients</h2>
            <div className="relative md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={rSearchInput}
                onChange={(e) => setRSearchInput(e.target.value)}
                placeholder="Search number"
                className={`${inputCls} pl-10 py-2`}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {RECIPIENT_FILTERS.map((f) => (
              <button
                key={f.key || "all"}
                onClick={() => {
                  setRFilter(f.key);
                  setRPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs border ${
                  rFilter === f.key ? "bg-gray-800 border-gray-600 text-white" : "border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {recipients.recipients.length === 0 ? (
            <p className="text-gray-500 text-sm py-10 text-center">
              {s.total ? "No recipients match this filter." : "Recipients appear here once the campaign starts sending."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="py-2.5 pr-4 font-medium">Phone</th>
                    <th className="py-2.5 pr-4 font-medium">Name</th>
                    <th className="py-2.5 pr-4 font-medium">Status</th>
                    <th className="py-2.5 pr-4 font-medium">Updated</th>
                    <th className="py-2.5 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.recipients.map((r) => (
                    <tr key={r.id} className="border-b border-gray-800/60 align-top">
                      <td className="py-2.5 pr-4 text-white font-mono whitespace-nowrap">+{r.phone}</td>
                      <td className="py-2.5 pr-4 text-gray-300">{r.contact?.name || "—"}</td>
                      <td className="py-2.5 pr-4">
                        <StatusBadge status={r.status} map={RECIPIENT_STATUS} />
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-gray-400 whitespace-nowrap">
                        {formatDateTime(r.readAt || r.deliveredAt || r.sentAt || r.failedAt || r.updatedAt)}
                      </td>
                      <td className="py-2.5 text-xs text-red-300/90 max-w-xs break-words">
                        {r.errorText ? `${r.errorText}${r.errorCode ? ` (${r.errorCode})` : ""}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={recipients.page} pageSize={recipients.pageSize} total={recipients.total} onChange={setRPage} />
        </div>

        {/* Message */}
        <div className={`${cardCls} p-6 h-fit`}>
          <h2 className="text-lg font-semibold text-white mb-4">Message</h2>
          {c.template ? (
            <MessagePreview
              template={templateDto(c.template)}
              values={{ headerImageUrl: c.headerImageUrl, headerParams: c.headerParams, bodyParams: c.bodyParams }}
            />
          ) : (
            <p className="text-sm text-gray-400">The template "{c.templateName}" was deleted in Meta.</p>
          )}
        </div>
      </div>
    </WhatsAppShell>
  );
}

function Legend({ cls, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${cls}`} />
      {label}
    </span>
  );
}

// The campaign endpoint returns the raw template row; the preview expects
// the same shape the templates list uses.
function templateDto(t) {
  return {
    header: t.headerFormat ? { format: t.headerFormat, text: t.headerText, variables: t.headerVariables || [] } : null,
    body: { text: t.bodyText, variables: t.bodyVariables || [] },
    footer: t.footerText,
    buttons: t.buttons || [],
  };
}
