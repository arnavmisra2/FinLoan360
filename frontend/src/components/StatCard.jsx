import React from "react";

export function StatCard({ label, value, trend, trendLabel, color = "primary", icon, className = "", style = {} }) {
  const colors = {
    primary: { bg: "rgba(79, 124, 255, 0.12)", border: "#4f7cff", text: "#4f7cff", glow: "rgba(79, 124, 255, 0.2)" },
    success: { bg: "rgba(34, 197, 94, 0.12)", border: "#22c55e", text: "#22c55e", glow: "rgba(34, 197, 94, 0.2)" },
    warning: { bg: "rgba(245, 158, 11, 0.12)", border: "#f59e0b", text: "#f59e0b", glow: "rgba(245, 158, 11, 0.2)" },
    danger: { bg: "rgba(239, 68, 68, 0.12)", border: "#ef4444", text: "#ef4444", glow: "rgba(239, 68, 68, 0.2)" },
    pink: { bg: "rgba(240, 77, 244, 0.12)", border: "#f04df4", text: "#f04df4", glow: "rgba(240, 77, 244, 0.2)" },
    violet: { bg: "rgba(139, 130, 255, 0.12)", border: "#8b82ff", text: "#8b82ff", glow: "rgba(139, 130, 255, 0.2)" },
  };

  const c = colors[color] || colors.primary;

  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(145deg, #17101d 0%, #1b1323 100%)",
        border: `1px solid ${c.border}33`,
        borderRadius: "18px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 4px 24px ${c.glow}`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${c.border}, ${c.border}88)`,
        }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 8px 0",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            {value}
          </p>
          {trend !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: trend >= 0 ? "#22c55e" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span style={{ fontSize: "12px", color: "#6b7280" }}>{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: c.bg,
              border: `1px solid ${c.border}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: c.text,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}