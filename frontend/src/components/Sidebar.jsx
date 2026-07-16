import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { GradientButton } from "./GradientButton";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/loan-risk", label: "Loan Risk", icon: "🏦" },
  { path: "/land-collateral", label: "Land Collateral", icon: "🏠" },
  { path: "/expenses", label: "Expense Tracker", icon: "💳" },
  { path: "/savings", label: "Savings & Investment", icon: "💰" },
  { path: "/credit-score", label: "Credit Score", icon: "📈" },
  { path: "/history", label: "History", icon: "📋" },
];

export function Sidebar({ activePage, setActivePage, collapsed }) {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      style={{
        width: collapsed ? "80px" : "280px",
        minWidth: collapsed ? "80px" : "280px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        background: "linear-gradient(180deg, #0b0b10 0%, #08080b 100%)",
        borderRight: "1px solid #2a1a30",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s",
        overflow: "hidden",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid #2a1a30",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minHeight: "90px",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="logo-wrapper"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #f04df4 0%, #8b82ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(240,77,244,0.3)",
          }}
        >
          🏦
        </motion.div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ overflow: "hidden" }}
          >
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.3px" }}>
              FinLoan360
            </h1>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0 0 0", textTransform: "uppercase", letterSpacing: "1px" }}>
              AI Financial Risk
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {menuItems.map((item) => {
            const isActive = activePage === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path);
                    setActivePage(item.path);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: collapsed ? 0 : "14px",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    color: isActive ? "#ffffff" : "#9ca3af",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 400,
                    transition: "all 0.2s ease",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(240,77,244,0.18) 0%, rgba(139,130,255,0.12) 100%)"
                      : "transparent",
                    border: isActive ? "1px solid rgba(240,77,244,0.3)" : "1px solid transparent",
                    boxShadow: isActive ? "0 4px 20px rgba(240,77,244,0.15)" : "none",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "none",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.color = "#e0dfff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#9ca3af";
                    }
                  }}
                >
                  <span className="icon" style={{ fontSize: "20px", flexShrink: 0, display: "flex" }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        background: "linear-gradient(180deg, #f04df4 0%, #8b82ff 100%)",
                        borderRadius: "0 2px 2px 0",
                      }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: "20px",
          right: "-12px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #17101d 0%, #1b1323 100%)",
          border: "1px solid #3a3340",
          color: "#9ca3af",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          transition: "all 0.2s",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#f04df4";
          e.currentTarget.style.color = "#f04df4";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#3a3340";
          e.currentTarget.style.color = "#9ca3af";
        }}
      >
        {collapsed ? "▶" : "◀"}
      </button>

      {/* User Profile */}
      <AnimatePresence mode="wait">
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sidebar-footer"
            style={{
              padding: "20px",
              borderTop: "1px solid #2a1a30",
              background: "linear-gradient(180deg, transparent 0%, #08080b 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f04df4 0%, #8b82ff 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.name}
                </p>
                <p style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.email}
                </p>
              </div>
            </div>
            <GradientButton
              variant="outline"
              fullWidth
              size="sm"
              onClick={logout}
              style={{ borderColor: "#ef4444", color: "#ef4444" }}
            >
              Logout
            </GradientButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}