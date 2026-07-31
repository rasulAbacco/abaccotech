// src/pages/dashboard/VendorEarnings.jsx
import React, { useEffect, useState } from "react";
import {
  Wallet,
  Clock3,
  CheckCircle2,
  Briefcase,
  RefreshCw,
  TrendingUp,
  PiggyBank,
  BadgeIndianRupee,
  Loader2,
  AlertCircle,
  Info,
  Building2,
} from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
  Paid: "text-green-400 bg-green-500/10 border-green-500/20",
  Pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
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

const TypeBadge = ({ type }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border ${
      type === "New Deal"
        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
        : "text-purple-400 bg-purple-500/10 border-purple-500/20"
    }`}
  >
    {type}
  </span>
);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const formatAmount = (amount) =>
  amount === null || amount === undefined ? "—" : `₹${Number(amount).toLocaleString("en-IN")}`;

const SectionCard = ({ title, children, right }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {right}
    </div>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, loading, accent = "from-green-500 to-green-600" }) => (
  <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300">
    <div className={`w-11 h-11 flex items-center justify-center bg-gradient-to-br ${accent} rounded-xl mb-4`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="text-2xl font-bold text-white mb-1">
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
    </div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

export default function VendorEarnings() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // "no_vendor" | "error" | null

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/vendor-earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.status === 404) {
          setError("no_vendor");
          return;
        }
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load your earnings.");
        }

        setEarnings(data.data);
      } catch (err) {
        console.error("❌ Failed to fetch vendor earnings:", err);
        setError("error");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const overview = earnings?.overview;
  const summary = earnings?.earningsSummary;
  const newDeals = earnings?.newDeals || [];
  const renewals = earnings?.renewals || [];
  const history = earnings?.history || [];

  // Simple comparison bar for New Deal vs Renewal commission (no chart
  // library dependency — plain CSS bars, same style Reports.jsx uses).
  const maxCommission = Math.max(1, summary?.newDealCommission ?? 0, summary?.renewalCommission ?? 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Vendor Earnings &amp; Commission</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track what you've earned from new referrals and renewals.
          </p>
        </div>
      </div>

      {!loading && error === "no_vendor" && (
        <div className="border border-gray-800 bg-gray-900/50 rounded-2xl p-10 text-center">
          <Building2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">
            Complete your vendor details to start tracking earnings
          </h3>
          <p className="text-gray-400 text-sm">
            Once your KYC is submitted, commission from your referrals will show up here automatically.
          </p>
        </div>
      )}

      {!loading && error === "error" && (
        <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl p-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          Couldn't load your earnings right now. Please refresh the page.
        </div>
      )}

      {(loading || (!error && earnings)) && (
        <>
          {/* 1. Commission Overview */}
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Commission Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            <StatCard
              icon={Wallet}
              label="Total Commission Earned"
              value={formatAmount(overview?.totalCommissionEarned)}
              loading={loading}
            />
            <StatCard
              icon={Clock3}
              label="Pending Commission"
              value={formatAmount(overview?.pendingCommission)}
              loading={loading}
              accent="from-yellow-500 to-yellow-600"
            />
            <StatCard
              icon={CheckCircle2}
              label="Paid Commission"
              value={formatAmount(overview?.paidCommission)}
              loading={loading}
            />
            <StatCard
              icon={Briefcase}
              label="Total Deals"
              value={overview?.totalDeals ?? 0}
              loading={loading}
              accent="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={RefreshCw}
              label="Total Renewals"
              value={overview?.totalRenewals ?? 0}
              loading={loading}
              accent="from-purple-500 to-purple-600"
            />
          </div>

        

          {/* Optional: simple New Deal vs Renewal earnings comparison */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 mb-10">
            <h3 className="text-sm font-semibold text-white mb-6">
              New Deal vs. Renewal Earnings
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>New Deal Commission</span>
                  <span>{formatAmount(summary?.newDealCommission)}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                    style={{ width: `${((summary?.newDealCommission ?? 0) / maxCommission) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>Renewal Commission</span>
                  <span>{formatAmount(summary?.renewalCommission)}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                    style={{ width: `${((summary?.renewalCommission ?? 0) / maxCommission) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. New Deal Commission */}
          <div className="mb-10">
            <SectionCard title="New Deal Commission (20%)">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Customer</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Company</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Product</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Plan</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Deal Amount</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        20% Commission
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Deal Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                          Loading deals...
                        </td>
                      </tr>
                    ) : newDeals.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                          No new deals yet — share your referral code to get started.
                        </td>
                      </tr>
                    ) : (
                      newDeals.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                            {d.customerName}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {d.companyName || "—"}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{d.product}</td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{d.plan || "—"}</td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {formatAmount(d.dealAmount)}
                          </td>
                          <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                            {formatAmount(d.commission)}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            <StatusBadge status={d.status} />
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {formatDate(d.date)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* 3. Renewal Commission */}
          <div className="mb-10">
            <SectionCard title="Renewal Commission (10%)">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Customer</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Company</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Previous Plan
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Renewed Plan
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Renewal Amount
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        10% Commission
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Renewal Date
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                          Loading renewals...
                        </td>
                      </tr>
                    ) : renewals.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                          No renewals yet.
                        </td>
                      </tr>
                    ) : (
                      renewals.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                            {r.customerName}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {r.companyName || "—"}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {r.previousPlan || "—"}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {r.renewedPlan || "—"}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {formatAmount(r.renewalAmount)}
                          </td>
                          <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                            {formatAmount(r.commission)}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {formatDate(r.date)}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            <StatusBadge status={r.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* 5. Commission History */}
          <div className="mb-10">
            <SectionCard title="Commission History">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Date</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Customer</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Product</th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Transaction Type
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Amount Paid
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Commission %
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">
                        Commission Amount
                      </th>
                      <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                          Loading history...
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                          No commission history yet.
                        </td>
                      </tr>
                    ) : (
                      history.map((h, index) => (
                        <tr
                          key={`${h.date}-${index}`}
                          className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {formatDate(h.date)}
                          </td>
                          <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                            {h.customer}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{h.product}</td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            <TypeBadge type={h.transactionType} />
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {formatAmount(h.amountPaid)}
                          </td>
                          <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                            {h.commissionPercent}%
                          </td>
                          <td className="py-3 pr-4 text-green-400 font-medium whitespace-nowrap">
                            {formatAmount(h.commissionAmount)}
                          </td>
                          <td className="py-3 pr-4 whitespace-nowrap">
                            <StatusBadge status={h.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>

          {/* 6. Commission Rules */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center bg-green-500/10 border border-green-500/20 rounded-lg shrink-0">
                <Info className="w-4 h-4 text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Commission Rules</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-300 pl-1">
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                Vendors receive <span className="text-white font-medium">20% commission</span> for
                every successful new customer referral.
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                Vendors receive <span className="text-white font-medium">10% commission</span> when
                the same customer renews or upgrades their subscription in future years.
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                Commission becomes payable only after the customer's payment is successfully
                completed.
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">•</span>
                Cancelled or refunded subscriptions are not eligible for commission.
              </li>
            </ul>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}