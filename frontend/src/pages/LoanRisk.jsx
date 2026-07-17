import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { predictLoan } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DashboardCard } from "../components/DashboardCard";
import { FormField } from "../components/FormField";
import { SelectField } from "../components/FormField";
import { GradientButton } from "../components/GradientButton";
import { ResultPanel } from "../components/ResultPanel";
import { RiskBadge } from "../components/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";

export default function LoanRisk() {
  const { user } = useUser();
  const [form, setForm] = useState({
    age: "", income: "", employment_length: "", home_ownership: "RENT",
    loan_amount: "", loan_intent: "PERSONAL", credit_history_length: "",
    previous_default: "0", interest_rate: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await predictLoan({
        user_id: user.id,
        age: parseInt(form.age),
        income: parseFloat(form.income),
        employment_length: parseInt(form.employment_length),
        home_ownership: form.home_ownership,
        loan_amount: parseFloat(form.loan_amount),
        loan_intent: form.loan_intent,
        credit_history_length: parseInt(form.credit_history_length),
        previous_default: parseInt(form.previous_default),
        interest_rate: form.interest_rate ? parseFloat(form.interest_rate) : null,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Loan Risk Prediction"
        subtitle="Assess loan default risk using AI-powered analysis of applicant financial profile."
        breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Loan Risk", current: true }]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <DashboardCard title="Applicant Details" subtitle="Enter applicant financial and personal information">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Age" name="age" type="number" value={form.age} onChange={handleChange} required placeholder="35" min="18" max="100" />
              <FormField label="Annual Income ($)" name="income" type="number" value={form.income} onChange={handleChange} required placeholder="60000" min="1" step="0.01" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Employment Length (years)" name="employment_length" type="number" value={form.employment_length} onChange={handleChange} required placeholder="5" min="0" max="50" />
              <SelectField label="Home Ownership" name="home_ownership" value={form.home_ownership} onChange={handleChange} required
                options={[
                  { value: "RENT", label: "Rent" },
                  { value: "OWN", label: "Own" },
                  { value: "MORTGAGE", label: "Mortgage" },
                  { value: "OTHER", label: "Other" },
                ]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Loan Amount ($)" name="loan_amount" type="number" value={form.loan_amount} onChange={handleChange} required placeholder="10000" min="1" step="0.01" />
              <SelectField label="Loan Intent" name="loan_intent" value={form.loan_intent} onChange={handleChange} required
                options={[
                  { value: "PERSONAL", label: "Personal" },
                  { value: "EDUCATION", label: "Education" },
                  { value: "MEDICAL", label: "Medical" },
                  { value: "VENTURE", label: "Venture" },
                  { value: "HOMEIMPROVEMENT", label: "Home Improvement" },
                  { value: "DEBTCONSOLIDATION", label: "Debt Consolidation" },
                ]} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Credit History Length (years)" name="credit_history_length" type="number" value={form.credit_history_length} onChange={handleChange} required placeholder="8" min="0" max="50" />
              <SelectField label="Previous Default" name="previous_default" value={form.previous_default} onChange={handleChange} required
                options={[
                  { value: "0", label: "No" },
                  { value: "1", label: "Yes" },
                ]} />
            </div>
            <FormField label="Interest Rate % (optional)" name="interest_rate" type="number" value={form.interest_rate} onChange={handleChange} placeholder="10.5" min="0" max="30" step="0.1" />
            <GradientButton variant="primary" size="lg" fullWidth loading={loading} type="submit">
              {loading ? "Analyzing..." : "Predict Loan Risk"}
            </GradientButton>
            {error && <ResultPanel status="danger" style={{ padding: "14px 16px" }}>{error}</ResultPanel>}
          </form>
        </DashboardCard>

        <DashboardCard title="Risk Preview" subtitle="AI-powered risk assessment results">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <ResultPanel status="success" title="Approval Probability">
                    <div style={{ fontSize: "42px", fontWeight: 700, color: "#22c55e", textAlign: "center" }}>
                      {(result.approval_probability * 100).toFixed(1)}%
                    </div>
                    <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginTop: "12px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.approval_probability * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: "4px" }}
                      />
                    </div>
                  </ResultPanel>
                  <ResultPanel status="danger" title="Default Probability">
                    <div style={{ fontSize: "42px", fontWeight: 700, color: "#ef4444", textAlign: "center" }}>
                      {(result.default_probability * 100).toFixed(1)}%
                    </div>
                    <div style={{ height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginTop: "12px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.default_probability * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ height: "100%", background: "linear-gradient(90deg, #ef4444, #dc2626)", borderRadius: "4px" }}
                      />
                    </div>
                  </ResultPanel>
                </div>

                <ResultPanel title="Risk Classification" status={result.risk_label === "Low Risk" ? "success" : result.risk_label === "Medium Risk" ? "warning" : "danger"}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <RiskBadge label={result.risk_label} level={result.risk_label} size="xl" />
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#9ca3af" }}>Default Thresholds</p>
<p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Low: {"<"} 25% \u2022 Medium: 25\u201360% \u2022 High: {">"} 60%
                      </p>
                    </div>
                  </div>
                </ResultPanel>

                {result.risk_factors && result.risk_factors.length > 0 && (
                  <ResultPanel title="Key Risk Factors" status="info">
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {result.risk_factors.map((factor, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px", fontSize: "14px", color: "#e0dfff" }}>
                          <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(240,77,244,0.2)", color: "#f04df4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{i + 1}</span>
                          {factor}
                        </motion.li>
                      ))}
                    </ul>
                  </ResultPanel>
                )}

                <ResultPanel title="Recommended Action" status={result.risk_label === "Low Risk" ? "success" : result.risk_label === "Medium Risk" ? "warning" : "danger"}>
                  <p style={{ margin: 0, fontSize: "15px", color: "#e0dfff", lineHeight: 1.6 }}>
                    {result.risk_label === "Low Risk"
                      ? "Strong candidate. Proceed with standard approval process."
                      : result.risk_label === "Medium Risk"
                      ? "Conditional approval recommended. Review additional documentation and consider lower loan amount or higher interest rate."
                      : "High risk detected. Recommend denial or require substantial collateral/co-signer. Review credit history and debt-to-income ratio carefully."}
                  </p>
                </ResultPanel>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }}>No Prediction Yet</h3>
                <p style={{ margin: "0 auto", maxWidth: "300px" }}>Fill in the applicant details and click "Predict Loan Risk" to see the AI assessment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardCard>
      </div>
    </>
  );
}