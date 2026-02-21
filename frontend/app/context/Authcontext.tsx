"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

type User = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check auth only once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("me/");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: { username: string; password: string }) => {
    await api.post("login/", data);
    const res = await api.get("me/");
    setUser(res.data);
    router.replace("/Dashboard"); // replace avoids history stacking
  };

  const logout = async () => {
    try {
      await api.post("logout/");
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};