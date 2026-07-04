"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Users, UserCheck, UserX, UserMinus,
  Calendar, Phone, Building2, Clock, X, Eye, Trash2,
  Pencil, LayoutGrid, List, ChevronLeft, ChevronRight,
  Award, Banknote, BadgeCheck, ChevronDown,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type WorkerStatus = "Faol" | "Ta'tilda" | "Kasal" | "Ishdan bo'shatilgan";

interface Worker {
  id: string;
  name: string;
  position: string;
  department: string;
  status: WorkerStatus;
  shift: 1 | 2 | 3 | null;
  phone: string;
  hireDate: string;
  salary: number;
}

/* ─── Data ─── */
const WORKERS: Worker[] = [
  { id: "W001", name: "Karimov Botir",        position: "Liniya ustasi",    department: "1-liniya",        status: "Faol",      shift: 1,    phone: "+998 90 123 4567", hireDate: "2020-03-15", salary: 4500000 },
  { id: "W002", name: "Yusupov Sherzod",      position: "Liniya ustasi",    department: "2-liniya",        status: "Faol",      shift: 2,    phone: "+998 91 234 5678", hireDate: "2019-07-22", salary: 4200000 },
  { id: "W003", name: "Holmatov Dilshod",     position: "Liniya ustasi",    department: "3-liniya",        status: "Faol",      shift: 1,    phone: "+998 93 345 6789", hireDate: "2021-01-10", salary: 4300000 },
  { id: "W004", name: "Tursunov Ilhom",       position: "Liniya ustasi",    department: "4-liniya",        status: "Faol",      shift: 2,    phone: "+998 94 456 7890", hireDate: "2020-11-05", salary: 4100000 },
  { id: "W005", name: "Mirzayev Sanjar",      position: "Bosh elektrik",    department: "Elektrik montaj", status: "Faol",      shift: 1,    phone: "+998 95 567 8901", hireDate: "2018-06-20", salary: 5200000 },
  { id: "W006", name: "Qodirov Mansur",       position: "Omborchi",         department: "Ehtiyot ombori",  status: "Faol",      shift: 1,    phone: "+998 97 678 9012", hireDate: "2022-04-18", salary: 3200000 },
  { id: "W007", name: "Ergashev Nodir",       position: "Omborchi",         department: "Tayyor ombori",   status: "Faol",      shift: 2,    phone: "+998 98 789 0123", hireDate: "2021-09-30", salary: 3300000 },
  { id: "W008", name: "Nazarov Aziz",         position: "Test muhandisi",   department: "Test maydoni",    status: "Faol",      shift: 1,    phone: "+998 90 890 1234", hireDate: "2019-12-01", salary: 4800000 },
  { id: "W009", name: "Sotvoldiyev Behruz",   position: "Energetik",        department: "Energetika",      status: "Faol",      shift: 3,    phone: "+998 91 901 2345", hireDate: "2020-08-14", salary: 4600000 },
  { id: "W010", name: "Xasanov Ruslan",       position: "Qo'riqchi",        department: "Nazorat",         status: "Faol",      shift: 3,    phone: "+998 93 012 3456", hireDate: "2023-02-28", salary: 2800000 },
  { id: "W011", name: "Abdullayev Jahongir",  position: "Zavod direktori",  department: "Ma'muriyat",      status: "Faol",      shift: null, phone: "+998 90 111 2222", hireDate: "2017-01-01", salary: 15000000 },
  { id: "W012", name: "Razzaqov Jamshid",     position: "Bo'yash ustasi",   department: "Bo'yash sexi",    status: "Faol",      shift: 1,    phone: "+998 91 222 3333", hireDate: "2021-06-15", salary: 3800000 },
  { id: "W013", name: "Usmonov Ulugbek",      position: "Yig'uvchi",        department: "1-liniya",        status: "Faol",      shift: 1,    phone: "+998 93 333 4444", hireDate: "2022-09-01", salary: 3100000 },
  { id: "W014", name: "Rahimov Alisher",      position: "Payvandchi",       department: "2-liniya",        status: "Ta'tilda",  shift: 2,    phone: "+998 94 444 5555", hireDate: "2020-03-20", salary: 3500000 },
  { id: "W015", name: "Sobirov Bekzod",       position: "Elektrik",         department: "Elektrik montaj", status: "Faol",      shift: 2,    phone: "+998 95 555 6666", hireDate: "2022-11-10", salary: 3400000 },
  { id: "W016", name: "Nazarova Nilufar",     position: "HR menejeri",      department: "Ma'muriyat",      status: "Faol",      shift: null, phone: "+998 97 666 7777", hireDate: "2019-04-12", salary: 5500000 },
  { id: "W017", name: "Xoliqova Malika",      position: "Buxgalter",        department: "Ma'muriyat",      status: "Faol",      shift: null, phone: "+998 98 777 8888", hireDate: "2020-07-01", salary: 4900000 },
  { id: "W018", name: "Toshmatov Doniyor",    position: "Yig'uvchi",        department: "3-liniya",        status: "Kasal",     shift: 1,    phone: "+998 90 888 9999", hireDate: "2023-05-22", salary: 2900000 },
  { id: "W019", name: "Yunusov Sardor",       position: "Yig'uvchi",        department: "4-liniya",        status: "Faol",      shift: 2,    phone: "+998 91 999 0000", hireDate: "2022-08-18", salary: 3100000 },
  { id: "W020", name: "Abduraxmonov Temur",   position: "Muhandis",         department: "Texnik xizmat",   status: "Faol",      shift: 1,    phone: "+998 93 100 2000", hireDate: "2021-03-07", salary: 5000000 },
  { id: "W021", name: "Jo'rayev Otabek",      position: "Yig'uvchi",        department: "1-liniya",        status: "Faol",      shift: 2,    phone: "+998 94 200 3000", hireDate: "2023-09-15", salary: 2800000 },
  { id: "W022", name: "Hasanova Feruza",      position: "Sifat nazorati",   department: "Test maydoni",    status: "Faol",      shift: 1,    phone: "+998 95 300 4000", hireDate: "2020-12-10", salary: 4200000 },
  { id: "W023", name: "Mamatov Mirzo",        position: "Payvandchi",       department: "Bo'yash sexi",    status: "Faol",      shift: 2,    phone: "+998 97 400 5000", hireDate: "2021-08-22", salary: 3600000 },
  { id: "W024", name: "Ismoilov Husan",       position: "Elektrik",         department: "Elektrik montaj", status: "Ta'tilda",  shift: null, phone: "+998 98 500 6000", hireDate: "2022-02-14", salary: 3400000 },
  { id: "W025", name: "Rахimova Shahlo",      position: "Kotiba",           department: "Ma'muriyat",      status: "Faol",      shift: null, phone: "+998 90 600 7000", hireDate: "2023-01-09", salary: 3000000 },
];

/* ─── Constants ─── */
const STATUS_META: Record<WorkerStatus, { color: string; bg: string; dot: string; label: string }> = {
  "Faol":                  { color: "text-[#22C55E]", bg: "bg-green-50",  dot: "bg-[#22C55E]",  label: "Faol"         },
  "Ta'tilda":              { color: "text-[#F59E0B]", bg: "bg-amber-50",  dot: "bg-[#F59E0B]",  label: "Ta'tilda"     },
  "Kasal":                 { color: "text-[#EF4444]", bg: "bg-red-50",    dot: "bg-[#EF4444]",  label: "Kasal"        },
  "Ishdan bo'shatilgan":   { color: "text-gray-400",  bg: "bg-gray-50",   dot: "bg-gray-300",   label: "Ishdan bo'shatilgan" },
};

const DEPT_META: Record<string, { bg: string; text: string }> = {
  "1-liniya":        { bg: "bg-blue-100",   text: "text-blue-700"   },
  "2-liniya":        { bg: "bg-blue-100",   text: "text-blue-700"   },
  "3-liniya":        { bg: "bg-blue-100",   text: "text-blue-700"   },
  "4-liniya":        { bg: "bg-blue-100",   text: "text-blue-700"   },
  "Bo'yash sexi":    { bg: "bg-purple-100", text: "text-purple-700" },
  "Elektrik montaj": { bg: "bg-sky-100",    text: "text-sky-700"    },
  "Ehtiyot ombori":  { bg: "bg-orange-100", text: "text-orange-700" },
  "Tayyor ombori":   { bg: "bg-orange-100", text: "text-orange-700" },
  "Ma'muriyat":      { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Energetika":      { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Nazorat":         { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Test maydoni":    { bg: "bg-green-100",  text: "text-green-700"  },
  "Texnik xizmat":   { bg: "bg-red-100",    text: "text-red-700"    },
};

const AVATAR_GRADIENTS = [
  "from-sky-400 to-blue-600",
  "from-violet-400 to-purple-600",
  "from-emerald-400 to-green-600",
  "from-orange-400 to-amber-600",
  "from-pink-400 to-rose-600",
  "from-teal-400 to-cyan-600",
  "from-red-400 to-rose-600",
  "from-indigo-400 to-violet-600",
];

function getGradient(name: string) {
  const code = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : name.substring(0, 2);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });
}

function formatSalary(s: number) {
  return `${(s / 1000000).toFixed(1)} mln so'm`;
}

function yearsWorked(hireDate: string) {
  const diff = (Date.now() - new Date(hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(diff);
}

const DEPARTMENTS = ["Barchasi", ...Array.from(new Set(WORKERS.map(w => w.department))).sort()];
const STATUS_TABS: (WorkerStatus | "Barchasi")[] = ["Barchasi", "Faol", "Ta'tilda", "Kasal"];
const SHIFTS_META: Record<number, string> = { 1: "I-smena", 2: "II-smena", 3: "III-smena" };

const PER_PAGE_GRID = 12;
const PER_PAGE_LIST = 10;

/* ─── Avatar ─── */
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" }[size];
  return (
    <div className={cn("rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white flex-shrink-0", sz, getGradient(name))}>
      {getInitials(name)}
    </div>
  );
}

/* ─── Worker Card (grid view) ─── */
function WorkerCard({ worker, onView, onDelete }: { worker: Worker; onView: () => void; onDelete: () => void }) {
  const sm = STATUS_META[worker.status];
  const dm = DEPT_META[worker.department] ?? { bg: "bg-gray-100", text: "text-gray-600" };

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col gap-4 relative group"
    >
      {/* Status dot */}
      <span className={cn("absolute top-4 right-4 w-2.5 h-2.5 rounded-full", sm.dot)} />

      {/* Top: avatar + name */}
      <div className="flex items-center gap-3">
        <Avatar name={worker.name} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{worker.name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{worker.position}</p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{worker.id}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", dm.bg, dm.text)}>
          {worker.department}
        </span>
        {worker.shift && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {SHIFTS_META[worker.shift]}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {worker.phone}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {yearsWorked(worker.hireDate)} yil ishlagan
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <Banknote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {formatSalary(worker.salary)}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full", sm.color, sm.bg)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
          {sm.label}
        </span>

        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onView} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9] transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Worker Detail Modal ─── */
function WorkerDetailModal({ worker, onClose }: { worker: Worker; onClose: () => void }) {
  const sm = STATUS_META[worker.status];
  const dm = DEPT_META[worker.department] ?? { bg: "bg-gray-100", text: "text-gray-600" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-6 pt-6 pb-8">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl font-bold text-white border-2 border-white/30", getGradient(worker.name))}>
              {getInitials(worker.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{worker.name}</h2>
              <p className="text-white/80 text-sm mt-0.5">{worker.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full", dm.bg, dm.text)}>
                  {worker.department}
                </span>
                <span className="font-mono text-white/60 text-xs">{worker.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status + shift */}
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", sm.color, sm.bg)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
              {sm.label}
            </span>
            {worker.shift && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                <Clock className="w-3 h-3" />
                {SHIFTS_META[worker.shift]}
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Phone,     label: "Telefon",          value: worker.phone },
              { icon: Calendar,  label: "Ishga kirish",     value: formatDate(worker.hireDate) },
              { icon: Award,     label: "Ish staji",        value: `${yearsWorked(worker.hireDate)} yil` },
              { icon: Banknote,  label: "Oylik maosh",      value: formatSalary(worker.salary) },
              { icon: Building2, label: "Bo'lim",           value: worker.department },
              { icon: BadgeCheck,label: "Holat",            value: sm.label },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">{label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Years progress bar */}
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Ishda o'tgan yillar</span>
              <span className="text-xs font-bold text-[#0EA5E9]">{yearsWorked(worker.hireDate)} / 10 yil</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] rounded-full"
                style={{ width: `${Math.min(yearsWorked(worker.hireDate) * 10, 100)}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors">
              <Pencil className="w-4 h-4" />
              Tahrirlash
            </button>
            <button onClick={onClose} className="h-10 px-5 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-colors">
              Yopish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Add Worker Modal ─── */
const BLANK: Omit<Worker, "id"> = {
  name: "", position: "", department: "1-liniya", status: "Faol",
  shift: 1, phone: "", hireDate: "", salary: 3000000,
};

function AddWorkerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (w: Worker) => void }) {
  const [form, setForm] = useState<Omit<Worker, "id">>(BLANK);
  const set = (key: keyof typeof form, val: any) => setForm(f => ({ ...f, [key]: val }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.position || !form.phone || !form.hireDate) return;
    onAdd({ ...form, id: `W${String(Date.now()).slice(-4)}` });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Yangi ishchi qo'shish</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">To'liq ismi *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
                placeholder="Familiya Ism" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Lavozim *</label>
              <input value={form.position} onChange={e => set("position", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
                placeholder="Lavozim nomi" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Bo'lim</label>
              <select value={form.department} onChange={e => set("department", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white">
                {DEPARTMENTS.slice(1).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Smena</label>
              <select value={form.shift ?? ""} onChange={e => set("shift", e.target.value ? Number(e.target.value) : null)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white">
                <option value="">Ma'muriyat</option>
                <option value={1}>I-smena (06:00–14:00)</option>
                <option value={2}>II-smena (14:00–22:00)</option>
                <option value={3}>III-smena (22:00–06:00)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Holat</label>
              <select value={form.status} onChange={e => set("status", e.target.value as WorkerStatus)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white">
                <option>Faol</option>
                <option>Ta'tilda</option>
                <option>Kasal</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Telefon *</label>
              <input value={form.phone} onChange={e => set("phone", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
                placeholder="+998 90 000 0000" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Ishga kirish *</label>
              <input type="date" value={form.hireDate} onChange={e => set("hireDate", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Oylik maosh (so'm)</label>
              <input type="number" value={form.salary} onChange={e => set("salary", Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9]"
                min={1000000} step={100000} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="flex-1 h-10 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Qo'shish
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
              Bekor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function IshchilarPage() {
  const [workers, setWorkers] = useState<Worker[]>(WORKERS);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("Barchasi");
  const [statusTab, setStatusTab] = useState<WorkerStatus | "Barchasi">("Barchasi");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    let list = workers;
    if (search) list = list.filter(w => w.name.toLowerCase().includes(search.toLowerCase()) || w.position.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase()));
    if (dept !== "Barchasi") list = list.filter(w => w.department === dept);
    if (statusTab !== "Barchasi") list = list.filter(w => w.status === statusTab);
    return list;
  }, [workers, search, dept, statusTab]);

  const perPage = viewMode === "grid" ? PER_PAGE_GRID : PER_PAGE_LIST;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handlePageChange = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));
  const resetPage = () => setPage(1);

  const selectedWorker = workers.find(w => w.id === selectedId) ?? null;

  function handleDelete(id: string) {
    setWorkers(ws => ws.filter(w => w.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  const stats = [
    { label: "Jami ishchilar",  value: workers.length,                                            unit: "nafar", icon: Users,      bg: "bg-sky-50",    color: "text-[#0EA5E9]"  },
    { label: "Faol",            value: workers.filter(w => w.status === "Faol").length,            unit: "nafar", icon: UserCheck,  bg: "bg-green-50",  color: "text-[#22C55E]"  },
    { label: "Ta'tilda",        value: workers.filter(w => w.status === "Ta'tilda").length,        unit: "nafar", icon: UserMinus,  bg: "bg-amber-50",  color: "text-[#F59E0B]"  },
    { label: "Kasal",           value: workers.filter(w => w.status === "Kasal").length,           unit: "nafar", icon: UserX,      bg: "bg-red-50",    color: "text-[#EF4444]"  },
    { label: "Bo'limlar soni",  value: new Set(workers.map(w => w.department)).size,               unit: "ta",    icon: Building2,  bg: "bg-purple-50", color: "text-[#8B5CF6]"  },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ishchilar</h1>
              <p className="text-xs text-gray-400 mt-0.5">Zavod xodimlarini boshqarish</p>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Yangi ishchi
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {stats.map(s => (
              <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium mb-2">{s.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                      <span className="text-xs text-gray-400 font-medium">{s.unit}</span>
                    </div>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-5 py-3.5 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                  placeholder="Ism, lavozim yoki ID bo'yicha qidirish..."
                  className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
                />
              </div>

              {/* Department */}
              <div className="relative">
                <select
                  value={dept} onChange={e => { setDept(e.target.value); resetPage(); }}
                  className="h-9 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0EA5E9] appearance-none cursor-pointer"
                >
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Status tabs */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setStatusTab(tab); resetPage(); }}
                    className={cn(
                      "px-3 h-7 rounded-lg text-xs font-semibold transition-all",
                      statusTab === tab ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 ml-auto">
                <button onClick={() => { setViewMode("grid"); resetPage(); }}
                  className={cn("w-7 h-7 flex items-center justify-center rounded-lg transition-all", viewMode === "grid" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600")}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setViewMode("list"); resetPage(); }}
                  className={cn("w-7 h-7 flex items-center justify-center rounded-lg transition-all", viewMode === "list" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600")}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 font-medium">
              <span className="font-bold text-gray-800">{filtered.length}</span> ta ishchi topildi
            </p>
            <p className="text-xs text-gray-400">{page}/{totalPages} sahifa</p>
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-4 gap-4">
              {paginated.map(w => (
                <WorkerCard
                  key={w.id}
                  worker={w}
                  onView={() => setSelectedId(w.id)}
                  onDelete={() => handleDelete(w.id)}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {["#", "Ishchi", "Lavozim", "Bo'lim", "Smena", "Holat", "Telefon", "Ish staji", ""].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((w, i) => {
                    const sm = STATUS_META[w.status];
                    const dm = DEPT_META[w.department] ?? { bg: "bg-gray-100", text: "text-gray-600" };
                    return (
                      <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50 group transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{(page - 1) * perPage + i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={w.name} size="sm" />
                            <div>
                              <p className="text-xs font-semibold text-gray-800">{w.name}</p>
                              <p className="text-[11px] text-gray-400 font-mono">{w.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{w.position}</td>
                        <td className="px-4 py-3">
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", dm.bg, dm.text)}>{w.department}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{w.shift ? SHIFTS_META[w.shift] : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full", sm.color, sm.bg)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
                            {sm.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{w.phone}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{yearsWorked(w.hireDate)} yil</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedId(w.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9] transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(w.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">Ishchi topilmadi</p>
              <p className="text-xs text-gray-400 mt-1">Qidiruv parametrlarini o'zgartiring</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => handlePageChange(p)}
                  className={cn("w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                    p === page ? "bg-[#0EA5E9] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50")}>
                  {p}
                </button>
              ))}
              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedWorker && (
          <WorkerDetailModal worker={selectedWorker} onClose={() => setSelectedId(null)} />
        )}
        {showAdd && (
          <AddWorkerModal
            onClose={() => setShowAdd(false)}
            onAdd={w => setWorkers(ws => [w, ...ws])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
