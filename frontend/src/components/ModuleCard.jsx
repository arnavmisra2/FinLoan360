import React from "react";
import { motion } from "framer-motion";
import { GradientButton } from "./GradientButton";

export function ModuleCard({ module, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="module-card"
      style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%), ${module.gradient}`,
        border: "1px solid rgba(240, 77, 244, 0.15)",
      }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 20px 40px rgba(240,77,244,0.2)" }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="module-icon" style={{ background: module.gradient }}>
        <span style={{ fontSize: "28px" }}>{module.icon}</span>
      </div>
      <h3 className="module-title">{module.title}</h3>
      <p className="module-desc">{module.description}</p>
      <div className="module-footer">
        <GradientButton variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onClick(); }}>
          {module.id === "loan" ? "Start Prediction" :
           module.id === "collateral" ? "Assess Collateral" :
           module.id === "expenses" ? "Track Expenses" :
           module.id === "savings" ? "Plan Savings" : "Improve Score"}
        </GradientButton>
      </div>
    </motion.button>
  );
}