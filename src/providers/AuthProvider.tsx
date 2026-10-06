"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User } from "@/interface";
import * as api from "@/libs/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: api.RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "nm_token";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (t: string) => {
    try {
      const res = await api.getMe(t);
      setUser(res.data);
      setToken(t);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    Promise.resolve(stored ? api.getMe(stored) : null)
      .then((res) => {
        if (res && stored) {
          setUser(res.data);
          setToken(stored);
        }
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem(TOKEN_KEY, res.data.token);
    await loadUser(res.data.token);
  };

  const register = async (input: api.RegisterInput) => {
    const res = await api.register(input);
    localStorage.setItem(TOKEN_KEY, res.data.token);
    await loadUser(res.data.token);
  };

  const logout = async () => {
    if (token) await api.logout(token).catch(() => undefined);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
