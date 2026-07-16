import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { healthCheck } from "../services/api";

export function DatabaseStatus() {
  const [status, setStatus] = useState("checking");
  const [dbName, setDbName] = useState("finloan360");

  const checkHealth = useCallback(async () => {
    try {
      const res = await healthCheck();
      const data = res.data;
      if (data.database === "connected") {
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }
      if (data.db_name) setDbName(data.db_name);
    } catch {
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const config = {
    connected: { color: "#22c55e", label: "Database Connected", dot: "●" },
    disconnected: { color: "#ef4444", label: "Database Offline", dot: "●" },
    checking: { color: "#f59e0b", label: "Checking...", dot: "◐" },
  };

  const cfg = config[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="database-status"
      style={{
        borderColor: `${cfg.color}40`,
        boxShadow: `0 8px 32px ${cfg.color}22, inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}
    >
      <span
        className={`db-dot ${status === "connected" ? "connected" : ""}`}
        style={{
          fontSize: "14px",
          color: cfg.color,
        }}
      >
        {cfg.dot}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#ffffff", letterSpacing: "0.3px" }}>
          {cfg.label}
        </span>
        <span style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase" }}>
          {dbName}
        </span>
      </div>
    </motion.div>
  );
}