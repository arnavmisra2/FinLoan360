import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar
        activePage={location.pathname}
        setActivePage={() => {}}
        collapsed={false}
        setCollapsed={() => {}}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;