"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ContractStatus = "loyiha" | "imzolangan" | "bajarilmoqda" | "yakunlangan" | "bekor_qilingan";

interface Contract {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  status: ContractStatus;
  date: string;
  notes: string;
  createdAt: string;
}

const STATUS_META: Record<ContractStatus, { label: string; color: string; bg: string; dot: string }> = {
  loyiha:          { label: "Loyiha",         color: "text-gray-500",   bg: "bg-gray-100",  dot: "bg-gray-400" },
  imzolangan:      { label: "Imzolangan",     color: "text-[#0EA5E9]",  bg: "bg-sky-50",    dot: "bg-[#0EA5E9]" },
  bajarilmoqda:    { label: "Bajarilmoqda",   color: "text-[#F59E0B]",  bg: "bg-amber-50",  dot: "bg-[#F59E0B]" },
  yakunlangan:     { label: "Yakunlangan",    color: "text-[#22C55E]",  bg: "bg-green-50",  dot: "bg-[#22C55E]" },
  bekor_qilingan:  { label: "Bekor qilingan", color: "text-[#EF4444]",  bg: "bg-red-50",    dot: "bg-[#EF4444]" },
};

type FormState = Omit<Contract, "id" | "createdAt">;
const EMPTY_FORM: FormState = {
  number: "",
  customerName: "",
  amount: 0,
  status: "loyiha",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

function formatSum(n: number) {
  return n.toLocaleString("uz-UZ");
}

function StatusBadge({ status }: { status: ContractStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", m.color, m.bg)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export default function ContractsTab() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contract | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/contracts");
      const data = await res.json();
      setContracts(Array.isArray(data?.contracts) ? data.contracts : []);
    } catch {
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setError(null);
    setShowModal(true);
  }

  function openEdit(c: Contract) {
    setEditing(c);
    setForm({ number: c.number, customerName: c.customerName, amount: c.amount, status: c.status, date: c.date, notes: c.notes });
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = editing ? `/api/crm/contracts/${editing.id}` : "/api/crm/contracts";
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

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/crm/contracts/${id}`, { method: "DELETE" });
      setContracts((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setConfirmingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi shartnoma
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Shartnoma №", "Mijoz", "Summa", "Sana", "Holat", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-14 text-center text-gray-400 text-sm">Yuklanmoqda...</td></tr>
              ) : contracts.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-14 text-center text-gray-400 text-sm">Shartnomalar topilmadi</td></tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#0EA5E9] whitespace-nowrap">{c.number}</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-800 whitespace-nowrap">{c.customerName}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-gray-800 whitespace-nowrap">{formatSum(c.amount)} so'm</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{c.date}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5">
                      {confirmingId === c.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleDelete(c.id)} className="px-2 h-7 rounded-lg bg-[#EF4444] hover:bg-red-600 text-white text-[11px] font-semibold">Ha</button>
                          <button onClick={() => setConfirmingId(null)} className="px-2 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-semibold">Bekor</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(c)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9] transition-colors" title="Tahrirlash">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setConfirmingId(c.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#EF4444] transition-colors" title="O'chirish">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <h2 className="text-base font-bold text-gray-900">{editing ? "Shartnomani tahrirlash" : "Yangi shartnoma"}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Shartnoma raqami *</label>
                    <input
                      value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} required
                      placeholder="SH-2026-001"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Sana</label>
                    <input
                      type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mijoz nomi *</label>
                  <input
                    value={form.customerName} onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))} required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                  />
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
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Holat</label>
                    <select
                      value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ContractStatus }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] bg-white"
                    >
                      {(Object.keys(STATUS_META) as ContractStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                      ))}
                    </select>
                  </div>
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
