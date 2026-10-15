import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for browser Back navigation
    const handlePopState = async () => {
      // Invalidate session immediately when user clicks browser back button
      await logout();
      navigate("/login", {
        replace: true,
        state: { message: "Session expired because back button was clicked. Enter your username and password to log in." }
      });
    };

    // Ensure there is a history entry so popstate triggers on back
    window.history.pushState({ protected: true }, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Also handle bfcache restore
    const handlePageShow = (event) => {
      if (event.persisted) {
        logout().finally(() => {
          navigate("/login", {
            replace: true,
            state: { message: "Session expired. Enter your username and password to log in." }
          });
        });
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [logout, navigate]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="glass-card" style={{ textAlign: "center" }}>
          <span className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Session expired or authentication required. Enter your username and password to log in." }}
      />
    );
  }

  return children;
}
