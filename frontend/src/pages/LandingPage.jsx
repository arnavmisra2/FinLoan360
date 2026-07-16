import React from "react";
import { useNavigate } from "react-router-dom";
import { LandingHero } from "../components/LandingHero";
import { ModuleCard } from "../components/ModuleCard";
import { SystemStatus } from "../components/SystemStatus";
import { DatabaseStatus } from "../components/DatabaseStatus";
import { GradientButton } from "../components/GradientButton";
import { motion } from "framer-motion";

const modules = [
  {
    id: "loan",
    title: "Loan Risk Prediction",
    description: "Predict approval probability, default risk, and key risk factors before applying.",
    icon: "🏦",
    gradient: "linear-gradient(135deg, #f04df4 0%, #8b82ff 100%)",
    path: "/loan-risk",
  },
  {
    id: "collateral",
    title: "Land Collateral Assessment",
    description: "Estimate property value, LTV ratio, and maximum eligible loan using land details.",
    icon: "🏠",
    gradient: "linear-gradient(135deg, #4f7cff 0%, #8b82ff 100%)",
    path: "/land-collateral",
  },
  {
    id: "expenses",
    title: "Monthly Expenditure Tracker",
    description: "Track income, spending categories, disposable income, and savings rate.",
    icon: "💳",
    gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    path: "/expenses",
  },
  {
    id: "savings",
    title: "Savings & Investment Planner",
    description: "Get personalized savings targets, emergency fund goals, and investment split.",
    icon: "💰",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    path: "/savings",
  },
  {
    id: "credit",
    title: "Credit Score Improvement",
    description: "Analyze debt, credit utilization, delayed payments, and get an improvement plan.",
    icon: "📈",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f04df4 100%)",
    path: "/credit-score",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/login");
  };
  
  const handleModuleClick = (path) => {
    navigate("/login", { state: { redirectTo: path } });
  };
  
  return (
    <div className="landing-page">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="landing-container"
      >
        {/* Top Navigation */}
        <header className="landing-nav">
          <div className="nav-left">
            <span className="logo">FinLoan360</span>
            <nav className="nav-links">
              <a href="#" className="nav-link">Overview</a>
              <a href="#" className="nav-link">Modules</a>
              <a href="#" className="nav-link">Insights</a>
              <a href="#" className="nav-link">Reports</a>
            </nav>
          </div>
          <div className="nav-right">
            <div className="user-avatar">U</div>
            <button
              className="gradient-btn primary md"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="landing-hero-section">
          <LandingHero onGetStarted={() => navigate("/login")} onModulesClick={() => {}} />
        </section>

        {/* Module Cards Section */}
        <section className="modules-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="modules-header"
          >
            <h2>Choose what you want to analyze today</h2>
          </motion.div>
          <div className="modules-grid">
            {modules.map((module, index) => (
              <motion.div key={module.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}>
                <ModuleCard
                  module={module}
                  onClick={() => navigate("/login", { state: { redirectTo: module.path } })}
                />
              </motion.div>
            ))}
          </div>
        </section>


        {/* System Status Section */}
        <section className="system-status-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff", marginBottom: "20px" }}>System Status</h3>
            <SystemStatus />
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>FinLoan360 gives educational estimates only. It does not guarantee loan approval or provide certified financial advice.</p>
        </footer>

        <DatabaseStatus />
      </motion.div>
    </div>
  );
}

export default LandingPage;