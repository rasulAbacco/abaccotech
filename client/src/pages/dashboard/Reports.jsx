// src/pages/dashboard/Reports.jsx
import React, { useEffect, useState } from "react";
import { TrendingUp, IndianRupee, Users, Clock3, Building2, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatMonthLabel = (monthKey) => {
  // monthKey looks like "2026-07"
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
};

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/referral-dashboard/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load reports.");
        }

        setReports(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong while loading reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const summary = [
    { icon: Building2, label: "Total Vendors", value: reports?.totalVendors ?? 0 },
    { icon: Users, label: "Total Referred Users", value: reports?.totalReferredUsers ?? 0 },
    { icon: IndianRupee, label: "Total Revenue", value: formatAmount(reports?.totalRevenue) },
    { icon: Clock3, label: "Pending Revenue", value: formatAmount(reports?.pendingRevenue) },
    { icon: TrendingUp, label: "Renewals Due (30d)", value: reports?.renewalsDue ?? 0 },
  ];

  const monthlyRevenue = reports?.monthlyRevenue || [];
  const maxRevenue = Math.max(1, ...monthlyRevenue.map((m) => m.revenue));

  const planCounts = reports?.planCounts || {};
  const statusCounts = reports?.statusCounts || {};

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">
            Performance overview across all your referrals.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {summary.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300"
          >
            <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
            </div>
            <div className="text-gray-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Plan status breakdown row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active", value: reports?.activePlans ?? 0 },
          { label: "Trial", value: reports?.trialPlans ?? 0 },
          { label: "Expired", value: reports?.expiredPlans ?? 0 },
          { label: "Cancelled", value: reports?.cancelledPlans ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <p className="text-2xl font-bold text-white">{loading ? "—" : value}</p>
            <p className="text-gray-400 text-xs mt-1">{label} Plans</p>
          </div>
        ))}
      </div>

      {/* Monthly revenue bar chart */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-6">Monthly Revenue</h2>
        {monthlyRevenue.length === 0 ? (
          <p className="text-gray-500 text-sm">No revenue collected yet.</p>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs text-gray-400">{formatAmount(m.revenue)}</div>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-green-600 to-green-400"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                />
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {formatMonthLabel(m.month)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan-wise / Status-wise breakdown tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Plan-wise Breakdown</h2>
          {Object.keys(planCounts).length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-2 pr-4 font-medium text-gray-400">Plan</th>
                  <th className="py-2 pr-4 font-medium text-gray-400">Referrals</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(planCounts).map(([plan, count]) => (
                  <tr key={plan} className="border-b border-gray-800/60">
                    <td className="py-2.5 pr-4 text-white font-medium">{plan}</td>
                    <td className="py-2.5 pr-4 text-gray-300">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Status-wise Breakdown</h2>
          {Object.keys(statusCounts).length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-2 pr-4 font-medium text-gray-400">Status</th>
                  <th className="py-2 pr-4 font-medium text-gray-400">Referrals</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <tr key={status} className="border-b border-gray-800/60">
                    <td className="py-2.5 pr-4 text-white font-medium">{status}</td>
                    <td className="py-2.5 pr-4 text-gray-300">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}