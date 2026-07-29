// src/pages/Register.jsx
import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ;

const REGISTER_FORM_KEY = "registerFormDraft";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem(REGISTER_FORM_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore malformed/unavailable storage
    }
    return {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(
    () => localStorage.getItem("acceptedTerms") === "true"
  );

  const handleTermsChange = (e) => {
    const checked = e.target.checked;
    setAgreedToTerms(checked);
    if (checked) {
      localStorage.setItem("acceptedTerms", "true");
    } else {
      localStorage.removeItem("acceptedTerms");
    }
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    try {
      sessionStorage.setItem(REGISTER_FORM_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable (e.g. private browsing) — form still works in-memory
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }

    setLoading(true);

    try {
      // Note: role is never sent from the client — the backend always
      // creates new accounts with role "user". Admin accounts are granted
      // separately (see backend notes).
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      sessionStorage.removeItem(REGISTER_FORM_KEY);

      navigate("/sign-in");
    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 -right-20 w-72 h-72 bg-green-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-lg">
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign up to get started
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agreedToTerms"
                checked={agreedToTerms}
                onChange={handleTermsChange}
                className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800/60 text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="agreedToTerms" className="text-sm text-gray-300 select-none">
                I have read and agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-green-400 hover:text-green-300 font-medium underline underline-offset-2"
                >
                  Terms & Conditions
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-green-400 hover:text-green-300 font-medium">
              Sign-in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}