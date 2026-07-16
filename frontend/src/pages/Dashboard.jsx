import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { healthCheck, getLoanHistory, getCreditScoreHistory } from "../services/api";
import { StatCard } from "../components/StatCard";
import { DashboardCard } from "../components/DashboardCard";
import { PageHeader } from "../components/PageHeader";
import { DatabaseStatus } from "../components/DatabaseStatus";
import { EmptyState } from "../components/EmptyState";
import { RiskBadge } from "../components/RiskBadge";
import { GradientButton } from "../components/GradientButton";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useUser();
  const [health, setHealth] = useState(null);
  const [loanCount, setLoanCount] = useState(0);
  const [creditCount, setCreditCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [healthRes, loanRes, creditRes] = await Promise.allSettled([
          healthCheck(),
          getLoanHistory(user.id),
          getCreditScoreHistory(user.id),
        ]);
        if (healthRes.status === "fulfilled") setHealth(healthRes.value.data);
        if (loanRes.status === "fulfilled") {
          setLoanCount(loanRes.value.data.length);
          setRecentLoans(loanRes.value.data.slice(0, 3));
        }
        if (creditRes.status === "fulfilled") setCreditCount(creditRes.value.data.length);
      } catch {}
      setLoading(false);
    };
    load();
  }, [user.id]);

  const riskColor = (label) => {
    if (!label) return "#6b7280";
    if (label === "Low Risk") return "#22c55e";
    if (label === "Medium Risk") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <>
      <DatabaseStatus />
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name?.split(" ")[0] || "User"}. Here's your financial overview.`}
        breadcrumb={[{ label: "Dashboard", path: "/", current: true }]}
      />

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            <StatCard
              label="API Status"
              value={health?.status === "healthy" ? "Operational" : "Degraded"}
              color={health?.status === "healthy" ? "success" : "warning"}
              icon={health?.status === "healthy" ? "✓" : "⚠"}
            />
            <StatCard
              label="Database"
              value={health?.database === "connected" ? "Connected" : "Offline"}
              color={health?.database === "connected" ? "success" : "danger"}
              icon={health?.database === "connected" ? "💾" : "⚠"}
            />
            <StatCard
              label="Loan Assessments"
              value={loanCount}
              color="primary"
              icon="🏦"
            />
            <StatCard
              label="Credit Score Checks"
              value={creditCount}
              color="pink"
              icon="📈"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            <DashboardCard title="Module Overview" subtitle="Available analysis tools">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { name: "Loan Risk Prediction", desc: "ML-powered loan default risk assessment", status: health?.models?.loan_risk_model ? "ready" : "unavailable", icon: "🏦" },
                  { name: "Land Collateral", desc: "Property valuation & LTV calculation", status: "ready", icon: "🏠" },
                  { name: "Expense Tracker", desc: "Monthly income & expense management", status: "ready", icon: "💳" },
                  { name: "Savings Planner", desc: "AI investment recommendations", status: "ready", icon: "💰" },
                  { name: "Credit Score", desc: "Score prediction & improvement plan", status: health?.models?.credit_score_model ? "ready" : "unavailable", icon: "📈" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid #2a1a30",
                      borderRadius: "14px",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{m.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "15px", fontWeight: 500, color: "#ffffff", margin: "0 0 2px 0" }}>{m.name}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{m.desc}</p>
                    </div>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      background: m.status === "ready" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      border: m.status === "ready" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                      color: m.status === "ready" ? "#22c55e" : "#ef4444",
                    }}>
                      {m.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Model Status" subtitle="ML model health check">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { name: "Loan Risk Model", loaded: health?.models?.loan_risk_model, metric: "ROC-AUC: 90.1%", type: "GradientBoosting" },
                  { name: "Credit Score Model", loaded: health?.models?.credit_score_model, metric: "Accuracy: 47.1%", type: "GradientBoosting" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      background: m.loaded ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
                      border: m.loaded ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "14px",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff", margin: "0 0 4px 0" }}>{m.name}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{m.type} • {m.metric}</p>
                    </div>
                    <span style={{
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: m.loaded ? "#22c55e" : "#ef4444",
                      boxShadow: m.loaded ? "0 0 8px #22c55e" : "0 0 8px #ef4444",
                    }} />
                  </motion.div>
                ))}
                {!health?.models?.loan_risk_model && (
                  <p style={{ fontSize: "13px", color: "#9ca3af", margin: "8px 0 0 0" }}>
                    Train models by running scripts in <code>backend/scripts/</code>. See README for details.
                  </p>
                )}
              </div>
            </DashboardCard>
          </div>

          {recentLoans.length > 0 && (
            <DashboardCard title="Recent Loan Assessments" subtitle="Your latest risk predictions">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentLoans.map((loan) => (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid #2a1a30",
                      borderRadius: "14px",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 500, color: "#ffffff", margin: "0 0 4px 0" }}>
                        {loan.inputs_json?.loan_intent || "Loan"} — ${loan.inputs_json?.loan_amount?.toLocaleString()}
                      </p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                        {new Date(loan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", textAlign: "right" }}>
                      <div>
                        <p style={{ fontSize: "18px", fontWeight: 700, color: riskColor(loan.risk_label), margin: 0 }}>
                          {(loan.default_probability * 100).toFixed(1)}%
                        </p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0 0" }}>Default Probability</p>
                      </div>
                      <RiskBadge label={loan.risk_label} level={loan.risk_label?.toLowerCase().replace(" ", "")} size="sm" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>
          )}
        </>
      )}
    </>
  );
}