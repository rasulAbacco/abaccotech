// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Building2, Briefcase, PhoneCall, Globe, Gift, Loader2, ShieldAlert } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";
import ReferralCodeBadge from "../../Components/ReferralCodeBadge";

const API_URL = import.meta.env.VITE_API_URL;

// 🆕 Static placeholders for the admin view — no deals/follow-up tracking
// exists yet, so these stay fixed until that's built out.
const STATIC_TOTAL_DEALS = 128;
const STATIC_FOLLOW_UPS = 12;

// TODO: replace with real data from your API
const recentDeals = [
  {
    siNo: 1,
    date: "28-Jul-2026",
    clientName: "ABC School",
    softwareName: "Abacco Edu ERP",
    totalAmount: "₹50,000",
    commissionAmount: "₹5,000",
    renewalDate: "28-Jul-2027",
    renewalCommission: "₹5,000",
  },
  {
    siNo: 2,
    date: "29-Jul-2026",
    clientName: "XYZ Hospital",
    softwareName: "Abacco Hospital ERP",
    totalAmount: "₹1,20,000",
    commissionAmount: "₹12,000",
    renewalDate: "29-Jul-2027",
    renewalCommission: "₹12,000",
  },
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState(null); // shape differs by role — see below
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAdminOverview = async () => {
      const res = await fetch(`${API_URL}/referral/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load the dashboard.");

      return {
        totalVendors: data.data?.totalVendors ?? 0,
        totalReferralUsers: data.data?.totalReferralUsers ?? 0,
      };
    };

    const fetchVendorOverview = async () => {
      const res = await fetch(`${API_URL}/referral/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load your referral stats.");

      const referrals = data.data?.referrals || [];
      // "Total Referral Websites" = number of distinct source sites
      // (School CRM, Bounce Cure, etc.) this vendor has referrals from.
      const distinctWebsites = new Set(referrals.map((r) => r.website)).size;

      return {
        totalReferralWebsites: distinctWebsites,
        totalReferralUsers: data.data?.stats?.totalReferrals ?? referrals.length,
      };
    };

    const load = async () => {
      setLoadingStats(true);
      setStatsError("");
      try {
        // 🆕 Same page, two different data sources depending on who's
        // logged in — admins see the platform-wide overview, everyone
        // else sees their own vendor/referral stats.
        const result = isAdmin ? await fetchAdminOverview() : await fetchVendorOverview();
        setStats(result);
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
        { icon: Briefcase, label: "Total Deals", value: STATIC_TOTAL_DEALS },
        { icon: PhoneCall, label: "Follow-ups", value: STATIC_FOLLOW_UPS },
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
        {/* 🆕 Referral code only makes sense for a vendor's own dashboard */}
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

      {/* Recent Deals Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Deals</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  SI No
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Date
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Company / Client Name
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Software Name
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Total Amount
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Commission Amount
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Renewal Date
                </th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                  Renewal Commission Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {recentDeals.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-gray-500 text-sm"
                  >
                    No deals to show yet.
                  </td>
                </tr>
              ) : (
                recentDeals.map((deal) => (
                  <tr
                    key={deal.siNo}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-gray-300">{deal.siNo}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.date}
                    </td>
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                      {deal.clientName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.softwareName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.totalAmount}
                    </td>
                    <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                      {deal.commissionAmount}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {deal.renewalDate}
                    </td>
                    <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                      {deal.renewalCommission}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}