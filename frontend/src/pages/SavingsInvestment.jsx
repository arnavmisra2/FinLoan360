import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { recommendSavings, getSummary } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { FormField } from "../components/FormField";
import { SelectField } from "../components/FormField";
import { GradientButton } from "../components/GradientButton";
import { ResultPanel } from "../components/ResultPanel";
import { EmptyState } from "../components/EmptyState";
import { RiskBadge } from "../components/RiskBadge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const RISK_PROFILES = [
  { value: "conservative", label: "Conservative", desc: "Capital preservation, low risk. 9-month emergency fund.", color: "#22c55e" },
  { value: "moderate", label: "Moderate", desc: "Balanced growth and safety. 6-month emergency fund.", color: "#f59e0b" },
  { value: "aggressive", label: "Aggressive", desc: "Maximum growth potential. 3-month emergency fund.", color: "#ef4444" },
];

const INVESTMENT_SPLITS = {
  conservative: { "Fixed Deposits": 40, "Bonds": 30, "Mutual Funds": 20, "Equity": 10 },
  moderate: { "Fixed Deposits": 20, "Bonds": 20, "Mutual Funds": 35, "Equity": 25 },
  aggressive: { "Fixed Deposits": 10, "Bonds": 10, "Mutual Funds": 30, "Equity": 50 },
};

const SPLIT_COLORS = { "Fixed Deposits": "#22c55e", "Bonds": "#4f7cff", "Mutual Funds": "#8b82ff", "Equity": "#f04df4" };

export default function SavingsInvestment() {
  const { user } = useUser();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [riskProfile, setRiskProfile] = useState("moderate");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await recommendSavings({ user_id: user.id, month, risk_profile: riskProfile });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate recommendation. Add income and expenses first.");
    } finally { setLoading(false); }
  };

  const pieData = result?.suggested_investment
    ? Object.entries(result.suggested_investment).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <>
      <PageHeader
        title="Savings & Investment Planner"
        subtitle="Get AI-powered savings recommendations and investment allocations based on your risk profile."
        breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Savings & Investment", current: true }]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <DashboardCard title="Planner Configuration" subtitle="Set your preferences for personalized recommendations">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField label="Month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "#9ca3af", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Risk Profile</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {RISK_PROFILES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setRiskProfile(p.value)}
                    style={{
                      padding: "16px",
                      borderRadius: "14px",
                      border: `2px solid ${riskProfile === p.value ? p.color : "#3a3340"}`,
                      background: riskProfile === p.value ? `${p.color}15` : "#17101d",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { if (riskProfile !== p.value) e.target.style.borderColor = p.color; }}
                    onMouseLeave={(e) => { if (riskProfile !== p.value) e.target.style.borderColor = "#3a3340"; }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color }} />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{p.label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af", lineHeight: 1.4 }}>{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <GradientButton fullWidth size="lg" loading={loading} type="submit">
              {loading ? "Generating..." : "Get Recommendation"}
            </GradientButton>
          </form>
        </DashboardCard>

        <DashboardCard title="AI Recommendation" subtitle="Personalized savings and investment plan">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <StatCard label="Monthly Income" value={`$${result.income?.toLocaleString()}`} color="primary" />
                  <StatCard label="Total Expenses" value={`$${result.total_expenses?.toLocaleString()}`} color="danger" />
                  <StatCard label="Savings Rate" value={`${result.savings_rate}%`} color="pink" />
                  <StatCard label="Emergency Fund Target" value={`$${result.emergency_fund_target?.toLocaleString()}`} color="success" />
                </div>

                <ResultPanel title="Monthly Savings Target" status="success">
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <p style={{ fontSize: "48px", fontWeight: 700, color: "#22c55e", margin: 0, lineHeight: 1 }}>
                      ${result.suggested_savings?.toLocaleString()}
                    </p>
                    <p style={{ marginTop: "8px", color: "#9ca3af", fontSize: "14px" }}>Per month</p>
                  </div>
                </ResultPanel>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
                  <ResultPanel title="Investment Allocation" status="info">
                    {pieData.length > 0 && (
                      <div style={{ height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {pieData.map((_, i) => <Cell key={i} fill={SPLIT_COLORS[pieData[i].name]} />)}
                            </Pie>
                            <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <table style={{ width: "100%", marginTop: "16px" }}>
                      <tbody>
                        {pieData.map((d) => (
                          <tr key={d.name} style={{ borderBottom: "1px solid #2a1a30" }}>
                            <td style={{ padding: "10px 0", color: "#fff" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: SPLIT_COLORS[d.name] }} />
                                {d.name}
                              </span>
                            </td>
                            <td style={{ textAlign: "right", padding: "10px 0", fontWeight: 600, color: SPLIT_COLORS[d.name] }}>
                              ${d.value.toLocaleString()} ({(d.value / result.suggested_savings * 100).toFixed(0)}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ResultPanel>

                  <ResultPanel title="Emergency Fund Progress" status="info">
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                        <span style={{ color: "#9ca3af" }}>Progress</span>
                        <strong style={{ color: "#fff" }}>{result.suggested_savings ? Math.min(100, (result.suggested_savings * 6 / result.emergency_fund_target * 100)).toFixed(0) : 0}%</strong>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "12px", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (result.suggested_savings || 0) * 6 / result.emergency_fund_target * 100)}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: "4px" }}
                        />
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#9ca3af" }}>
                      Target: ${result.emergency_fund_target?.toLocaleString()} (6 months expenses)
                    </p>
                  </ResultPanel>
                </div>

                <ResultPanel title="Risk Profile Details" status="info">
                  <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#9ca3af", fontStyle: "italic" }}>
                    Educational estimate, not financial advice. Consult a certified financial planner for personalized guidance.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {RISK_PROFILES.map(p => (
                      <div key={p.value} style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${riskProfile === p.value ? p.color : "#2a1a30"}`, borderRadius: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color }} />
                          <span style={{ fontWeight: 600 }}>{p.label}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </ResultPanel>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>💰</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }}>No Recommendation Yet</h3>
                <p style={{ margin: "0 auto", maxWidth: "300px" }}>Configure your profile and click "Get Recommendation" to see personalized savings and investment guidance.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardCard>
      </div>
    </>
  );
}