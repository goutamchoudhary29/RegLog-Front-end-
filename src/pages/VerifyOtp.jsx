import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import FormField from "../components/FormField.jsx";
import { api } from "../api/client.js";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const devOtp = location.state?.devOtp || "";
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(devOtp);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email || !/^\d{6}$/.test(otp)) {
      setError("Enter a valid email and 6-digit OTP");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      navigate("/reset-password", { state: { resetToken: data.resetToken }, replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="520px">
      <div className="auth-wrapper glass-card">
        <h1 className="auth-title">Verify OTP</h1>
        <p className="auth-subtitle">Enter the code sent to your email address.</p>
        {devOtp && (
          <div className="alert success" style={{ marginBottom: 12 }}>
            Your OTP is: <strong>{devOtp}</strong>
          </div>
        )}
        {message && <div className="alert error">{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <FormField label="Email address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <FormField label="One-time password" name="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" error={error} type="text" />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <KeyRound size={18} />}
            Verify OTP
          </button>
        </form>
        <div className="link-row">
          <Link to="/forgot-password">Resend or change email</Link>
        </div>
      </div>
    </PageShell>
  );
}
