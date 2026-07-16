import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { registerOrLogin } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signup");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }
    setLoading(true);
try {
        await registerOrLogin(name.trim(), email.trim());
        navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          width: "1400px",
          maxWidth: "95vw",
          height: "850px",
          maxHeight: "95vh",
          background: "#0B0B0B",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          display: "flex",
          fontFamily: "'Inter', 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* LEFT PANEL - Branding (55%) */}
        <motion.div
          className="auth-left"
          variants={itemVariants}
          style={{
            flex: "0 0 55%",
            position: "relative",
            background: "linear-gradient(145deg, #0F0F12 0%, #1A171F 50%, #121018 100%)",
            display: "flex",
            flexDirection: "column",
            padding: "60px 50px",
            overflow: "hidden",
          }}
        >
          {/* Abstract background glow */}
          <div
            className="bg-glow"
            style={{
              position: "absolute",
              inset: 0,
              background: `
                radial-gradient(ellipse 80% 60% at 20% 20%, rgba(165, 106, 245, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse 60% 80% at 80% 80%, rgba(246, 234, 149, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse 100% 100% at 50% 50%, rgba(26, 23, 31, 1) 0%, rgba(11, 11, 11, 1) 100%)
              `,
              pointerEvents: "none",
            }}
          />

{/* Grid of Cards */}
          <div
            className="brand-grid"
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Card 1 - Yellow Accent */}
            <motion.div
              className="brand-card yellow-card"
              variants={itemVariants}
              style={{
                background: "#F6EA95",
                borderRadius: "28px",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span className="plus-icon" style={{ fontSize: "26px", fontWeight: 300, color: "#1C1C1C", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
              <div>
                <h2 style={{ fontSize: "30px", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.2, margin: "0 0 12px 0" }}>
                  Know your loan risk before you apply
                </h2>
                <p style={{ fontSize: "15px", fontWeight: 400, color: "#4A4A4A", lineHeight: 1.5, margin: 0 }}>
                  Get AI-powered approval probability, default risk, and personalized risk factors.
                </p>
              </div>
            </motion.div>

            {/* Card 2 - Purple Accent */}
            <motion.div
              className="brand-card purple-card"
              variants={itemVariants}
              style={{
                background: "#A56AF5",
                borderRadius: "28px",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="dot-pattern"
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  width: "40px",
                  height: "40px",
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)",
                  backgroundSize: "10px 10px",
                  opacity: 0.5,
                }}
              />
              <div style={{ maxWidth: "280px" }}>
                <h2 style={{ fontSize: "30px", fontWeight: 600, color: "#1C1C1C", lineHeight: 1.25, margin: "0 0 12px 0" }}>
                  Own your financial future today
                </h2>
                <p style={{ fontSize: "15px", fontWeight: 400, color: "rgba(28,28,28,0.8)", lineHeight: 1.5, margin: 0 }}>
                  Track expenses, improve credit health, and plan smarter savings in one dashboard.
                </p>
              </div>
            </motion.div>

            {/* Card 3 - Dark Glass Blur */}
            <motion.div
              className="brand-card glass-card"
              variants={itemVariants}
              style={{
                background: "rgba(65, 68, 95, 0.45)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "28px",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                textAlign: "left",
              }}
            >
              <h3 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, margin: "0 0 8px 0", letterSpacing: "-0.3px" }}>
                Loan Risk Prediction
              </h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                Analyze income, loan amount, credit history, and employment details to estimate risk.
              </p>
            </motion.div>

            {/* Card 4 - Dark Glass Blur */}
            <motion.div
              className="brand-card glass-card"
              variants={itemVariants}
              style={{
                background: "rgba(65, 68, 95, 0.45)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "28px",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                textAlign: "left",
              }}
            >
              <h3 style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: 600, margin: "0 0 8px 0", letterSpacing: "-0.3px" }}>
                Credit Score Improvement
              </h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 400, lineHeight: 1.5, margin: 0 }}>
                Find what affects your score and get a practical action plan to improve it.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT PANEL - Auth Form (45%) */}
        <motion.div
          className="auth-right"
          variants={itemVariants}
          style={{
            flex: "0 0 45%",
            background: "#090909",
            padding: "60px 50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <motion.div
              className="form-header"
              variants={itemVariants}
              style={{ textAlign: "center", marginBottom: "8px" }}
            >
              <h1 style={{ fontSize: "52px", fontWeight: 500, color: "#FFFFFF", letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
                {activeTab === "signup" ? "Sign Up" : "Welcome Back"}
              </h1>
              <p style={{ fontSize: "16px", color: "#6F6F6F", marginTop: "8px", fontWeight: 400 }}>
                {activeTab === "signup"
                  ? "Create your account to get started"
                  : "Sign in to access your dashboard"}
              </p>
            </motion.div>

            {/* Tab Switcher */}
            <motion.div
              className="tab-switcher"
              variants={itemVariants}
              style={{
                display: "flex",
                gap: "8px",
                background: "#181818",
                borderRadius: "12px",
                padding: "4px",
                marginBottom: "32px",
                width: "280px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {["signup", "login"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: activeTab === tab ? "#FFFFFF" : "transparent",
                    color: activeTab === tab ? "#090909" : "#6F6F6F",
                  }}
                >
                  {tab === "signup" ? "Sign Up" : "Sign In"}
                </button>
              ))}
            </motion.div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: "rgba(220, 38, 38, 0.15)",
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    color: "#FCA5A5",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 500,
                  }}
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Name Field */}
              <motion.div className="input-wrapper" variants={itemVariants}>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#666666",
                    marginBottom: "8px",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required={activeTab === "signup"}
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "56px",
                    background: "#0E0E0E",
                    border: "1px solid #252525",
                    borderRadius: "14px",
                    padding: "0 20px",
                    fontSize: "16px",
                    color: "#FFFFFF",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#A56AF5";
                    e.target.style.boxShadow = "0 0 0 4px rgba(165, 106, 245, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#252525";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div className="input-wrapper" variants={itemVariants}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    color: "#666666",
                    marginBottom: "8px",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "56px",
                    background: "#0E0E0E",
                    border: "1px solid #252525",
                    borderRadius: "14px",
                    padding: "0 20px",
                    fontSize: "16px",
                    color: "#FFFFFF",
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#A56AF5";
                    e.target.style.boxShadow = "0 0 0 4px rgba(165, 106, 245, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#252525";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                className="submit-btn"
                type="submit"
                disabled={loading}
                variants={itemVariants}
                style={{
                  width: "100%",
                  height: "58px",
                  background: "#FFFFFF",
                  color: "#090909",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  marginTop: "8px",
                  opacity: loading ? 0.7 : 1,
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid transparent",
                        borderTopColor: "#090909",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Please wait...
                  </span>
                ) : activeTab === "signup" ? "Create Account" : "Sign In"}
              </motion.button>
            </form>

            {/* OR Divider */}
            <motion.div
              className="divider"
              variants={itemVariants}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "28px",
                marginBottom: "24px",
                color: "#666666",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#252525" }} />
              <span style={{ whiteSpace: "nowrap", color: "#666666" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#252525" }} />
            </motion.div>

            {/* Social Buttons */}
            <motion.div
              className="social-buttons"
              variants={itemVariants}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  height: "48px",
                  background: "#181818",
                  border: "1px solid #252525",
                  borderRadius: "14px",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#1F1F1F";
                  e.target.style.borderColor = "#333333";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#181818";
                  e.target.style.borderColor = "#252525";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("Facebook")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  height: "48px",
                  background: "#181818",
                  border: "1px solid #252525",
                  borderRadius: "14px",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#1F1F1F";
                  e.target.style.borderColor = "#333333";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#181818";
                  e.target.style.borderColor = "#252525";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.046V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}