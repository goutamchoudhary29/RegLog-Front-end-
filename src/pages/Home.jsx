import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Mail, Phone, ShieldCheck, LogOut } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  }

  function formatDate(value) {
    if (!value) return "Not available";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  return (
    <PageShell>
      <Navbar
        user={user}
        onLogout={handleLogout}
      />
      <div className="glass-card hero">
        <p className="auth-subtitle" style={{ margin: 0 }}>Secure dashboard</p>
        <h1>Welcome, {user.fullName}</h1>
        <p>Your account is authenticated with an HttpOnly cookie-backed JWT session.</p>
        <div className="action-row">
          <button className="btn" style={{ width: "auto" }} onClick={() => navigate("/change-password")}>
            <ShieldCheck size={18} />
            Change password
          </button>
          <button className="btn btn-danger" style={{ width: "auto" }} onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <span className="spinner" /> : <LogOut size={18} />}
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 22 }}>
        <div className="glass-card profile-card">
          <h3>Profile summary</h3>
          <div className="profile-row">
            <div>
              <div className="profile-label">Full name</div>
              <div className="profile-value">{user.fullName}</div>
            </div>
          </div>
          <div className="profile-row">
            <div>
              <div className="profile-label">Email address</div>
              <div className="profile-value">
                <Mail size={14} /> {user.email}
              </div>
            </div>
          </div>
          <div className="profile-row">
            <div>
              <div className="profile-label">Mobile number</div>
              <div className="profile-value">
                <Phone size={14} /> {user.mobileNumber}
              </div>
            </div>
          </div>
          <div className="profile-row">
            <div>
              <div className="profile-label">Account created</div>
              <div className="profile-value">
                <Calendar size={14} /> {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card profile-card">
          <h3>Account actions</h3>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>Manage your credentials and active session.</p>
          <div className="form-grid">
            <button className="btn" onClick={() => navigate("/change-password")}>
              <ShieldCheck size={18} />
              Change password
            </button>
            <button className="btn btn-ghost" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? <span className="spinner" /> : <LogOut size={18} />}
              Logout
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
