"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        router.push(redirectPath);
        router.refresh();
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Invalid admin password. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              A to Z <span className="text-amber-400">Academic</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Admin Portal Access
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your administrative password to access the management dashboard.
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="block w-full pl-11 pr-11 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !password}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              ← Return to public website
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Protected route with HTTP-only cookie authentication and Next.js middleware.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
