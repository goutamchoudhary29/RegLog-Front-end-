import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import FormField from "../components/FormField.jsx";
import { api } from "../api/client.js";
import { emailPattern } from "../utils/validators.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message || "If an account exists, an OTP has been sent.");
      setTimeout(() => navigate("/verify-otp", { state: { email } }), 900);
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="520px">
      <div className="auth-wrapper glass-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">Enter your registered email to receive a one-time password.</p>
        {message && <div className="alert success">{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <FormField label="Email address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" error={error} />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <Mail size={18} />}
            Send OTP
          </button>
        </form>
        <div className="link-row">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </PageShell>
  );
}
