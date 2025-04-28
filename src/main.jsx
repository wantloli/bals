import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import './assets/fonts/font.css';
import { CustomerPage } from "./pages/CustomerPage.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { NotFoundPage } from "./error/NotFoundPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CustomerProvider } from "./contexts/CustomerContext";
import Transaction from "./pages/Transaction.jsx";
import { TransactionProvider } from "./contexts/TransactionContext";
import Employee from "./pages/Employee.jsx";
import OperationalExpenses from "./pages/OperationalExpenses.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CustomerProvider>
          <TransactionProvider>
            <Routes>
              <Route index element={<App />} />
              <Route
                path="/customer"
                element={
                  <ProtectedRoute>
                    <CustomerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction"
                element={
                  <ProtectedRoute>
                    <Transaction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operation/employee-salaries"
                element={
                  <ProtectedRoute>
                    <Employee />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/operation/operational-expenses"
                element={
                  <ProtectedRoute>
                    <OperationalExpenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </TransactionProvider>
        </CustomerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
