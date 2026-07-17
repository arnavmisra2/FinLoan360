import React from "react";
import { motion } from "framer-motion";

export function GradientButton({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  style = {},
  type = "button",
}) {
  const variants = {
    primary: {
      bg: "linear-gradient(135deg, #f04df4 0%, #8b82ff 100%)",
      hover: "linear-gradient(135deg, #e83ee8 0%, #7a71ff 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "rgba(240,77,244,0.4)",
    },
    secondary: {
      bg: "linear-gradient(135deg, #211426 0%, #17101d 100%)",
      hover: "linear-gradient(135deg, #2a1a30 0%, #1e1428 100%)",
      color: "#ffffff",
      border: "1px solid #3a3340",
      shadow: "rgba(139,130,255,0.2)",
    },
    outline: {
      bg: "transparent",
      hover: "rgba(240,77,244,0.08)",
      color: "#f04df4",
      border: "1px solid #f04df4",
      shadow: "rgba(240,77,244,0.2)",
    },
    ghost: {
      bg: "transparent",
      hover: "rgba(255,255,255,0.05)",
      color: "#9ca3af",
      border: "1px solid transparent",
      shadow: "none",
    },
    success: {
      bg: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      hover: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "rgba(34,197,94,0.4)",
    },
    danger: {
      bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      hover: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      color: "#ffffff",
      border: "none",
      shadow: "rgba(239,68,68,0.4)",
    },
  };

  const sizes = {
    sm: { padding: "10px 20px", fontSize: "13px", height: "40px", radius: "10px", gap: "8px" },
    md: { padding: "14px 28px", fontSize: "15px", height: "50px", radius: "12px", gap: "10px" },
    lg: { padding: "18px 36px", fontSize: "16px", height: "58px", radius: "14px", gap: "12px" },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        width: fullWidth ? "100%" : "auto",
        height: s.height,
        padding: s.padding,
        background: disabled || loading ? "rgba(33,20,38,0.6)" : v.bg,
        color: v.color,
        border: v.border || "none",
        borderRadius: s.radius,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        boxShadow: v.shadow ? `0 4px 20px ${v.shadow}` : "none",
        opacity: disabled || loading ? 0.6 : 1,
        ...style,
      }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02, boxShadow: v.shadow ? `0 8px 30px ${v.shadow}` : "none" }}
      whileTap={{ scale: 0.98 }}
    >
      {loading && (
        <motion.span
          style={{
            width: "18px",
            height: "18px",
            border: "2px solid transparent",
            borderTopColor: v.color,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      )}
      <span style={{ display: "flex", alignItems: "center" }}>{children}</span>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.button>
  );
}