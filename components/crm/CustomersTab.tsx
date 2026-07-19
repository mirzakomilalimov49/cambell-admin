"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Pencil, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
}

type FormState = Omit<Customer, "id" | "createdAt">;
const EMPTY_FORM: FormState = { name: "", company: "", phone: "", email: "", address: "", notes: "" };

export default function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/customers");
      const data = await res.json();
      setCustomers(Array.isArray(data?.customers) ? data.customers : []);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(c: Customer) {
    setEditing(c);
    setForm({ name: c.name, company: c.company, phone: c.phone, email: c.email, address: c.address, notes: c.notes });
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = editing ? `/api/crm/customers/${editing.id}` : "/api/crm/customers";
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
      await fetch(`/api/crm/customers/${id}`, { method: "DELETE" });
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setConfirmingId(null);
    }
  }

  const q = search.trim().toLowerCase();
  const filtered = customers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, kompaniya yoki telefon..."
            className="w-full pl-9 pr-3 h-9 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={openNew}
          className="ml-auto flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi mijoz
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Ism", "Kompaniya", "Telefon", "Email", "Manzil", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-14 text-center text-gray-400 text-sm">Yuklanmoqda...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-14 text-center text-gray-400 text-sm">Mijozlar topilmadi</td></tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-gray-800 text-xs whitespace-nowrap">{c.name}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">{c.company || "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">{c.phone}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">{c.email || "—"}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[180px] truncate">{c.address || "—"}</td>
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
                <h2 className="text-base font-bold text-gray-900">{editing ? "Mijozni tahrirlash" : "Yangi mijoz"}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Ism / Tashkilot nomi *</label>
                  <input
                    value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Kompaniya</label>
                  <input
                    value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telefon *</label>
                    <input
                      value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
                    <input
                      type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Manzil</label>
                  <input
                    value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
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
