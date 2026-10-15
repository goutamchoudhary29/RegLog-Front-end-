import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-badge">R</span>
        <span>RegLog Secure</span>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">Hello, {user.fullName}</span>
            <Link className="btn btn-ghost icon-btn" to="/change-password" aria-label="Change password">
              <ShieldCheck size={18} />
            </Link>
            <button className="btn btn-danger" style={{ width: "auto" }} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" style={{ width: "auto" }} to="/login">Sign in</Link>
            <Link className="btn" style={{ width: "auto" }} to="/register">Create account</Link>
          </>
        )}
      </div>
    </nav>
  );
}
