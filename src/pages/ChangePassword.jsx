import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { api } from "../api/client.js";
import { passwordPattern } from "../utils/validators.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!currentPassword) next.currentPassword = "Current password is required";
    if (!passwordPattern.test(newPassword)) next.newPassword = "Use 8+ chars with uppercase, lowercase, number, and special character";
    if (newPassword !== confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.put("/auth/change-password", { currentPassword, newPassword, confirmPassword });
      await logout();
      navigate("/login", { state: { message: data.message || "Password changed successfully. Please log in again." }, replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to change password");
      if (err.response?.status === 401) {
        await logout();
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="520px">
      <div className="auth-wrapper glass-card">
        <h1 className="auth-title">Change Password</h1>
        <p className="auth-subtitle">Verify your current password before setting a new one.</p>
        {message && <div className="alert error">{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <PasswordInput label="Current password" name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" error={errors.currentPassword} autoComplete="current-password" />
          <PasswordInput label="New password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New strong password" error={errors.newPassword} autoComplete="new-password" />
          <PasswordInput label="Confirm new password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" error={errors.confirmPassword} autoComplete="new-password" />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <KeyRound size={18} />}
            Update password
          </button>
        </form>
      </div>
    </PageShell>
  );
}
