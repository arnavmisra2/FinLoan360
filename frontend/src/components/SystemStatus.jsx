import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { healthCheck } from "../services/api";

export function SystemStatus() {
  const [status, setStatus] = useState({
    api: "checking",
    database: "checking",
    loanModel: "checking",
    creditModel: "checking",
    collateralEngine: "checking",
  });

  useEffect(() => {
    const check = async () => {
      try {
        const res = await healthCheck();
        const data = res.data;
        setStatus({
          api: "ok",
          database: data.database === "connected" ? "ok" : "error",
          loanModel: data.models?.loan_risk_model ? "ok" : "error",
          creditModel: data.models?.credit_score_model ? "ok" : "error",
          collateralEngine: "ok",
        });
      } catch {
        setStatus({
          api: "error",
          database: "error",
          loanModel: "error",
          creditModel: "error",
          collateralEngine: "error",
        });
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const systems = [
    { id: "api", label: "API Status", color: "#f04df4" },
    { id: "database", label: "Database", color: "#22c55e" },
    { id: "loanModel", label: "Loan Risk Model", color: "#4f7cff" },
    { id: "creditModel", label: "Credit Score Model", color: "#8b82ff" },
    { id: "collateralEngine", label: "Collateral Engine", color: "#f59e0b" },
  ];

  return (
    <div className="system-status-grid">
      {systems.map((sys) => {
        const s = status[sys.id];
        const isOk = s === "ok";
        const isError = s === "error";
        const isChecking = s === "checking";
        return (
          <motion.div
            key={sys.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.random() * 0.3 }}
            className="system-card"
            style={{
              background: isOk ? "rgba(34, 197, 94, 0.08)" : isError ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)",
              borderColor: isOk ? "rgba(34, 197, 94, 0.3)" : isError ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)",
            }}
          >
            <div className="system-indicator">
              <span className={`status-dot ${isOk ? "ok" : isError ? "error" : "checking"}`} />
              <span className="system-label">{sys.label}</span>
            </div>
            <div className="system-status">
              {isOk && "Operational"}
              {isError && "Offline"}
              {isChecking && "Checking..."}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}