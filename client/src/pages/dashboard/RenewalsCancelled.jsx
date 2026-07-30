// src/pages/dashboard/RenewalsCancelled.jsx
import React, { useEffect, useState } from "react";
import { XCircle, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
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

export default function RenewalsCancelled() {
  const [cancelled, setCancelled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCancelled = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/referral-dashboard/renewals-cancelled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load cancelled renewals.");
        }

        setCancelled(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong while loading cancelled renewals.");
      } finally {
        setLoading(false);
      }
    };

    fetchCancelled();
  }, []);

  const lostAmount = cancelled.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Renewal Cancelled</h1>
          <p className="text-gray-400 text-sm mt-1">
            Cancelled, expired, or failed-payment referrals.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : cancelled.length}
          </div>
          <div className="text-gray-400 text-sm">Cancelled / Expired / Failed</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : formatAmount(lostAmount)}
          </div>
          <div className="text-gray-400 text-sm">Amount Lost</div>
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
        <h2 className="text-lg font-semibold text-white mb-6">Cancelled Renewals</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Plan</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Expiry Date</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Last Updated</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Amount</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Referred By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                    Loading cancelled renewals...
                  </td>
                </tr>
              ) : cancelled.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500 text-sm">
                    No cancelled renewals.
                  </td>
                </tr>
              ) : (
                cancelled.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                      {c.customerName || c.userName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{c.plan || "—"}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {formatDate(c.expiryDate)}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {formatDate(c.updatedAt)}
                    </td>
                    <td className="py-3 pr-4 text-red-400 font-medium whitespace-nowrap">
                      {formatAmount(c.amount)}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {c.vendor?.user?.username || c.vendor?.fullName || "—"}
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