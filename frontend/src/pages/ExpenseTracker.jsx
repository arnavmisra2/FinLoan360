import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { addIncome, addExpense, getExpenses, getSummary, deleteExpense } from "../services/api";
import { PageHeader } from "../components/PageHeader";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { FormField } from "../components/FormField";
import { SelectField } from "../components/FormField";
import { GradientButton } from "../components/GradientButton";
import { EmptyState } from "../components/EmptyState";
import { RiskBadge } from "../components/RiskBadge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { motion } from "framer-motion";

const CATEGORIES = ["Rent", "Food", "Transport", "EMI", "Utilities", "Healthcare", "Education", "Entertainment", "Shopping", "Investment", "Other"];
const COLORS = ["#f04df4", "#8b82ff", "#4f7cff", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#a855f7", "#14b8a6", "#6b7280"];

export default function ExpenseTracker() {
  const { user } = useUser();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [newExpense, setNewExpense] = useState({ category: "Food", amount: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [expRes, sumRes] = await Promise.allSettled([
        getExpenses(user.id, month),
        getSummary(user.id, month),
      ]);
      if (expRes.status === "fulfilled") setExpenses(expRes.value.data);
      if (sumRes.status === "fulfilled") {
        setSummary(sumRes.value.data);
        if (sumRes.value.data.income > 0) setIncome(sumRes.value.data.income);
      }
    } catch {}
  }, [user.id, month]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleIncome = async (e) => {
    e.preventDefault();
    if (!income || parseFloat(income) <= 0) return;
    setError(""); setLoading(true);
    try {
      await addIncome({ user_id: user.id, month, income: parseFloat(income) });
      loadData();
    } catch { setError("Failed to save income"); }
    setLoading(false);
  };

  const handleExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) return;
    setError(""); setLoading(true);
    try {
      await addExpense({
        user_id: user.id, month,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        note: newExpense.note || null,
      });
      setNewExpense({ category: "Food", amount: "", note: "" });
      loadData();
    } catch (err) { setError(err.response?.data?.detail || "Failed to add expense"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try { await deleteExpense(id); loadData(); } catch {}
  };

  const pieData = summary?.category_breakdown
    ? Object.entries(summary.category_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const barArray = expenses.reduce((acc, exp) => {
    const day = new Date(exp.created_at).getDate();
    if (!acc[day]) acc[day] = { day: String(day) };
    acc[day][exp.category] = (acc[day][exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Expense Tracker"
        subtitle="Track monthly income, expenses, and savings rate with AI-powered insights."
        breadcrumb={[{ label: "Dashboard", path: "/" }, { label: "Expense Tracker", current: true }]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
        <StatCard label="Total Income" value={summary ? `$${summary.income.toLocaleString()}` : "$0"} color="primary" icon="💰" />
        <StatCard label="Total Expenses" value={summary ? `$${summary.total_expenses.toLocaleString()}` : "$0"} color="danger" icon="💸" />
        <StatCard label="Disposable Income" value={summary ? `$${summary.disposable_income.toLocaleString()}` : "$0"} color={summary?.disposable_income >= 0 ? "success" : "danger"} icon="💵" />
        <StatCard label="Savings Rate" value={summary ? `${summary.savings_rate.toFixed(1)}%` : "0%"} color="pink" icon="📊" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <DashboardCard title="Monthly Income" subtitle="Set or update your monthly income">
          <form onSubmit={handleIncome} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FormField label="Income ($)" type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="5000" step="0.01" min="1" />
            <GradientButton fullWidth loading={loading} type="submit">Save Income</GradientButton>
          </form>
        </DashboardCard>

        <DashboardCard title="Add Expense" subtitle="Record a new expense entry">
          <form onSubmit={handleExpense} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <SelectField label="Category" name="category" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                options={CATEGORIES.map(c => ({ value: c, label: c }))} required />
              <FormField label="Amount ($)" name="amount" type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="50" min="0.01" step="0.01" required />
            </div>
            <FormField label="Note (optional)" name="note" value={newExpense.note} onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })} placeholder="e.g. Grocery shopping" />
            <GradientButton fullWidth loading={loading} type="submit">Add Expense</GradientButton>
          </form>
        </DashboardCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <DashboardCard title="Category Breakdown" subtitle="Expense distribution by category">
          {pieData.length > 0 ? (
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon="📊" title="No Expenses" description="Add expenses to see category breakdown." />
          )}
        </DashboardCard>

        <DashboardCard title="Monthly Trend" subtitle="Daily expense totals">
          {Object.keys(barArray).length > 0 ? (
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.values(barArray).sort((a,b) => parseInt(a.day) - parseInt(b.day))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a1a30" />
                  <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "#2a1a30" }} />
                  <YAxis type="category" dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={{ stroke: "#2a1a30" }} width={40} />
                  <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                  <Legend />
                  {CATEGORIES.slice(0, 8).map((cat, i) => <Bar key={cat} dataKey={cat} fill={COLORS[i]} radius={[0, 4, 4, 0]} />)}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon="📈" title="No Data" description="Add expenses to see monthly trend." />
          )}
        </DashboardCard>
      </div>

      <DashboardCard title={`Expenses (${expenses.length})`} subtitle="All recorded expenses for this month">
        {expenses.length === 0 ? (
          <EmptyState icon="💳" title="No Expenses" description="Add your first expense to get started." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2a1a30" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Category</th>
                  <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Amount</th>
                  <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Note</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Date</th>
                  <th style={{ textAlign: "center", padding: "12px 16px" }}></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: "1px solid #1f1524" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#ffffff" }}>{exp.category}</td>
                    <td style={{ textAlign: "right", padding: "12px 16px", fontSize: "14px", fontWeight: 500, color: "#ef4444" }}>${exp.amount.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#9ca3af" }}>{exp.note || "—"}</td>
                    <td style={{ textAlign: "center", padding: "12px 16px", fontSize: "12px", color: "#6b7280" }}>
                      {new Date(exp.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 16px" }}>
                      <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px", opacity: 0.6, transition: "opacity 0.2s" }} onMouseOver={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.6} title="Delete">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </>
  );
}