import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import FormField from "../components/FormField.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { emailPattern, mobilePattern, passwordPattern } from "../utils/validators.js";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "", email: "", mobileNumber: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  function validate() {
    const next = {};
    if (!form.fullName || form.fullName.trim().length < 3) next.fullName = "Full name must be at least 3 characters";
    if (form.fullName.length > 100) next.fullName = "Full name is too long";
    if (!emailPattern.test(form.email)) next.email = "Enter a valid email address";
    if (!mobilePattern.test(form.mobileNumber)) next.mobileNumber = "Mobile number must be 10 digits";
    if (!passwordPattern.test(form.password)) next.password = "Use 8+ chars with uppercase, lowercase, number, and special character";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      navigate("/login", { state: { registered: true }, replace: true });
    } catch (error) {
      const data = error.response?.data;
      if (data?.fieldErrors) {
        setErrors(data.fieldErrors);
      } else {
        setMessage(data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="520px">
      <div className="auth-wrapper glass-card">
        <div className="auth-kicker">Secure registration</div>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Join a secure workspace with email or mobile login.</p>
        {message && <div className="alert error">{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <FormField label="Full name" name="fullName" value={form.fullName} onChange={update("fullName")} placeholder="Goutam Choudhary" error={errors.fullName} />
          <FormField label="Email address" name="email" value={form.email} onChange={update("email")} placeholder="you@example.com" error={errors.email} type="email" />
          <FormField label="Mobile number" name="mobileNumber" value={form.mobileNumber} onChange={update("mobileNumber")} placeholder="9876543210" error={errors.mobileNumber} type="tel" icon="mobile" />
          <PasswordInput label="Password" name="password" value={form.password} onChange={update("password")} placeholder="Create a strong password" error={errors.password} autoComplete="new-password" />
          <PasswordInput label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="Repeat your password" error={errors.confirmPassword} autoComplete="new-password" />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <UserPlus size={18} />}
            Create account
          </button>
        </form>
        <div className="link-row">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </PageShell>
  );
}
