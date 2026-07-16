import React from "react";

export function RiskBadge({ label, level }) {
  const configs = {
    low: { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)", text: "#22c55e", icon: "✓" },
    medium: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", text: "#f59e0b", icon: "⚠" },
    high: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444", icon: "✕" },
    safe: { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)", text: "#22c55e", icon: "✓" },
    moderate: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", text: "#f59e0b", icon: "⚠" },
    risky: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444", icon: "✕" },
    good: { bg: "rgba(34, 197, 94, 0.15)", border: "rgba(34, 197, 94, 0.3)", text: "#22c55e", icon: "★" },
    standard: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", text: "#f59e0b", icon: "●" },
    poor: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "#ef4444", icon: "✕" },
  };

  const config = configs[level?.toLowerCase()] || configs.low;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        color: config.text,
        letterSpacing: "0.3px",
      }}
    >
      <span style={{ fontSize: "10px" }}>{config.icon}</span>
      {label}
    </span>
  );
}