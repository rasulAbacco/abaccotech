// \src\pages\dashboard\VendorsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  User,
  ExternalLink,
  ClipboardCheck,
  ArrowUpRight,
  Building2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";
import ReferralCodeBadge from "../../Components/ReferralCodeBadge";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STATUS_STYLES = {
  PAID: "text-green-400 bg-green-500/10 border-green-500/20",
  ACTIVE: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  TRIAL: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  CANCELLED: "text-gray-400 bg-gray-500/10 border-gray-500/20",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function VendorsList() {
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // "no_vendor" | "error" | null

  useEffect(() => {
    // Everything here is stored data — Bounce Cure referrals land in this
    // same table via the backend's scheduled sync job, so this page doesn't
    // need to know anything about Bounce Cure directly.
    const fetchMyReferrals = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/referral/me`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();

        if (res.status === 404) {
          setError("no_vendor");
          return;
        }

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load referrals");
        }

        setStats(data.data.stats);
        setReferrals(data.data.referrals);
      } catch (err) {
        console.error("❌ Failed to fetch referrals:", err);
        setError("error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReferrals();
  }, []);

  const websiteGroups = Object.values(
    referrals.reduce((acc, r) => {
      if (!acc[r.website]) {
        acc[r.website] = { website: r.website, count: 0, latest: r.createdAt };
      }
      acc[r.website].count += 1;
      if (new Date(r.createdAt) > new Date(acc[r.website].latest)) {
        acc[r.website].latest = r.createdAt;
      }
      return acc;
    }, {})
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen text-white py-10 px-2 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white">Vendors</h1>
              <p className="text-gray-400 text-sm mt-1">
                Referral websites and referred clients at a glance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <ReferralCodeBadge />
              <Link
                to="/vendors"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 self-start sm:self-auto"
              >
                <ClipboardCheck className="w-4 h-4" />
                Complete Your Details
              </Link>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-20">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading your referrals...
            </div>
          )}

          {!loading && error === "no_vendor" && (
            <div className="border border-gray-800 bg-gray-900/50 rounded-2xl p-10 text-center">
              <Building2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Complete your vendor details to start tracking referrals
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Once your KYC is submitted, referrals registered with your
                code will show up here automatically.
              </p>
              <Link
                to="/vendors"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
              >
                <ClipboardCheck className="w-4 h-4" />
                Complete Your Details
              </Link>
            </div>
          )}

          {!loading && error === "error" && (
            <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl p-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Couldn't load your referrals right now. Please refresh the page.
            </div>
          )}

          {!loading && !error && (
            <>
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: "Total Referrals", value: stats.totalReferrals },
                    { label: "Trial", value: stats.trialUsers },
                    { label: "Active", value: stats.activeUsers },
                    { label: "Paid", value: stats.paidUsers },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5"
                    >
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-gray-400 text-xs mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {referrals.length === 0 && (
                <div className="border border-gray-800 bg-gray-900/50 rounded-2xl p-10 text-center text-gray-400">
                  No referrals yet. Share your referral code to get started.
                </div>
              )}

              {websiteGroups.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Referral Websites
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {websiteGroups.map(({ website, count, latest }) => (
                      <div
                        key={website}
                        className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[11px] font-medium uppercase tracking-wide text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                            Referral Website
                          </span>
                        </div>

                        <h3 className="font-semibold text-white text-lg mb-1">
                          {website}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {count} referral{count !== 1 ? "s" : ""} total
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800">
                          <span className="text-xs text-gray-500">
                            Last on {formatDate(latest)}
                          </span>
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {referrals.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Referred Clients
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {referrals.map((r) => (
                      <div
                        key={r.id}
                        className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all duration-300 flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                            <User className="w-5 h-5 text-white" />
                          </div>
                           
                        </div>

                        <h3 className="font-semibold text-white text-lg mb-1">
                          {r.userName}
                        </h3>
                        <p className="text-gray-400 text-sm mb-1">
                          {r.phone}
                          {r.email ? ` · ${r.email}` : ""}
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          {r.plan ? `Plan: ${r.plan}` : "No plan selected"}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800">
                          <span className="text-xs text-gray-500">
                            {r.website} · {formatDate(r.createdAt)}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}