import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { api } from "../api/client.js";
import { passwordPattern } from "../utils/validators.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!passwordPattern.test(newPassword)) next.newPassword = "Use 8+ chars with uppercase, lowercase, number, and special character";
    if (newPassword !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length || !resetToken) return;
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { resetToken, newPassword, confirmPassword });
      navigate("/login", { state: { registered: false, message: data.message || "Password reset successful. Please log in." }, replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="520px">
      <div className="auth-wrapper glass-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Choose a new password for your account.</p>
        {!resetToken && <div className="alert error">Reset token is missing. Please verify your OTP again.</div>}
        {message && <div className="alert error">{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <PasswordInput label="New password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a strong password" error={errors.newPassword} autoComplete="new-password" />
          <PasswordInput label="Confirm new password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" error={errors.confirmPassword} autoComplete="new-password" />
          <button className="btn" type="submit" disabled={loading || !resetToken}>
            {loading ? <span className="spinner" /> : <ShieldCheck size={18} />}
            Reset password
          </button>
        </form>
        <div className="link-row">
          <Link to="/forgot-password">Start over</Link>
        </div>
      </div>
    </PageShell>
  );
}
