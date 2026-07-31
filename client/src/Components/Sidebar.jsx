// src/Components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Handshake,
  PhoneCall,
  RefreshCw,
  XCircle,
  BarChart3,
  Settings,
  LogOut,
  User,
  Briefcase,
  Wallet 
} from "lucide-react";

const allMenuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", adminOnly: false },
  { label: "Vendors", icon: Handshake, path: "/vendors-list", adminOnly: false },
  { label: "Earnings", icon: Wallet, path: "/earnings", adminOnly: false },
  // 🆕 FIXED: these five were all hard-coded to adminOnly: false, so the
  // filter below (`!item.adminOnly || isAdmin`) never actually restricted
  // anything — every regular user could see and open all of them. They
  // show full referral/payment details across deals, follow-ups,
  // renewals, cancellations, and reports, so they're admin-only now.
  { label: "Deals", icon: Briefcase, path: "/deals", adminOnly: true },
  { label: "Follow Ups", icon: PhoneCall, path: "/follow-ups", adminOnly: true },
  { label: "Renewals", icon: RefreshCw, path: "/renewals", adminOnly: true },
  { label: "Renewal Cancelled", icon: XCircle, path: "/renewals-cancelled", adminOnly: true },
  { label: "Reports", icon: BarChart3, path: "/reports", adminOnly: true },

  { label: "Settings", icon: Settings, path: "/settings", adminOnly: false },

  // 🆕 FIXED: same issue — this is the admin user-management page
  // (Admin.jsx / UserDetails.jsx), so it should never have been visible
  // to non-admin users either.
  { label: "Admin", icon: User, path: "/admin", adminOnly: true },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const menuItems = allMenuItems.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  return (
    <aside className="w-64 h-screen bg-gray-900/80 border-r border-gray-800 flex flex-col fixed left-0 top-0">
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          Abacco<span className="text-green-500">Tech</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-5 border-t border-gray-800">
        {user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-semibold text-white truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}