// src/pages/dashboard/Settings.jsx
import React, { useState } from "react";
import { User, Lock, Bell, Save, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "../../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [notifications, setNotifications] = useState({
    followUpReminders: true,
    renewalAlerts: true,
    emailUpdates: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState(null); // { type: "success" | "error", text }

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleUpdatePassword = async () => {
    setPwMessage(null);

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPwMessage({ type: "error", text: "All password fields are required." });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwMessage({ type: "error", text: "New password and confirm password don't match." });
      return;
    }

    try {
      setPwLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPwMessage({ type: "error", text: data.message || "Failed to update password" });
        return;
      }

      setPwMessage({ type: "success", text: "Password updated successfully." });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("❌ Update password error:", err);
      setPwMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your profile, security and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/40"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/40"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500/40"
              />
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("current")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("new")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword("confirm")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {pwMessage && (
              <p
                className={`text-xs ${
                  pwMessage.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {pwMessage.text}
              </p>
            )}

            <button
              onClick={handleUpdatePassword}
              disabled={pwLoading}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: "followUpReminders", label: "Follow-up reminders", desc: "Get notified about pending follow-ups." },
              { key: "renewalAlerts", label: "Renewal alerts", desc: "Get notified before a renewal is due." },
              { key: "emailUpdates", label: "Email updates", desc: "Receive a weekly summary by email." },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between py-3 border-b border-gray-800/60 last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    notifications[key] ? "bg-green-500" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      notifications[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}