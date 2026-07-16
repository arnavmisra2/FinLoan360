import React from "react";

export function ResultPanel({ title, children, status = "info", className = "", style = {} }) {
  const statusStyles = {
    info: { bg: "rgba(79, 124, 255, 0.08)", border: "#4f7cff", icon: "ℹ️" },
    success: { bg: "rgba(34, 197, 94, 0.08)", border: "#22c55e", icon: "✓" },
    warning: { bg: "rgba(245, 158, 11, 0.08)", border: "#f59e0b", icon: "⚠" },
    danger: { bg: "rgba(239, 68, 68, 0.08)", border: "#ef4444", icon: "✕" },
  };

  const s = statusStyles[status] || statusStyles.info;

  return (
    <div
      className={className}
      style={{
        background: s.bg,
        border: `1px solid ${s.border}40`,
        borderRadius: "16px",
        padding: "24px",
        ...style,
      }}
    >
      {(title || status !== "info") && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
            paddingBottom: "16px",
            borderBottom: `1px solid ${s.border}22`,
          }}
        >
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: `${s.border}22`,
              color: s.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {s.icon}
          </span>
          <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", margin: 0 }}>
            {title}
          </h4>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}