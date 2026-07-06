"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Send, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

type Status = { type: "success" | "error"; message: string } | null;

export default function YangiliklarPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const canSend = title.trim().length > 0 && body.trim().length > 0 && !sending;

  async function handleSend() {
    if (!canSend) return;
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "Xatolik yuz berdi" });
      } else {
        setStatus({ type: "success", message: "Yangilik cambell.uz saytiga muvaffaqiyatli yuborildi." });
        setTitle("");
        setBody("");
      }
    } catch {
      setStatus({ type: "error", message: "Serverga ulanib bo'lmadi. Internetni tekshiring." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] rounded-xl flex items-center justify-center flex-shrink-0">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Yangiliklar</h1>
                <p className="text-xs text-gray-400">
                  Bu yerda yozilgan yangilik{" "}
                  <a
                    href="https://cambell.uz/news.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0EA5E9] hover:underline inline-flex items-center gap-0.5"
                  >
                    cambell.uz saytining Yangiliklar sahifasida <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  chiqadi
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sarlavha</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Yangilik sarlavhasini kiriting..."
                  maxLength={300}
                  className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white text-gray-800"
                />
              </div>

              <div className="mb-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Matn</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Yangilik matnini yozing..."
                  rows={8}
                  maxLength={20000}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white text-gray-800 resize-none"
                />
                <p className="text-[11px] text-gray-400 mt-1 text-right">{body.length}/20000</p>
              </div>

              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium mb-3",
                      status.type === "success" ? "bg-green-50 text-[#22C55E]" : "bg-red-50 text-[#EF4444]"
                    )}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    )}
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={cn(
                    "flex items-center gap-2 px-5 h-9 rounded-xl text-sm font-semibold transition-colors shadow-sm",
                    canSend
                      ? "bg-[#0EA5E9] hover:bg-sky-600 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
