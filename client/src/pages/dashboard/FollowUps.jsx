// src/pages/dashboard/FollowUps.jsx
import React, { useEffect, useMemo, useState } from "react";
import { PhoneCall, Clock, AlertTriangle, Search, Loader2, AlertCircle } from "lucide-react";
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

// Whichever of expiry/next-billing is soonest is what actually needs
// following up on for this row.
const nextActionDate = (f) => f.nextBillingDate || f.expiryDate || null;

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFollowUps = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/referral-dashboard/follow-ups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load follow-ups.");
        }

        setFollowUps(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong while loading follow-ups.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return followUps;
    return followUps.filter((f) =>
      [f.customerName, f.userName, f.companyName, f.email]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q))
    );
  }, [followUps, search]);

  const trialCount = followUps.filter((f) => f.status === "TRIAL" || f.isTrial).length;
  const pendingCount = followUps.filter((f) => f.status === "PENDING").length;
  const overdueCount = followUps.filter((f) => {
    const d = nextActionDate(f);
    return d && new Date(d).getTime() < Date.now();
  }).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow Ups</h1>
          <p className="text-gray-400 text-sm mt-1">
            Trial, pending payment, expired, and soon-to-expire referrals.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/40"
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl mb-4">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : trialCount}
          </div>
          <div className="text-gray-400 text-sm">Trial Users</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : pendingCount}
          </div>
          <div className="text-gray-400 text-sm">Payment Pending</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-4">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : overdueCount}
          </div>
          <div className="text-gray-400 text-sm">Overdue</div>
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
        <h2 className="text-lg font-semibold text-white mb-6">All Follow Ups</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Client Name</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Phone</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Email</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Plan</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Next Action Date</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Status</th>
                <th className="py-3 pr-4 font-medium text-gray-400 whitespace-nowrap">Referred By</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                    Loading follow-ups...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500 text-sm">
                    No follow-ups found.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                      {f.customerName || f.userName}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {f.phone ? <a href={`tel:${f.phone}`} className="hover:text-green-400">{f.phone}</a> : "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {f.email ? <a href={`mailto:${f.email}`} className="hover:text-green-400">{f.email}</a> : "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{f.plan || "—"}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {formatDate(nextActionDate(f))}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">
                      {f.vendor?.user?.username || f.vendor?.fullName || "—"}
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