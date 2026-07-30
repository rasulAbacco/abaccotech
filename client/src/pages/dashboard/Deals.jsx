// src/pages/dashboard/Deals.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Briefcase, Search, Loader2, AlertCircle, Building2 } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

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

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/referral-dashboard/deals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load deals.");
        }

        setDeals(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong while loading deals.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return deals;
    return deals.filter((d) =>
      [d.customerName, d.userName, d.companyName, d.email, d.referralCode]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q))
    );
  }, [deals, search]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Deals</h1>
          <p className="text-gray-400 text-sm mt-1">
            Every referred user, with full synced payment details.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/40"
          />
        </div>
      </div>

      {/* Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-4">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : deals.length}
          </div>
          <div className="text-gray-400 text-sm">Total Deals</div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">All Deals</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Company</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Contact</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Plan</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Billing</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Amount</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Website</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Referred By (Vendor)</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Referred On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                    Loading deals...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-gray-500 text-sm">
                    <Building2 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    No deals found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                      {d.customerName || d.userName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {d.companyName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-300">
                      {d.phone || "—"}
                      {d.email ? ` · ${d.email}` : ""}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{d.plan || "—"}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {d.billingPeriod || "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {formatAmount(d.amount)}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{d.website}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {d.vendor?.user?.username || d.vendor?.fullName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {formatDate(d.createdAt)}
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