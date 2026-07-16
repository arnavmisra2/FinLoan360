import React from "react";

export function EmptyState({ icon, title, description, action, style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 40px",
        textAlign: "center",
        background: "linear-gradient(145deg, #0e0e14 0%, #140c1a 100%)",
        border: "1px solid #2a1a30",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(ellipse at center, rgba(240,77,244,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          background: "rgba(240,77,244,0.1)",
          border: "1px solid rgba(240,77,244,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          marginBottom: "20px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0", position: "relative", zIndex: 1 }}>
        {title}
      </h3>
      <p style={{ fontSize: "15px", color: "#9ca3af", margin: "0 0 24px 0", maxWidth: "320px", lineHeight: 1.6, position: "relative", zIndex: 1 }}>
        {description}
      </p>
      {action && (
        <div style={{ position: "relative", zIndex: 1 }}>{action}</div>
      )}
    </div>
  );
}