import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageShell from "./components/PageShell.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageShell maxWidth="520px"><div className="glass-card"><h1 className="auth-title">404</h1><p className="auth-subtitle">Page not found.</p></div></PageShell>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
