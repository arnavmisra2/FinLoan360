import React from "react";

export function DashboardCard({ children, className = "", style = {}, title, subtitle, action }) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(145deg, #17101d 0%, #1b1323 100%)",
        border: "1px solid #3a3340",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(240,77,244,0.3), transparent)",
        }}
      />
      {(title || subtitle) && (
        <div style={{ marginBottom: "20px", position: "relative", zIndex: 1 }}>
          {title && (
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: "13px",
                color: "#9ca3af",
                margin: "6px 0 0 0",
                fontWeight: 400,
              }}
            >
              {subtitle}
            </p>
          )}
          {action && (
            <div style={{ marginTop: "12px" }}>{action}</div>
          )}
        </div>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}