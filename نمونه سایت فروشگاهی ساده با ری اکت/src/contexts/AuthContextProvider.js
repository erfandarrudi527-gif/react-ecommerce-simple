import React, { createContext, useContext, useEffect, useState } from "react";
import http from "../services/http";

const TOKEN_KEY = "auth" + "Token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // validate saved token on mount — one login stays valid across sessions
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    http
      .get("/auth/me", { headers: { Authorization: "Bearer " + saved } })
      .then((res) => {
        setUser(res.data.user);
        setToken(saved);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyAuth = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (username, password) => {
    const res = await http.post("/auth/login", { username, password });
    return applyAuth(res.data);
  };

  const register = async (username, password, name) => {
    const res = await http.post("/auth/register", { username, password, name });
    return applyAuth(res.data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
