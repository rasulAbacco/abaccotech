// src/Components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// 🆕 Route-level guard for admin-only pages (Deals, Follow Ups, Renewals,
// Renewal Cancelled, Reports, Admin). Hiding these from Sidebar.jsx only
// stops navigation via the menu — this stops navigation via a typed/pasted
// URL too.
export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}