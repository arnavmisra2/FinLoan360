import React from "react";
import { motion } from "framer-motion";
import { GradientButton } from "./GradientButton";

export function LandingHero({ onGetStarted }) {
  return (
    <section className="landing-hero">
      <div className="hero-background" />
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-text"
        >
          <span className="hero-badge">AI Financial Risk Analysis Platform</span>
          <h1 className="hero-title">
            Know Your Financial Risk
            <br />
            <span className="gradient-text">Before You Commit</span>
          </h1>
          <p className="hero-subtitle">
            Get AI-powered loan risk predictions, collateral valuations, expense tracking,
            savings planning, and credit score improvement—all in one premium dashboard.
          </p>
          <div className="hero-actions">
            <GradientButton size="lg" variant="primary" onClick={onGetStarted}>
              Get Started Free
            </GradientButton>
            <GradientButton size="lg" variant="outline" onClick={() => window.location.href = "#modules"}>
              Explore Modules
            </GradientButton>
          </div>
          <div className="hero-trust">
            <span className="trust-label">Trusted by financial professionals</span>
            <div className="trust-badges">
              <span className="badge">🔒 Bank-grade security</span>
              <span className="badge">📊 ML-powered insights</span>
              <span className="badge">⚡ Real-time analysis</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="hero-visual"
        >
          <div className="hero-dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-card risk-card">
                <div className="preview-card-header">
                  <span className="preview-icon">🏦</span>
                  <span className="preview-title">Loan Risk</span>
                  <span className="preview-badge low">Low Risk</span>
                </div>
                <div className="preview-metric">
                  <span className="preview-value">94%</span>
                  <span className="preview-label">Approval Probability</span>
                </div>
                <div className="preview-bar">
                  <div className="preview-fill success" style={{ width: "94%" }} />
                </div>
              </div>
              <div className="preview-card collateral-card">
                <div className="preview-card-header">
                  <span className="preview-icon">🏠</span>
                  <span className="preview-title">Collateral</span>
                  <span className="preview-badge safe">Safe</span>
                </div>
                <div className="preview-metric">
                  <span className="preview-value">$875K</span>
                  <span className="preview-label">Max Eligible</span>
                </div>
                <div className="preview-bar">
                  <div className="preview-fill info" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="preview-card savings-card">
                <div className="preview-card-header">
                  <span className="preview-icon">💰</span>
                  <span className="preview-title">Savings Plan</span>
                  <span className="preview-badge active">Active</span>
                </div>
                <div className="preview-metric">
                  <span className="preview-value">24.5%</span>
                  <span className="preview-label">Savings Rate</span>
                </div>
                <div className="preview-bar">
                  <div className="preview-fill warning" style={{ width: "65%" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}