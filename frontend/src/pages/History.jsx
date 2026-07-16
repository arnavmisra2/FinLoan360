import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { getLoanHistory, getCreditScoreHistory } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DashboardCard } from "../components/DashboardCard";
import { RiskBadge } from "../components/RiskBadge";
import { EmptyState } from "../components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "loan", label: "Loan Risk", icon: "🏦" },
  { id: "credit", label: "Credit Score", icon: "📈" },
  { id: "collateral", label: "Land Collateral", icon: "🏠" },
  { id: "expenses", label: "Expenses", icon: "💳" },
  { id: "savings", label: "Savings & Investment", icon: "💰" },
];

const RISK_LEVELS = {
  "Low Risk": "low",
  "Medium Risk": "medium",
  "High Risk": "high",
  Good: "low",
  Standard: "medium",
  Poor: "high",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function History() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("loan");
  const [loading, setLoading] = useState(false);
  const [loanHistory, setLoanHistory] = useState([]);
  const [creditHistory, setCreditHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [loanRes, creditRes] = await Promise.allSettled([
          getLoanHistory(user.id),
          getCreditScoreHistory(user.id),
        ]);
        if (loanRes.status === "fulfilled") setLoanHistory(loanRes.value.data);
        if (creditRes.status === "fulfilled") setCreditHistory(creditRes.value.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [user.id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "loan":
        return (
          <DashboardCard title={`Loan Risk Predictions (${loanHistory.length})`} subtitle="Your past loan risk assessments">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading...</div>
            ) : loanHistory.length === 0 ? (
              <EmptyState icon="🏦" title="No Loan Predictions" description="Run your first risk assessment in the Loan Risk module." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {loanHistory.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: loanHistory.indexOf(item) * 0.05 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(79,124,255,0.15)", border: "1px solid rgba(79,124,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏦</div>
                      <div>
                        <p style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 500, color: "#fff" }}>{item.inputs_json?.loan_intent || "Loan"} • ${item.inputs_json?.loan_amount?.toLocaleString()}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>{formatDate(item.created_at)}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", textAlign: "right" }}>
                      <div>
                        <p style={{ margin: "0 0 2px 0", fontSize: "18px", fontWeight: 700, color: "#4f7cff" }}>{(item.approval_probability * 100).toFixed(1)}%</p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>Approval</p>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 2px 0", fontSize: "18px", fontWeight: 700, color: "#ef4444" }}>{(item.default_probability * 100).toFixed(1)}%</p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#6b7280", textTransform: "uppercase" }}>Default</p>
                      </div>
                      <RiskBadge label={item.risk_label} level={RISK_LEVELS[item.risk_label]} size="md" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </DashboardCard>
        );

      case "credit":
        return (
          <DashboardCard title={`Credit Score Assessments (${creditHistory.length})`} subtitle="Your past credit score analyses">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Loading...</div>
            ) : creditHistory.length === 0 ? (
              <EmptyState icon="📈" title="No Credit Assessments" description="Analyze your credit score in the Credit Score module." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {creditHistory.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: creditHistory.indexOf(item) * 0.05 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139,130,255,0.15)", border: "1px solid rgba(139,130,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📈</div>
                      <div>
                        <p style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 500, color: "#fff" }}>Credit Score Assessment</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>{formatDate(item.created_at)}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", textAlign: "right" }}>
                      <RiskBadge label={item.predicted_score_class} level={RISK_LEVELS[item.predicted_score_class]} size="lg" />
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>Suggestions: {item.suggestions?.length || 0}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </DashboardCard>
        );

      default:
        return (
          <DashboardCard title="Coming Soon" subtitle="History for this module will be available soon">
            <EmptyState icon="📋" title="Coming Soon" description="History for this module will be available in a future update." />
          </DashboardCard>
        );
    }
  };

  return (
    <>
      <PageHeader
        title="Assessment History"
        subtitle="Review all your past risk assessments, credit analyses, and financial predictions."
        breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "History", current: true }]}
      />

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px",
              border: `1px solid ${activeTab === tab.id ? "rgba(240,77,244,0.5)" : "#3a3340"}`,
              background: activeTab === tab.id ? "rgba(240,77,244,0.1)" : "rgba(255,255,255,0.02)",
              color: activeTab === tab.id ? "#f04df4" : "#9ca3af",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.borderColor = "#f04df4"; }}
            onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.borderColor = "#3a3340"; }}
          >
            <span style={{ fontSize: "16px" }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {renderTabContent()}
    </>
  );
}