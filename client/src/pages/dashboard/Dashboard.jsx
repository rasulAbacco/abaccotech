// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Building2, Briefcase, PhoneCall, Globe, Gift, Loader2, ShieldAlert } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";
import ReferralCodeBadge from "../../Components/ReferralCodeBadge";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
  PAID: "text-green-400 bg-green-500/10 border-green-500/20",
  ACTIVE: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  TRIAL: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  PENDING: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  CANCELLED: "text-gray-400 bg-gray-500/10 border-gray-500/20",
  EXPIRED: "text-red-400 bg-red-500/10 border-red-500/20",
  PAYMENT_FAILED: "text-red-400 bg-red-500/10 border-red-500/20",
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${
      STATUS_STYLES[status] || "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }`}
  >
    {status || "—"}
  </span>
);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const formatAmount = (amount) =>
  amount === null || amount === undefined ? "—" : `₹${Number(amount).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState(null); // shape differs by role — see below
  const [recentDeals, setRecentDeals] = useState([]); // admin only
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeader = { Authorization: `Bearer ${token}` };

    // 🆕 Admin view: platform-wide vendor/referral totals, PLUS real Total
    // Deals / Follow-ups counts and a Recent Deals list — all sourced from
    // the same admin-only Referral Dashboard endpoints that power the
    // dedicated Deals/Follow Ups pages, instead of the old static
    // placeholders (128 / 12) and hard-coded sample rows.
    const fetchAdminOverview = async () => {
      const [overviewRes, dealsRes, followUpsRes] = await Promise.all([
        fetch(`${API_URL}/referral/admin/overview`, { headers: authHeader }),
        fetch(`${API_URL}/api/referral-dashboard/deals`, { headers: authHeader }),
        fetch(`${API_URL}/api/referral-dashboard/follow-ups`, { headers: authHeader }),
      ]);

      const overviewData = await overviewRes.json();
      if (!overviewRes.ok) {
        throw new Error(overviewData.message || "Failed to load the dashboard.");
      }

      const dealsData = await dealsRes.json();
      if (!dealsRes.ok || !dealsData.success) {
        throw new Error(dealsData.message || "Failed to load deals.");
      }

      const followUpsData = await followUpsRes.json();
      if (!followUpsRes.ok || !followUpsData.success) {
        throw new Error(followUpsData.message || "Failed to load follow-ups.");
      }

      const deals = dealsData.data || [];

      return {
        stats: {
          totalVendors: overviewData.data?.totalVendors ?? 0,
          totalDeals: deals.length,
          totalFollowUps: (followUpsData.data || []).length,
          totalReferralUsers: overviewData.data?.totalReferralUsers ?? 0,
        },
        // deals are already newest-first from the backend — just take the top 6.
        recent: deals.slice(0, 6),
      };
    };

    // Vendor view: their own referral overview from GET /referral/me.
    // Unchanged — vendors don't have access to the admin-only
    // /api/referral-dashboard/* endpoints, so no Recent Deals table here.
    const fetchVendorOverview = async () => {
      const res = await fetch(`${API_URL}/referral/me`, { headers: authHeader });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load your referral stats.");

      const referrals = data.data?.referrals || [];
      const distinctWebsites = new Set(referrals.map((r) => r.website)).size;

      return {
        stats: {
          totalReferralWebsites: distinctWebsites,
          totalReferralUsers: data.data?.stats?.totalReferrals ?? referrals.length,
        },
        recent: [],
      };
    };

    const load = async () => {
      setLoadingStats(true);
      setStatsError("");
      try {
        const result = isAdmin ? await fetchAdminOverview() : await fetchVendorOverview();
        setStats(result.stats);
        setRecentDeals(result.recent);
      } catch (err) {
        setStatsError(err.message || "Something went wrong while loading the dashboard.");
      } finally {
        setLoadingStats(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const statCards = isAdmin
    ? [
        { icon: Building2, label: "Total Vendors", value: stats?.totalVendors ?? 0 },
        { icon: Briefcase, label: "Total Deals", value: stats?.totalDeals ?? 0 },
        { icon: PhoneCall, label: "Follow-ups", value: stats?.totalFollowUps ?? 0 },
        { icon: Gift, label: "Total Referral Users", value: stats?.totalReferralUsers ?? 0 },
      ]
    : [
        { icon: Globe, label: "Total Referral Websites", value: stats?.totalReferralWebsites ?? 0 },
        { icon: Gift, label: "Total Referral Users", value: stats?.totalReferralUsers ?? 0 },
      ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back{user?.username ? `, ${user.username}` : ""} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin
              ? "Here's the platform-wide overview across every vendor and referral."
              : "Here's what's happening with your platform today."}
          </p>
        </div>
        {/* Referral code only makes sense for a vendor's own dashboard */}
        {!isAdmin && <ReferralCodeBadge />}
      </div>

      {/* Error */}
      {statsError && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          {statsError}
        </div>
      )}

      {/* Stats Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isAdmin ? "lg:grid-cols-4" : ""
        } gap-6 mb-8`}
      >
        {statCards.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300"
          >
            <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {loadingStats ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
            </div>
            <div className="text-gray-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* 🆕 Recent Deals — admin only, since the underlying endpoint
          (/api/referral-dashboard/deals) is admin-only. Shows the 6 most
          recently referred users with real synced payment details, in
          place of the old hard-coded 2-row sample table. */}
      {isAdmin && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Deals</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">SI No</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Date</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Company</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Plan</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Amount</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                  <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Website</th>
                </tr>
              </thead>
              <tbody>
                {loadingStats ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                      Loading recent deals...
                    </td>
                  </tr>
                ) : recentDeals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500 text-sm">
                      No deals to show yet.
                    </td>
                  </tr>
                ) : (
                  recentDeals.map((deal, index) => (
                    <tr
                      key={deal.id ?? index}
                      className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-3 pr-4 text-gray-300">{index + 1}</td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {formatDate(deal.createdAt)}
                      </td>
                      <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                        {deal.customerName || deal.userName}
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {deal.companyName || "—"}
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {deal.plan || "—"}
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                        {formatAmount(deal.amount)}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <StatusBadge status={deal.status} />
                      </td>
                      <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{deal.website}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}