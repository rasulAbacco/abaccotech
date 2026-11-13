// src/pages/dashboard/whatsapp/WhatsAppCampaigns.jsx
//
// 🆕 WhatsApp campaigns list — route /whatsapp. Refreshes itself while any
// campaign is sending or scheduled.

import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCheck, FileText, Megaphone, Plus, Send, Users, XCircle, Eye } from "lucide-react";
import { waApi } from "./whatsappApi";
import { CAMPAIGN_STATUS, campaignAudienceLabel, formatDateTime, formatNumber, percent } from "./whatsappUtils";
import { ErrorBox, Spinner, StatusBadge, WhatsAppShell, cardCls, primaryBtn } from "./WhatsAppUI";

const LIVE = new Set(["SENDING", "SCHEDULED"]);

export default function WhatsAppCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

          <div className={`${cardCls} p-6 overflow-x-auto`}>
            <table className="w-full text-sm text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="py-2.5 pr-4 font-medium">Campaign</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 pr-4 font-medium">Progress</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Sent</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Delivered</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Read</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Failed</th>
                  <th className="py-2.5 font-medium">Date</th>
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
                      className="border-b border-gray-800/60 hover:bg-gray-800/30 cursor-pointer"
                    >
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
                      <td className="py-3 text-xs text-gray-400 whitespace-nowrap">
                        {c.status === "SCHEDULED"
                          ? `Sends ${formatDateTime(c.scheduledAt)}`
                          : formatDateTime(c.startedAt || c.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
