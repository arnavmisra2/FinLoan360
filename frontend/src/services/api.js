import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const createUser = (data) => api.post("/api/users", data);
export const getUser = (id) => api.get(`/api/users/${id}`);

export const predictLoan = (data) => api.post("/api/loan/predict", data);
export const getLoanHistory = (userId) => api.get(`/api/loan/history/${userId}`);

export const assessCollateral = (data) => api.post("/api/collateral/assess", data);
export const getPropertyRates = (params) => api.get("/api/collateral/property-rates", { params });

export const addIncome = (data) => api.post("/api/income", data);
export const addExpense = (data) => api.post("/api/expenses", data);
export const getExpenses = (userId, month) => api.get(`/api/expenses/${userId}/${month}`);
export const deleteExpense = (id) => api.delete(`/api/expenses/${id}`);
export const getSummary = (userId, month) => api.get(`/api/summary/${userId}/${month}`);

export const recommendSavings = (data) => api.post("/api/savings/recommend", data);

export const analyzeCreditScore = (data) => api.post("/api/credit-score/analyze", data);
export const getCreditScoreHistory = (userId) => api.get(`/api/credit-score/history/${userId}`);

export const healthCheck = () => api.get("/api/health");

export default api;
