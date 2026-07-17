import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { analyzeCreditScore } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DashboardCard } from "../components/DashboardCard";
import { FormField } from "../components/FormField";
import { SelectField } from "../components/FormField";
import { GradientButton } from "../components/GradientButton";
import { ResultPanel } from "../components/ResultPanel";
import { RiskBadge } from "../components/RiskBadge";
import { EmptyState } from "../components/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

const scoreColors = { Good: "#22c55e", Standard: "#f59e0b", Poor: "#ef4444" };

export default function CreditScore() {
  const { user } = useUser();
  const [form, setForm] = useState({
    delayed_payments: "", outstanding_debt: "", credit_utilization: "",
    emi: "", credit_history_age: "", monthly_balance: "",
    num_loans: "", num_credit_cards: "", annual_income: "",
    monthly_salary: "", bank_accounts: "", amount_invested_monthly: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        delayed_payments: parseInt(form.delayed_payments) || 0,
        outstanding_debt: parseFloat(form.outstanding_debt) || 0,
        credit_utilization: parseFloat(form.credit_utilization) || 0,
        emi: parseFloat(form.emi) || 0,
        credit_history_age: parseInt(form.credit_history_age) || 0,
        monthly_balance: parseFloat(form.monthly_balance) || 0,
        num_loans: parseInt(form.num_loans) || 0,
        num_credit_cards: parseInt(form.num_credit_cards) || 0,
        annual_income: parseFloat(form.annual_income) || 1,
        monthly_salary: parseFloat(form.monthly_salary) || 1,
        bank_accounts: parseInt(form.bank_accounts) || 0,
        amount_invested_monthly: parseFloat(form.amount_invested_monthly) || 0,
      };
      const res = await analyzeCreditScore(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader
        title="Credit Score Improvement"
        subtitle="Get your predicted credit score class and personalized improvement action plan."
        breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Credit Score", current: true }]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <DashboardCard title="Financial Profile" subtitle="Enter your financial and credit details">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Annual Income ($)" name="annual_income" type="number" value={form.annual_income} onChange={handleChange} required placeholder="60000" min="1" step="0.01" />
              <FormField label="Monthly Salary ($)" name="monthly_salary" type="number" value={form.monthly_salary} onChange={handleChange} required placeholder="5000" min="1" step="0.01" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Delayed Payments" name="delayed_payments" type="number" value={form.delayed_payments} onChange={handleChange} required placeholder="3" min="0" />
              <FormField label="Outstanding Debt ($)" name="outstanding_debt" type="number" value={form.outstanding_debt} onChange={handleChange} required placeholder="5000" min="0" step="0.01" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Credit Utilization (0-1)" name="credit_utilization" type="number" value={form.credit_utilization} onChange={handleChange} required placeholder="0.4" min="0" max="1" step="0.01" />
              <FormField label="Monthly EMI ($)" name="emi" type="number" value={form.emi} onChange={handleChange} required placeholder="500" min="0" step="0.01" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Credit History Age (months)" name="credit_history_age" type="number" value={form.credit_history_age} onChange={handleChange} required placeholder="36" min="0" max="600" />
              <FormField label="Monthly Balance ($)" name="monthly_balance" type="number" value={form.monthly_balance} onChange={handleChange} required placeholder="2000" step="0.01" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Number of Loans" name="num_loans" type="number" value={form.num_loans} onChange={handleChange} required placeholder="2" min="0" />
              <FormField label="Number of Credit Cards" name="num_credit_cards" type="number" value={form.num_credit_cards} onChange={handleChange} required placeholder="3" min="0" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Bank Accounts" name="bank_accounts" type="number" value={form.bank_accounts} onChange={handleChange} required placeholder="2" min="0" />
              <FormField label="Amount Invested Monthly ($)" name="amount_invested_monthly" type="number" value={form.amount_invested_monthly} onChange={handleChange} required placeholder="300" min="0" step="0.01" />
            </div>
            {error && <ResultPanel status="danger" style={{ padding: "14px 16px" }}>{error}</ResultPanel>}
            <GradientButton fullWidth size="lg" loading={loading} type="submit">
              {loading ? "Analyzing..." : "Analyze Credit Score"}
            </GradientButton>
          </form>
        </DashboardCard>

        <DashboardCard title="Credit Assessment" subtitle="AI-powered credit score prediction and action plan">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px" }}>Predicted Score Class</p>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{ fontSize: "64px", fontWeight: 700, color: scoreColors[result.predicted_score_class] || "#fff", margin: "0 0 16px 0" }}
                  >
                    {result.predicted_score_class}
                  </motion.div>
                  <RiskBadge
                    label={result.predicted_score_class === "Good" ? "Healthy Credit Profile" : result.predicted_score_class === "Standard" ? "Room for Improvement" : "Needs Attention"}
                    level={result.predicted_score_class.toLowerCase()}
                    size="xl"
                  />
                </div>

                {result.suggestions && result.suggestions.length > 0 && (
                  <ResultPanel title="Improvement Suggestions" status="info">
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {result.suggestions.map((s, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px", fontSize: "14px", color: "#e0dfff" }}>
                          <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(240,77,244,0.2)", color: "#f04df4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{i + 1}</span>
                          {s}
                        </motion.li>
                      ))}
                    </ul>
                  </ResultPanel>
                )}

                <ResultPanel title="3-Month Action Plan" status="info">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {[
                      { month: "Month 1: Foundation", color: "#4f7cff", tasks: ["Set up auto-pay for all EMIs and bills", "Check credit report for errors and dispute if needed", "Create a monthly budget using the Expense Tracker"] },
                      { month: "Month 2: Reduction", color: "#8b82ff", tasks: ["Pay down highest-interest debt first (avalanche method)", "Reduce credit utilization below 30%", "Avoid opening new credit accounts"] },
                      { month: "Month 3: Optimization", color: "#f04df4", tasks: ["Review progress and recalculate credit score", "Maintain consistent payment history", "Consider debt consolidation if multiple loans"] },
                    ].map((m, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        style={{ padding: "20px", background: "rgba(255,255,255,0.02)", border: `1px solid ${m.color}40`, borderRadius: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: m.color }} />
                          <strong style={{ fontSize: "15px", color: "#fff" }}>{m.month}</strong>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: "20px", color: "#9ca3af", fontSize: "13px", lineHeight: 1.8 }}>
                          {m.tasks.map((t, ti) => <li key={ti}>{t}</li>)}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </ResultPanel>

                <ResultPanel status="warning" style={{ padding: "16px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#f59e0b", fontStyle: "italic" }}>
                    Educational estimate, not financial advice. Consult a certified financial planner for personalized guidance.
                  </p>
                </ResultPanel>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📈</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }}>No Assessment Yet</h3>
                <p style={{ margin: "0 auto", maxWidth: "300px" }}>Fill in your financial profile and click "Analyze Credit Score" to get your predicted score class and improvement plan.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardCard>
      </div>
    </>
  );
}