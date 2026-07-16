import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import LoanRisk from "./pages/LoanRisk";
import LandCollateral from "./pages/LandCollateral";
import ExpenseTracker from "./pages/ExpenseTracker";
import SavingsInvestment from "./pages/SavingsInvestment";
import CreditScore from "./pages/CreditScore";
import History from "./pages/History";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loan-risk"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LoanRisk />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/land-collateral"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LandCollateral />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExpenseTracker />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/savings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SavingsInvestment />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/credit-score"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreditScore />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <History />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}