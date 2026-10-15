import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import FormField from "../components/FormField.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(
    location.state?.message || (location.state?.registered ? "Registration successful. Please log in." : "")
  );
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state?.message]);

  React.useEffect(() => {
    // Prevent back navigation to previous authenticated views
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!identifier) next.identifier = "Email or mobile number is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    if (Object.keys(next).length) return;
    setMessage("");
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate("/home", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell maxWidth="520px">
      <div className="auth-wrapper glass-card">
        <div className="auth-kicker">Secure sign in</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in with your registered email or mobile number.</p>
        {message && <div className={`alert ${location.state?.registered ? "success" : "error"}`}>{message}</div>}
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <FormField label="Email or mobile number" name="identifier" icon="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com or 9876543210" error={errors.identifier} />
          <PasswordInput label="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" error={errors.password} autoComplete="current-password" />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : <LogIn size={18} />}
            Sign in
          </button>
        </form>
        <div className="link-row">
          <Link to="/forgot-password">Forgot Password?</Link>
          {" · "}
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </PageShell>
  );
}
