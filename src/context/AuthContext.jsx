import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, clearCsrfToken, ensureCsrfToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get("/users/me");
        if (active) setUser(data);
      } catch (error) {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const login = useCallback(async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    clearCsrfToken();
    try { await ensureCsrfToken(); } catch (error) {}
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearCsrfToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    fetchMe,
    login,
    register,
    logout,
    setUser,
  }), [user, loading, fetchMe, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
