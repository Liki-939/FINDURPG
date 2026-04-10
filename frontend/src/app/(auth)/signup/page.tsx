"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Building, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/signup/", formData);
      localStorage.setItem("access_token", res.data.tokens.access);
      localStorage.setItem("refresh_token", res.data.tokens.refresh);
      localStorage.setItem("role", formData.role);
      
      window.location.href = formData.role === "VENDOR" ? "/vendor" : "/";
    } catch (err: any) {
      if (err.response?.data?.errors) {
        // format django errors
        const errs = Object.values(err.response.data.errors).flat().join(" ");
        setError(errs);
      } else {
        setError("Failed to verify registration. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 sm:p-10 rounded-[2rem] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-muted">Join FINDURPG to find or list properties</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <label 
                className={`cursor-pointer rounded-xl border flex flex-col items-center justify-center p-4 transition-all ${
                  formData.role === "USER" 
                    ? "border-primary bg-primary/10 text-white" 
                    : "border-border bg-surface text-muted hover:bg-surface-hover"
                }`}
                onClick={() => setFormData({...formData, role: "USER"})}
              >
                <User className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Looking to rent</span>
              </label>
              <label 
                className={`cursor-pointer rounded-xl border flex flex-col items-center justify-center p-4 transition-all ${
                  formData.role === "VENDOR" 
                    ? "border-accent bg-accent/10 text-white" 
                    : "border-border bg-surface text-muted hover:bg-surface-hover"
                }`}
                onClick={() => setFormData({...formData, role: "VENDOR"})}
              >
                <Building className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">List a property</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-white placeholder-muted/60"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-white placeholder-muted/60"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-white placeholder-muted/60"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(109,40,217,0.3)] text-sm font-medium text-white bg-primary hover:bg-primary-hover hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-white hover:text-primary transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
