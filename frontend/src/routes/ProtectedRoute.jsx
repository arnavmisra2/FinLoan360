import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("finloan_auth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}