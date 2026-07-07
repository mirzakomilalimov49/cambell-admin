"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper, Send, CheckCircle2, AlertTriangle, ExternalLink,
  ImagePlus, X, Trash2, Calendar, Eye,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

type Status = { type: "success" | "error"; message: string } | null;

interface Article {
  id: string;
  date: string;
  views: string;
  image: string;
  uz?: { title: string };
  en?: { title: string };
}

export default function YangiliklarPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canSend = title.trim().length > 0 && body.trim().length > 0 && !sending;

  async function loadArticles() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setArticles(Array.isArray(data?.articles) ? data.articles : []);
    } catch {
      setArticles([]);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setStatus({ type: "error", message: "Rasm hajmi 5MB dan katta bo'lmasligi kerak" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(String(reader.result));
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageData(null);
    setImageName(null);
  }

  async function handleSend() {
    if (!canSend) return;
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), image: imageData || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "Xatolik yuz berdi" });
      } else {
        setStatus({ type: "success", message: "Yangilik cambell.uz saytiga muvaffaqiyatli yuborildi." });
        setTitle("");
        setBody("");
        removeImage();
        loadArticles();
      }
    } catch {
      setStatus({ type: "error", message: "Serverga ulanib bo'lmadi. Internetni tekshiring." });
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/news/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "O'chirishda xatolik yuz berdi" });
      } else {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      setStatus({ type: "error", message: "Serverga ulanib bo'lmadi. Internetni tekshiring." });
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
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
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
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

              <div className="mb-4">
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

              <div className="mb-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Rasm (ixtiyoriy)</label>
                {imageData ? (
                  <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-xl">
                    <img src={imageData} alt="Tanlangan rasm" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate flex-1">{imageName}</span>
                    <button
                      onClick={removeImage}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 h-10 rounded-xl border border-dashed border-gray-300 text-xs font-medium text-gray-500 hover:border-[#0EA5E9] hover:text-[#0EA5E9] cursor-pointer transition-colors w-fit">
                    <ImagePlus className="w-4 h-4" />
                    Rasm tanlash
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImagePick} className="hidden" />
                  </label>
                )}
              </div>

              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium mb-3 mt-3",
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

              <div className="flex justify-end mt-3">
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

            {/* Existing news list */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-3">Mavjud yangiliklar</p>

              {loadingList ? (
                <p className="text-xs text-gray-400 py-4 text-center">Yuklanmoqda...</p>
              ) : articles.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">Hozircha yangiliklar yo'q</p>
              ) : (
                <div className="space-y-1">
                  {articles.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <img
                        src={a.image}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {a.uz?.title || a.en?.title || "(sarlavhasiz)"}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.date}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {a.views}</span>
                        </div>
                      </div>

                      {confirmingId === a.id ? (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleDelete(a.id)}
                            disabled={deletingId === a.id}
                            className="px-2.5 h-7 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white text-[11px] font-semibold transition-colors"
                          >
                            {deletingId === a.id ? "..." : "Ha, o'chirish"}
                          </button>
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="px-2.5 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-semibold transition-colors"
                          >
                            Bekor
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmingId(a.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#EF4444] transition-colors flex-shrink-0"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
