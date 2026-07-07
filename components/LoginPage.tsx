"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bus, User, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Login yoki parol noto'g'ri");
        return;
      }

      const next = params.get("next") || "/";
      router.push(next);
      router.refresh();
    } catch {
      setError("Serverga ulanib bo'lmadi. Internetni tekshiring.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#0EA5E9] rounded-2xl flex items-center justify-center mb-3">
            <Bus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">BUSPLANT</h1>
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">SMART FACTORY</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Tizimga kirish</h2>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Login</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Login"
                autoFocus
                autoComplete="username"
                className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white text-gray-800"
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Parol</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parol"
                autoComplete="current-password"
                className="w-full h-10 pl-9 pr-9 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium bg-red-50 text-[#EF4444] mt-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!username || !password || loading}
            className="w-full h-10 mt-4 rounded-xl text-sm font-semibold bg-[#0EA5E9] hover:bg-sky-600 disabled:bg-gray-100 disabled:text-gray-400 text-white transition-colors"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
