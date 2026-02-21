"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/Authcontext";

export default function AuthPage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  if (!auth) return null;

  const { login, user, loading } = auth;

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/Dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      setIsProcessing(true);
      await login({
        username: form.username,
        password: form.password,
      });
    } catch {
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Welcome Back
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-white/60 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                placeholder="username"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Redirect to Register */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?
              <button
                onClick={() => router.push("/register")}
                className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
}