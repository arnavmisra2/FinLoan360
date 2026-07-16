import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { assessCollateral } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DashboardCard } from "../components/DashboardCard";
import { FormField } from "../components/FormField";
import { SelectField } from "../components/FormField";
import { GradientButton } from "../components/GradientButton";
import { ResultPanel } from "../components/ResultPanel";
import { RiskBadge } from "../components/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";

export default function LandCollateral() {
  const { user } = useUser();
  const [form, setForm] = useState({
    state: "", district: "", area_sqft: "", property_type: "residential", requested_loan: "",
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
      const res = await assessCollateral({
        user_id: user.id,
        state: form.state,
        district: form.district,
        area_sqft: parseFloat(form.area_sqft),
        property_type: form.property_type,
        requested_loan: parseFloat(form.requested_loan),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Assessment failed.");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    approved: { color: "#22c55e", label: "Safe", level: "low" },
    conditional: { color: "#f59e0b", label: "Moderate", level: "medium" },
    rejected: { color: "#ef4444", label: "Risky", level: "high" },
  };

  return (
    <>
      <PageHeader
        title="Land Collateral Assessment"
        subtitle="Calculate property market value, LTV ratio, and maximum eligible loan amount."
        breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Land Collateral", current: true }]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <DashboardCard title="Property Details" subtitle="Enter property and loan information">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="State" name="state" value={form.state} onChange={handleChange} required placeholder="Maharashtra" />
              <FormField label="District" name="district" value={form.district} onChange={handleChange} required placeholder="Mumbai" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <FormField label="Land Area (sq ft)" name="area_sqft" type="number" value={form.area_sqft} onChange={handleChange} required placeholder="1000" min="1" step="0.01" />
              <SelectField label="Property Type" name="property_type" value={form.property_type} onChange={handleChange} required
                options={[
                  { value: "residential", label: "Residential" },
                  { value: "commercial", label: "Commercial" },
                  { value: "industrial", label: "Industrial" },
                  { value: "agricultural", label: "Agricultural" },
                ]} />
            </div>
            <FormField label="Requested Loan Amount ($)" name="requested_loan" type="number" value={form.requested_loan} onChange={handleChange} required placeholder="1000000" min="1" step="0.01" />
            <GradientButton variant="primary" size="lg" fullWidth loading={loading} type="submit">
              {loading ? "Assessing..." : "Assess Collateral"}
            </GradientButton>
            {error && <ResultPanel status="danger" style={{ padding: "14px 16px" }}>{error}</ResultPanel>}
          </form>
        </DashboardCard>

        <DashboardCard title="Collateral Summary" subtitle="AI-calculated property valuation and loan eligibility">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <ResultPanel title="Market Value" status="info">
                    <div style={{ fontSize: "32px", fontWeight: 700, color: "#4f7cff", textAlign: "center" }}>
                      ${result.collateral_value.toLocaleString()}
                    </div>
                    <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
                      ${result.rate_per_sqft.toLocaleString()} / sq ft
                    </p>
                  </ResultPanel>
                  <ResultPanel title="Max Eligible Loan (70% LTV)" status="success">
                    <div style={{ fontSize: "32px", fontWeight: 700, color: "#22c55e", textAlign: "center" }}>
                      ${result.max_eligible_loan.toLocaleString()}
                    </div>
                    <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", marginTop: "8px" }}>
                      70% of property value
                    </p>
                  </ResultPanel>
                </div>

                <ResultPanel title="LTV Analysis" status={statusConfig[result.status]?.color || "info"}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                      <span style={{ color: "#9ca3af" }}>LTV Ratio</span>
                      <strong style={{ color: statusConfig[result.status]?.color }}>{result.ltv_ratio.toFixed(1)}%</strong>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "12px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(result.ltv_ratio, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background: `linear-gradient(90deg, ${statusConfig[result.status]?.color}, ${statusConfig[result.status]?.color}aa)`,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                      <span>0%</span>
                      <span>Safe ≤70%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#9ca3af" }}>Requested Loan</p>
                      <p style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#ffffff" }}>${parseFloat(form.requested_loan).toLocaleString()}</p>
                    </div>
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#9ca3af" }}>Max Eligible</p>
                      <p style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#22c55e" }}>${result.max_eligible_loan.toLocaleString()}</p>
                    </div>
                  </div>
                </ResultPanel>

                <ResultPanel title="Assessment Status" status={statusConfig[result.status]?.color || "info"}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <RiskBadge label={statusConfig[result.status]?.label} level={statusConfig[result.status]?.level} size="xl" />
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#9ca3af" }}>Collateral Coverage</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        {result.ltv_ratio <= 70 ? "Excellent coverage. Loan well within safe LTV limits." : result.ltv_ratio <= 85 ? "Moderate coverage. Conditional approval with additional safeguards." : "Insufficient coverage. Loan exceeds recommended LTV threshold."}
                      </p>
                    </div>
                  </div>
                </ResultPanel>

                <ResultPanel title="Property Details" status="info">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#9ca3af" }}>Location</p>
                      <p style={{ margin: 0, fontWeight: 500 }}>{form.state}, {form.district}</p>
                    </div>
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#9ca3af" }}>Property Type</p>
                      <p style={{ margin: 0, fontWeight: 500, textTransform: "capitalize" }}>{form.property_type}</p>
                    </div>
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#9ca3af" }}>Area</p>
                      <p style={{ margin: 0, fontWeight: 500 }}>{parseFloat(form.area_sqft).toLocaleString()} sq ft</p>
                    </div>
                    <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid #2a1a30", borderRadius: "10px" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#9ca3af" }}>Rate / sq ft</p>
                      <p style={{ margin: 0, fontWeight: 500 }}>${result.rate_per_sqft.toLocaleString()}</p>
                    </div>
                  </div>
                </ResultPanel>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#ffffff", margin: "0 0 8px 0" }}>No Assessment Yet</h3>
                <p style={{ margin: 0, maxWidth: "300px", margin: "0 auto" }}>Enter property details and click "Assess Collateral" to calculate market value and loan eligibility.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardCard>
      </div>
    </>
  );
}