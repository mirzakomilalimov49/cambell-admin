"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2, Phone, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = "yangi" | "aloqada" | "taklif" | "kelishildi" | "yopildi" | "yutqazildi";

interface Lead {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  amount: number;
  stage: Stage;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const STAGES: { key: Stage; label: string; accent: string }[] = [
  { key: "yangi", label: "Yangi", accent: "#0EA5E9" },
  { key: "aloqada", label: "Aloqada", accent: "#8B5CF6" },
  { key: "taklif", label: "Taklif yuborildi", accent: "#F59E0B" },
  { key: "kelishildi", label: "Kelishildi", accent: "#6366F1" },
  { key: "yopildi", label: "Yopildi", accent: "#22C55E" },
  { key: "yutqazildi", label: "Yutqazildi", accent: "#EF4444" },
];

type FormState = Omit<Lead, "id" | "createdAt" | "updatedAt">;
const EMPTY_FORM: FormState = { title: "", customerName: "", phone: "", amount: 0, stage: "yangi", source: "", notes: "" };

function formatSum(n: number) {
  return n.toLocaleString("uz-UZ");
}

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads");
      const data = await res.json();
      setLeads(Array.isArray(data?.leads) ? data.leads : []);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew(stage: Stage = "yangi") {
    setEditing(null);
    setForm({ ...EMPTY_FORM, stage });
    setError(null);
    setShowModal(true);
  }

  function openEdit(l: Lead) {
    setEditing(l);
    setForm({ title: l.title, customerName: l.customerName, phone: l.phone, amount: l.amount, stage: l.stage, source: l.source, notes: l.notes });
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = editing ? `/api/crm/leads/${editing.id}` : "/api/crm/leads";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Xatolik yuz berdi");
      } else {
        setShowModal(false);
        load();
      }
    } catch {
      setError("Serverga ulanib bo'lmadi");
    } finally {
      setSaving(false);
    }
  }

  async function moveStage(lead: Lead, stage: Stage) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage } : l)));
    await fetch(`/api/crm/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/crm/leads/${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setConfirmingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">Bosqichni o'zgartirish uchun kartadagi tanlovdan foydalaning</p>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi lead
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-14">Yuklanmoqda...</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {STAGES.map((s) => {
            const items = leads.filter((l) => l.stage === s.key);
            return (
              <div key={s.key} className="w-64 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.accent }} />
                  <span className="text-xs font-bold text-gray-700">{s.label}</span>
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">{items.length}</span>
                </div>

                <div className="space-y-2 min-h-[60px]">
                  {items.map((l) => (
                    <motion.div
                      key={l.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-100 rounded-xl p-3 shadow-card group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-gray-800 leading-snug">{l.title}</p>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => openEdit(l)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9]">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => setConfirmingId(l.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#EF4444]">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{l.customerName}</p>
                      {l.phone && (
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> {l.phone}</p>
                      )}
                      {l.amount > 0 && (
                        <p className="text-[11px] font-semibold text-gray-700 mt-1 flex items-center gap-1"><Wallet className="w-3 h-3 text-[#0EA5E9]" /> {formatSum(l.amount)} so'm</p>
                      )}

                      {confirmingId === l.id ? (
                        <div className="flex items-center gap-1.5 mt-2">
                          <button onClick={() => handleDelete(l.id)} className="flex-1 h-6 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white text-[10px] font-semibold">O'chirish</button>
                          <button onClick={() => setConfirmingId(null)} className="flex-1 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-semibold">Bekor</button>
                        </div>
                      ) : (
                        <select
                          value={l.stage}
                          onChange={(e) => moveStage(l, e.target.value as Stage)}
                          className="w-full mt-2 h-7 px-2 text-[10px] font-semibold rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#0EA5E9] cursor-pointer"
                        >
                          {STAGES.map((st) => <option key={st.key} value={st.key}>{st.label}</option>)}
                        </select>
                      )}
                    </motion.div>
                  ))}

                  {items.length === 0 && (
                    <button
                      onClick={() => openNew(s.key)}
                      className="w-full h-16 rounded-xl border border-dashed border-gray-200 text-gray-300 hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-xs transition-colors"
                    >
                      + Lead qo'shish
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">{editing ? "Leadni tahrirlash" : "Yangi lead"}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Sarlavha *</label>
                  <input
                    value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required
                    placeholder="Masalan: 3 ta elektr avtobus"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mijoz nomi *</label>
                    <input
                      value={form.customerName} onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))} required
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Telefon</label>
                    <input
                      value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Summa (so'm)</label>
                    <input
                      type="number" min={0} value={form.amount || ""}
                      onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Bosqich</label>
                    <select
                      value={form.stage} onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value as Stage }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] bg-white"
                    >
                      {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Manba</label>
                  <input
                    value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                    placeholder="Masalan: Telegram, qo'ng'iroq, sayt"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Izoh</label>
                  <textarea
                    value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="px-3 py-2.5 rounded-xl text-xs font-medium bg-red-50 text-[#EF4444]">{error}</div>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                    Bekor qilish
                  </button>
                  <button type="submit" disabled={saving}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm",
                      saving ? "bg-gray-300 cursor-not-allowed" : "bg-[#0EA5E9] hover:bg-[#0284C7]"
                    )}>
                    {saving ? "Saqlanmoqda..." : "Saqlash"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
