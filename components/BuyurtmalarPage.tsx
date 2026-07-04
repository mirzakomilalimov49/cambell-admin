"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Eye, Pencil, Trash2, X,
  ChevronLeft, ChevronRight, ClipboardList,
  CheckCircle2, Clock, XCircle, AlertCircle, Calendar,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type Status = "Yangi" | "Jarayonda" | "Tugallangan" | "Bekor qilingan";

interface Order {
  id: string;
  customer: string;
  model: string;
  qty: number;
  status: Status;
  orderDate: string;
  deliveryDate: string;
  amount: string;
  progress: number;
}

/* ─── Mock data ─── */
const ALL_ORDERS: Order[] = [
  { id: "B-2024-127", customer: "Toshkent shahar transporti",    model: "ELECTRO BUS E12", qty: 5, status: "Jarayonda",      orderDate: "01.05.2024", deliveryDate: "30.06.2024", amount: "4 900 000", progress: 65 },
  { id: "B-2024-126", customer: "Samarqand viloyati hokimligi",   model: "ELECTRO BUS E12", qty: 3, status: "Yangi",          orderDate: "08.05.2024", deliveryDate: "15.07.2024", amount: "2 940 000", progress: 0  },
  { id: "B-2024-125", customer: "Farg'ona shahar transporti",     model: "DIESEL BUS D8",   qty: 8, status: "Jarayonda",      orderDate: "25.04.2024", deliveryDate: "25.06.2024", amount: "6 400 000", progress: 80 },
  { id: "B-2024-124", customer: "Buxoro viloyati hokimligi",      model: "ELECTRO BUS E12", qty: 2, status: "Tugallangan",    orderDate: "15.03.2024", deliveryDate: "15.05.2024", amount: "1 960 000", progress: 100},
  { id: "B-2024-123", customer: "Namangan shahri",                model: "HYBRID BUS H10",  qty: 4, status: "Tugallangan",    orderDate: "01.03.2024", deliveryDate: "01.05.2024", amount: "4 200 000", progress: 100},
  { id: "B-2024-122", customer: "Andijon viloyati hokimligi",     model: "ELECTRO BUS E12", qty: 6, status: "Jarayonda",      orderDate: "10.04.2024", deliveryDate: "10.07.2024", amount: "5 880 000", progress: 40 },
  { id: "B-2024-121", customer: "Qashqadaryo viloyati",           model: "DIESEL BUS D8",   qty: 3, status: "Yangi",          orderDate: "09.05.2024", deliveryDate: "20.07.2024", amount: "2 400 000", progress: 0  },
  { id: "B-2024-120", customer: "Surxondaryo viloyati",           model: "ELECTRO BUS E12", qty: 1, status: "Bekor qilingan", orderDate: "20.03.2024", deliveryDate: "—",          amount: "980 000",   progress: 0  },
  { id: "B-2024-119", customer: "Xorazm viloyati hokimligi",      model: "HYBRID BUS H10",  qty: 5, status: "Tugallangan",    orderDate: "01.02.2024", deliveryDate: "01.04.2024", amount: "5 250 000", progress: 100},
  { id: "B-2024-118", customer: "Jizzax viloyati",                model: "ELECTRO BUS E12", qty: 2, status: "Jarayonda",      orderDate: "20.04.2024", deliveryDate: "20.06.2024", amount: "1 960 000", progress: 55 },
  { id: "B-2024-117", customer: "Sirdaryo viloyati",              model: "DIESEL BUS D8",   qty: 4, status: "Yangi",          orderDate: "10.05.2024", deliveryDate: "25.07.2024", amount: "3 200 000", progress: 0  },
  { id: "B-2024-116", customer: "Navoiy viloyati",                model: "ELECTRO BUS E12", qty: 3, status: "Tugallangan",    orderDate: "10.02.2024", deliveryDate: "10.04.2024", amount: "2 940 000", progress: 100},
];

/* ─── Helpers ─── */
const STATUS_META: Record<Status, { color: string; bg: string; icon: any; dot: string }> = {
  "Yangi":          { color: "text-[#0EA5E9]", bg: "bg-sky-50",    icon: AlertCircle,   dot: "bg-[#0EA5E9]" },
  "Jarayonda":      { color: "text-[#F59E0B]", bg: "bg-amber-50",  icon: Clock,         dot: "bg-[#F59E0B]" },
  "Tugallangan":    { color: "text-[#22C55E]", bg: "bg-green-50",  icon: CheckCircle2,  dot: "bg-[#22C55E]" },
  "Bekor qilingan": { color: "text-[#EF4444]", bg: "bg-red-50",    icon: XCircle,       dot: "bg-[#EF4444]" },
};

const TABS = ["Barchasi", "Yangi", "Jarayonda", "Tugallangan", "Bekor qilingan"] as const;
type Tab = typeof TABS[number];

const MODELS = ["ELECTRO BUS E12", "DIESEL BUS D8", "HYBRID BUS H10"];

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", m.color, m.bg)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {status}
    </span>
  );
}

/* ─── New Order Modal ─── */
function NewOrderModal({ onClose, onSave }: { onClose: () => void; onSave: (o: Order) => void }) {
  const [form, setForm] = useState({ customer: "", model: MODELS[0], qty: 1, deliveryDate: "", note: "" });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `B-2024-${Math.floor(Math.random() * 900 + 100)}`;
    onSave({
      id,
      customer: form.customer,
      model: form.model,
      qty: Number(form.qty),
      status: "Yangi",
      orderDate: new Date().toLocaleDateString("uz-UZ"),
      deliveryDate: form.deliveryDate || "—",
      amount: (Number(form.qty) * 980000).toLocaleString("uz-UZ"),
      progress: 0,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Yangi buyurtma</h2>
            <p className="text-xs text-gray-400 mt-0.5">Yangi buyurtma ma'lumotlarini kiriting</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mijoz nomi *</label>
            <input
              name="customer" value={form.customer} onChange={handle} required
              placeholder="Masalan: Toshkent shahar transporti"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Avtobus modeli *</label>
              <select
                name="model" value={form.model} onChange={handle}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all bg-white"
              >
                {MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Soni *</label>
              <input
                type="number" name="qty" value={form.qty} onChange={handle} min={1} max={50} required
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Yetkazish sanasi</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="date" name="deliveryDate" value={form.deliveryDate} onChange={handle}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Izoh</label>
            <textarea
              name="note" value={form.note} onChange={handle} rows={3}
              placeholder="Qo'shimcha ma'lumotlar..."
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all resize-none placeholder:text-gray-300"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              Bekor qilish
            </button>
            <button type="submit"
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl transition-colors shadow-sm">
              Saqlash
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Order Detail Modal ─── */
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const m = STATUS_META[order.status];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{order.id}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Buyurtma tafsilotlari</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          {[
            ["Mijoz", order.customer],
            ["Model", order.model],
            ["Soni", `${order.qty} ta`],
            ["Buyurtma sanasi", order.orderDate],
            ["Yetkazish sanasi", order.deliveryDate],
            ["Summa", `${order.amount} so'm`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-400 font-medium">{label}</span>
              <span className="text-sm font-semibold text-gray-800">{value}</span>
            </div>
          ))}

          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-gray-400 font-medium">Holat</span>
            <StatusBadge status={order.status} />
          </div>

          {order.status === "Jarayonda" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400 font-medium">Bajarilish</span>
                <span className="text-xs font-bold text-[#F59E0B]">{order.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${order.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
          <button onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-white bg-[#0EA5E9] hover:bg-[#0284C7] rounded-xl transition-colors">
            Yopish
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function BuyurtmalarPage() {
  const [orders, setOrders] = useState<Order[]>(ALL_ORDERS);
  const [activeTab, setActiveTab] = useState<Tab>("Barchasi");
  const [search, setSearch] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  /* counts per tab */
  const counts: Record<Tab, number> = {
    Barchasi:        orders.length,
    Yangi:           orders.filter((o) => o.status === "Yangi").length,
    Jarayonda:       orders.filter((o) => o.status === "Jarayonda").length,
    Tugallangan:     orders.filter((o) => o.status === "Tugallangan").length,
    "Bekor qilingan":orders.filter((o) => o.status === "Bekor qilingan").length,
  };

  /* stats cards */
  const statsCards = [
    { label: "Jami buyurtmalar", value: orders.length,                   iconBg: "bg-sky-50",    iconColor: "text-[#0EA5E9]",  icon: ClipboardList },
    { label: "Yangi",            value: counts["Yangi"],                  iconBg: "bg-blue-50",   iconColor: "text-blue-500",   icon: AlertCircle   },
    { label: "Jarayonda",        value: counts["Jarayonda"],              iconBg: "bg-amber-50",  iconColor: "text-[#F59E0B]",  icon: Clock         },
    { label: "Tugallangan",      value: counts["Tugallangan"],            iconBg: "bg-green-50",  iconColor: "text-[#22C55E]",  icon: CheckCircle2  },
    { label: "Bekor qilingan",   value: counts["Bekor qilingan"],         iconBg: "bg-red-50",    iconColor: "text-[#EF4444]",  icon: XCircle       },
  ];

  /* filter */
  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "Barchasi" || o.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.model.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleTabChange = (tab: Tab) => { setActiveTab(tab); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  const handleDelete = (id: string) => setOrders((prev) => prev.filter((o) => o.id !== id));

  const handleSave = (o: Order) => setOrders((prev) => [o, ...prev]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Buyurtmalar</h1>
              <p className="text-xs text-gray-400 mt-0.5">Barcha buyurtmalar ro'yxati va holati</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yangi buyurtma
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {statsCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium mb-2 leading-snug">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.iconBg)}>
                      <Icon className={cn("w-5 h-5", s.iconColor)} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Table card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
          >
            {/* Filter bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID, mijoz yoki model bo'yicha..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all placeholder:text-gray-400 w-64"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 ml-auto flex-wrap">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap",
                      activeTab === tab
                        ? "bg-[#0EA5E9] text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {tab}
                    <span className={cn(
                      "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                      activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      {counts[tab]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Buyurtma ID", "Mijoz", "Model", "Soni", "Holat", "Buyurtma sanasi", "Yetkazish", "Summa", ""].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-5 py-16 text-center text-gray-400 text-sm">
                          Buyurtmalar topilmadi
                        </td>
                      </tr>
                    ) : (
                      paginated.map((order, i) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.03 }}
                          className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs font-semibold text-[#0EA5E9]">{order.id}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-medium text-gray-800 text-xs leading-snug max-w-[160px] block truncate">{order.customer}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-gray-600 whitespace-nowrap">{order.model}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-bold text-gray-800">{order.qty}</span>
                            <span className="text-xs text-gray-400 ml-1">ta</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-gray-500">{order.orderDate}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs text-gray-500">{order.deliveryDate}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">{order.amount} so'm</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setDetailOrder(order)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9] transition-colors"
                                title="Ko'rish"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-400 hover:text-[#F59E0B] transition-colors"
                                title="Tahrirlash"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#EF4444] transition-colors"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Jami <span className="font-semibold text-gray-700">{filtered.length}</span> ta buyurtma,{" "}
                  <span className="font-semibold text-gray-700">
                    {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}
                  </span>{" "}
                  ko'rsatilmoqda
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                        page === n
                          ? "bg-[#0EA5E9] text-white"
                          : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewModal && <NewOrderModal onClose={() => setShowNewModal(false)} onSave={handleSave} />}
        {detailOrder && <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />}
      </AnimatePresence>
    </div>
  );
}
