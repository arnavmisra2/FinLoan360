import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DatabaseStatus } from "./DatabaseStatus";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/loan-risk", label: "Loan Risk", icon: "🏦" },
  { path: "/land-collateral", label: "Land Collateral", icon: "🏠" },
  { path: "/expenses", label: "Expense Tracker", icon: "💳" },
  { path: "/savings", label: "Savings & Investment", icon: "💰" },
  { path: "/credit-score", label: "Credit Score", icon: "📈" },
  { path: "/history", label: "History", icon: "📋" },
];

export function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activePage={location.pathname}
        setActivePage={() => {}}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <main className="main-content">
        {children}
      </main>
      <DatabaseStatus />
    </div>
  );
}

export default Layout;