"use client";

import { useState } from "react";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [error, setError] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    setError(null);

    if (!form.username || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("register/", form);
      console.log("SUCCESS:", res.data);
      router.push("/login");
    } catch (err: any) {
      console.log("BACKEND ERROR:", err.response?.data);
      // Stores the error object from backend (e.g., { username: ["Already exists"] })
      setError(err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h1>
        </div>

        {/* Register Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
              <input
                className={`w-full px-4 py-3 bg-slate-50 border ${error?.username ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                placeholder="johndoe"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              {error?.username && <p className="text-red-500 text-xs mt-1 ml-1">{error.username[0]}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-slate-50 border ${error?.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                placeholder="john@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {error?.email && <p className="text-red-500 text-xs mt-1 ml-1">{error.email[0]}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 bg-slate-50 border ${error?.password ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {error?.password && <p className="text-red-500 text-xs mt-1 ml-1">{error.password[0]}</p>}
              {error?.non_field_errors && <p className="text-red-500 text-xs mt-1 ml-1">{error.non_field_errors[0]}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account? 
              <Link href="/login" className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>

       
      </div>
    </div>
  );
}