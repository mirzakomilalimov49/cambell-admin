"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Wrench, Clock, CheckCircle2, XCircle,
  AlertTriangle, X, Eye, ChevronDown, ChevronLeft,
  ChevronRight, Calendar, User, Layers, BarChart3,
  Flame, ArrowRight, ClipboardList, TimerReset,
  CircleDot, RefreshCw, Zap,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type Priority = "Favqulodda" | "Yuqori" | "O'rta" | "Past";
type ReqStatus = "Kutilmoqda" | "Bajarilmoqda" | "Tekshirilmoqda" | "Bajarildi" | "Bekor qilindi";
type Category  = "Rejalashtirilgan" | "Shoshilinch" | "Profilaktika" | "Yangilash" | "Diagnostika";

interface Request {
  id: string;
  title: string;
  equipment: string;
  location: string;
  category: Category;
  priority: Priority;
  status: ReqStatus;
  assignee: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  description: string;
  estimatedHours: number;
  actualHours?: number;
}

/* ─── Data ─── */
const TECHNICIANS = ["Abduraxmonov Temur", "Xolmatov Sanjar", "Toshqo'rov Jasur", "Raximov Doniyor", "Norqo'ziyev Bekzod"];

const REQUESTS: Request[] = [
  { id:"TX001", title:"Yig'ish konveyeri №5 ta'mirlash",      equipment:"Yig'ish konveyeri №5",     location:"5-liniya",        category:"Shoshilinch",      priority:"Favqulodda", status:"Bajarilmoqda",   assignee:"Abduraxmonov Temur", createdDate:"2026-06-28", dueDate:"2026-07-05", description:"Konveyer tasmasida yirtiq aniqlandi. Zudlik bilan almashtirish talab etiladi. Liniya ishlamayapti.", estimatedHours:12 },
  { id:"TX002", title:"Payvandlash roboti №3 ta'mirlash",     equipment:"Payvandlash roboti №3",    location:"2-liniya",        category:"Shoshilinch",      priority:"Yuqori",     status:"Bajarilmoqda",   assignee:"Xolmatov Sanjar",    createdDate:"2026-07-01", dueDate:"2026-07-06", description:"Robot yelkasi motor drayverida nosozlik. Ehtiyot qism keltirildi, o'rnatilmoqda.", estimatedHours:8, actualHours:5 },
  { id:"TX003", title:"Bo'yash kamerasi №2 diagnostika",      equipment:"Bo'yash kamerasi №2",      location:"Bo'yash sexi",    category:"Diagnostika",      priority:"Yuqori",     status:"Kutilmoqda",     assignee:"Toshqo'rov Jasur",   createdDate:"2026-07-02", dueDate:"2026-07-08", description:"Kamerada harorat nazorati noto'g'ri ishlayapti. Termostat tekshiruvi zarur.", estimatedHours:4 },
  { id:"TX004", title:"Kompressor №1 rejalashtirilgan ko'rik", equipment:"Kompressor №1",            location:"Energetika",      category:"Rejalashtirilgan", priority:"O'rta",      status:"Kutilmoqda",     assignee:"Raximov Doniyor",    createdDate:"2026-07-01", dueDate:"2026-07-15", description:"3 oylik rejalashtirilgan texnik ko'rik. Yog' va filtr almashtirish.", estimatedHours:3 },
  { id:"TX005", title:"Ko'taruvchi kran №1 profilaktika",     equipment:"Ko'taruvchi kran №1",      location:"1-liniya",        category:"Profilaktika",     priority:"O'rta",      status:"Kutilmoqda",     assignee:"Norqo'ziyev Bekzod", createdDate:"2026-07-01", dueDate:"2026-07-20", description:"Kran troslarini tekshirish va moylash. Baquvvat qismlar almashtirish.", estimatedHours:5 },
  { id:"TX006", title:"CNC dastgohi kalibrlash",              equipment:"CNC dastgohi №1",          location:"Elektrik montaj", category:"Rejalashtirilgan", priority:"Past",       status:"Bajarildi",      assignee:"Abduraxmonov Temur", createdDate:"2026-06-20", dueDate:"2026-06-25", completedDate:"2026-06-24", description:"Oylik kalibrlash va aniqlash tekshiruvi muvaffaqiyatli o'tkazildi.", estimatedHours:2, actualHours:2 },
  { id:"TX007", title:"Gidravlik lift №2 profilaktika",       equipment:"Gidravlik lift №2",        location:"2-liniya",        category:"Profilaktika",     priority:"Past",       status:"Bajarildi",      assignee:"Xolmatov Sanjar",    createdDate:"2026-06-22", dueDate:"2026-06-30", completedDate:"2026-06-29", description:"Gidravlik suyuqlik almashtirish va nasosni tekshirish yakunlandi.", estimatedHours:4, actualHours:3 },
  { id:"TX008", title:"Elektr tarmog'i tekshiruvi",           equipment:"Elektr tizimi (umumiy)",   location:"Elektrik montaj", category:"Diagnostika",      priority:"Yuqori",     status:"Bajarilmoqda",   assignee:"Raximov Doniyor",    createdDate:"2026-06-30", dueDate:"2026-07-05", description:"3 va 4-liniyalarda kuchlanish tushishi kuzatildi. Umumiy tekshiruv o'tkazilmoqda.", estimatedHours:6, actualHours:3 },
  { id:"TX009", title:"Quritish pechi rejalashtirilgan ko'rik", equipment:"Quritish pechi (bo'yash)", location:"Bo'yash sexi",    category:"Rejalashtirilgan", priority:"O'rta",      status:"Tekshirilmoqda", assignee:"Norqo'ziyev Bekzod", createdDate:"2026-06-25", dueDate:"2026-07-03", description:"Pech isitish elementlari tekshirildi, ikkita element almashtirildi. QC tekshiruvi kutilmoqda.", estimatedHours:5, actualHours:5 },
  { id:"TX010", title:"Zaxira generator sinovi",              equipment:"Zaxira generator",         location:"Energetika",      category:"Profilaktika",     priority:"Past",       status:"Bajarildi",      assignee:"Abduraxmonov Temur", createdDate:"2026-06-15", dueDate:"2026-06-20", completedDate:"2026-06-19", description:"Oylik ishga tushirish sinovi o'tkazildi. Barcha ko'rsatkichlar normada.", estimatedHours:1, actualHours:1 },
  { id:"TX011", title:"Yig'ish konveyeri №3 moylashtirish",  equipment:"Yig'ish konveyeri №3",     location:"3-liniya",        category:"Profilaktika",     priority:"Past",       status:"Kutilmoqda",     assignee:"Toshqo'rov Jasur",   createdDate:"2026-07-02", dueDate:"2026-07-10", description:"Konveyer zanjiri va rulonlarini moylashtirish. Ishlab chiqarishga ta'sir etmaydi.", estimatedHours:2 },
  { id:"TX012", title:"Bo'yash kamerasi №1 tozalash",         equipment:"Bo'yash kamerasi №1",      location:"Bo'yash sexi",    category:"Rejalashtirilgan", priority:"Past",       status:"Kutilmoqda",     assignee:"Xolmatov Sanjar",    createdDate:"2026-07-02", dueDate:"2026-07-12", description:"Kamera filtrlari va to'siqlarini tozalash. Haftalik texnik xizmat.", estimatedHours:3 },
  { id:"TX013", title:"Boshqaruv paneli dasturiy yangilash",  equipment:"Boshqaruv paneli",         location:"Elektrik montaj", category:"Yangilash",        priority:"O'rta",      status:"Bajarilmoqda",   assignee:"Raximov Doniyor",    createdDate:"2026-07-01", dueDate:"2026-07-07", description:"SCADA tizimi v3.2 ga yangilanmoqda. Yangi sensor interfeyslari qo'shilmoqda.", estimatedHours:8, actualHours:4 },
  { id:"TX014", title:"Test stendi kalibrlash",               equipment:"Sinov stendi №1",          location:"Test maydoni",    category:"Rejalashtirilgan", priority:"O'rta",      status:"Tekshirilmoqda", assignee:"Norqo'ziyev Bekzod", createdDate:"2026-06-28", dueDate:"2026-07-03", description:"Tormoz sinov stendi kalibrlash yakunlandi. Metrolog tomonidan tasdiqlash kutilmoqda.", estimatedHours:4, actualHours:4 },
  { id:"TX015", title:"Gidravlik press №1 profilaktika",      equipment:"Gidravlik press №1",       location:"1-liniya",        category:"Profilaktika",     priority:"Past",       status:"Kutilmoqda",     assignee:"Abduraxmonov Temur", createdDate:"2026-07-03", dueDate:"2026-07-17", description:"Gidravlik silindrlarda yog' sızdırmazlığını tekshirish.", estimatedHours:3 },
  { id:"TX016", title:"Rul tizimi tekshiruvi",                equipment:"Rul (elektr kuchaytirgich)", location:"Test maydoni",  category:"Diagnostika",      priority:"Yuqori",     status:"Bajarilmoqda",   assignee:"Toshqo'rov Jasur",   createdDate:"2026-07-02", dueDate:"2026-07-06", description:"B-2024-127 buyurtmasidagi avtobus rulida g'alati ovoz. Kuchaytirgich diagnostikasi.", estimatedHours:5, actualHours:2 },
  { id:"TX017", title:"Frezerli dastgoh soz qilish",          equipment:"Frezerli dastgoh №1",      location:"Elektrik montaj", category:"Rejalashtirilgan", priority:"O'rta",      status:"Bajarildi",      assignee:"Xolmatov Sanjar",    createdDate:"2026-06-18", dueDate:"2026-06-23", completedDate:"2026-06-22", description:"Dastgoh spindle podshipniklarini almashtirish muvaffaqiyatli yakunlandi.", estimatedHours:6, actualHours:7 },
  { id:"TX018", title:"Ko'taruvchi kran №2 ko'rik",           equipment:"Ko'taruvchi kran №2",      location:"2-liniya",        category:"Profilaktika",     priority:"Past",       status:"Bajarildi",      assignee:"Raximov Doniyor",    createdDate:"2026-06-10", dueDate:"2026-06-15", completedDate:"2026-06-14", description:"Kran troslar va balansir ko'rik o'tkazildi. Hamma normada.", estimatedHours:3, actualHours:3 },
  { id:"TX019", title:"Elektr kabellari almashtirish",        equipment:"Elektr tizimi (4-liniya)", location:"4-liniya",        category:"Yangilash",        priority:"Yuqori",     status:"Kutilmoqda",     assignee:"Norqo'ziyev Bekzod", createdDate:"2026-07-03", dueDate:"2026-07-10", description:"4-liniya elektr quvvat kabellarini yangi, kuchaytirilgan o'tkazuvchanligi bilan almashtirish.", estimatedHours:10 },
  { id:"TX020", title:"Konditsioner bloki ta'mirlash",        equipment:"Konditsioner bloki",       location:"Salon jihozlari", category:"Shoshilinch",      priority:"Yuqori",     status:"Kutilmoqda",     assignee:"Abduraxmonov Temur", createdDate:"2026-07-03", dueDate:"2026-07-08", description:"Yig'ilgan avtobusda konditsioner sovutmaydigan. Freon to'ldirish va kompressor tekshiruvi.", estimatedHours:4 },
];

/* ─── Constants ─── */
const PRIORITY_META: Record<Priority, { color: string; bg: string; border: string; dot: string; icon: any }> = {
  "Favqulodda": { color:"text-white",        bg:"bg-[#EF4444]",    border:"border-red-400",   dot:"bg-white",       icon: Flame        },
  "Yuqori":     { color:"text-[#EF4444]",    bg:"bg-red-50",       border:"border-red-200",   dot:"bg-[#EF4444]",   icon: AlertTriangle },
  "O'rta":      { color:"text-[#F59E0B]",    bg:"bg-amber-50",     border:"border-amber-200", dot:"bg-[#F59E0B]",   icon: CircleDot    },
  "Past":       { color:"text-[#22C55E]",    bg:"bg-green-50",     border:"border-green-200", dot:"bg-[#22C55E]",   icon: CircleDot    },
};

const STATUS_META: Record<ReqStatus, { color: string; bg: string; dot: string; label: string }> = {
  "Kutilmoqda":     { color:"text-gray-500",  bg:"bg-gray-100",   dot:"bg-gray-400",   label:"Kutilmoqda"     },
  "Bajarilmoqda":   { color:"text-[#0EA5E9]", bg:"bg-sky-50",     dot:"bg-[#0EA5E9]",  label:"Bajarilmoqda"   },
  "Tekshirilmoqda": { color:"text-[#8B5CF6]", bg:"bg-purple-50",  dot:"bg-[#8B5CF6]",  label:"Tekshirilmoqda" },
  "Bajarildi":      { color:"text-[#22C55E]", bg:"bg-green-50",   dot:"bg-[#22C55E]",  label:"Bajarildi"      },
  "Bekor qilindi":  { color:"text-[#EF4444]", bg:"bg-red-50",     dot:"bg-[#EF4444]",  label:"Bekor qilindi"  },
};

const CATEGORY_META: Record<Category, { bg: string; text: string }> = {
  "Rejalashtirilgan": { bg:"bg-blue-100",   text:"text-blue-700"   },
  "Shoshilinch":      { bg:"bg-red-100",    text:"text-red-700"    },
  "Profilaktika":     { bg:"bg-green-100",  text:"text-green-700"  },
  "Yangilash":        { bg:"bg-purple-100", text:"text-purple-700" },
  "Diagnostika":      { bg:"bg-amber-100",  text:"text-amber-700"  },
};

const PRIORITY_LEFT: Record<Priority, string> = {
  "Favqulodda": "border-l-4 border-[#EF4444]",
  "Yuqori":     "border-l-4 border-orange-400",
  "O'rta":      "border-l-4 border-amber-400",
  "Past":       "border-l-4 border-green-400",
};

const STATUS_NEXT: Record<ReqStatus, ReqStatus> = {
  "Kutilmoqda":     "Bajarilmoqda",
  "Bajarilmoqda":   "Tekshirilmoqda",
  "Tekshirilmoqda": "Bajarildi",
  "Bajarildi":      "Bajarildi",
  "Bekor qilindi":  "Bekor qilindi",
};

const TODAY = "2026-07-03";

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - new Date(TODAY).getTime()) / 86400000);
}
function dueBadge(dueDate: string, status: ReqStatus) {
  if (status === "Bajarildi" || status === "Bekor qilindi") return null;
  const d = daysUntil(dueDate);
  if (d < 0)  return { text:`${Math.abs(d)} kun kechikdi`, cls:"text-[#EF4444] bg-red-50" };
  if (d === 0) return { text:"Bugun",                       cls:"text-[#F59E0B] bg-amber-50" };
  if (d <= 3)  return { text:`${d} kun qoldi`,              cls:"text-[#F59E0B] bg-amber-50" };
  return { text:`${d} kun qoldi`, cls:"text-gray-400 bg-gray-50" };
}

const ALL_STATUSES: (ReqStatus | "Barchasi")[] = ["Barchasi","Kutilmoqda","Bajarilmoqda","Tekshirilmoqda","Bajarildi"];
const ALL_PRIORITIES: (Priority | "Barchasi")[] = ["Barchasi","Favqulodda","Yuqori","O'rta","Past"];
const PER_PAGE = 8;

/* ─── Request Detail Modal ─── */
function DetailModal({ req, onClose, onStatusNext }: { req: Request; onClose: () => void; onStatusNext: () => void }) {
  const pm = PRIORITY_META[req.priority];
  const sm = STATUS_META[req.status];
  const cm = CATEGORY_META[req.category];
  const due = dueBadge(req.dueDate, req.status);
  const progress = req.actualHours && req.estimatedHours ? Math.min(Math.round((req.actualHours / req.estimatedHours) * 100), 100) : 0;
  const canAdvance = req.status !== "Bajarildi" && req.status !== "Bekor qilindi";

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
        {/* Priority stripe */}
        <div className={cn("h-1.5 w-full", req.priority === "Favqulodda" ? "bg-[#EF4444]" : req.priority === "Yuqori" ? "bg-orange-400" : req.priority === "O'rta" ? "bg-amber-400" : "bg-green-400")} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-gray-400">{req.id}</span>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", cm.bg, cm.text)}>{req.category}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 leading-snug">{req.title}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 flex-shrink-0">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status + Priority row */}
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", sm.color, sm.bg)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
              {sm.label}
            </span>
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border", pm.color, pm.bg, pm.border)}>
              <pm.icon className="w-3 h-3" />
              {req.priority}
            </span>
            {due && (
              <span className={cn("text-xs font-semibold px-2.5 py-1.5 rounded-full", due.cls)}>
                {due.text}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-600 leading-relaxed">{req.description}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: Wrench,        label:"Uskuna",         value: req.equipment     },
              { icon: Layers,        label:"Joylashuvi",     value: req.location      },
              { icon: User,          label:"Mas'ul texnik",  value: req.assignee      },
              { icon: Calendar,      label:"Muddat",         value: req.dueDate       },
              { icon: Clock,         label:"Taxminiy vaqt",  value: `${req.estimatedHours} soat` },
              { icon: ClipboardList, label:"Yaratilgan",     value: req.createdDate   },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                </div>
                <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Progress (if in progress) */}
          {req.actualHours !== undefined && req.actualHours > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-600">Bajarilganlik</span>
                <span className="text-xs font-bold text-[#0EA5E9]">{req.actualHours} / {req.estimatedHours} soat ({progress}%)</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Completed info */}
          {req.completedDate && (
            <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-green-700">Muvaffaqiyatli yakunlandi</p>
                <p className="text-[11px] text-green-600">{req.completedDate} — {req.actualHours} soatda bajarildi</p>
              </div>
            </div>
          )}

          {/* Action */}
          {canAdvance && (
            <div className="flex gap-3 pt-1">
              <button onClick={onStatusNext}
                className="flex-1 h-10 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {STATUS_NEXT[req.status]} sifatida belgilash
              </button>
              <button onClick={onClose}
                className="h-10 px-4 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-colors">
                Yopish
              </button>
            </div>
          )}
          {!canAdvance && (
            <button onClick={onClose}
              className="w-full h-10 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition-colors">
              Yopish
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── New Request Modal ─── */
const BLANK_FORM = { title:"", equipment:"", location:"", category:"Rejalashtirilgan" as Category, priority:"O'rta" as Priority, assignee: TECHNICIANS[0], dueDate:"", description:"", estimatedHours:4 };

function NewRequestModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: Request) => void }) {
  const [form, setForm] = useState(BLANK_FORM);
  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.equipment || !form.dueDate) return;
    onAdd({
      ...form,
      id: `TX${String(Date.now()).slice(-3)}`,
      status: "Kutilmoqda",
      createdDate: TODAY,
    });
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-50 rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4 text-[#0EA5E9]" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Yangi so'rov</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Muammo sarlavhasi *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
              placeholder="Muammoni qisqacha tavsiflang" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Uskuna *</label>
              <input value={form.equipment} onChange={e => set("equipment", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9]"
                placeholder="Uskuna nomi" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Joylashuv</label>
              <input value={form.location} onChange={e => set("location", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9]"
                placeholder="Bo'lim yoki liniya" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Kategoriya</label>
              <select value={form.category} onChange={e => set("category", e.target.value as Category)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white appearance-none">
                {(["Rejalashtirilgan","Shoshilinch","Profilaktika","Yangilash","Diagnostika"] as Category[]).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Ustuvorlik</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value as Priority)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white appearance-none">
                {(["Favqulodda","Yuqori","O'rta","Past"] as Priority[]).map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mas'ul texnik</label>
              <select value={form.assignee} onChange={e => set("assignee", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white appearance-none">
                {TECHNICIANS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Muddat *</label>
              <input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] bg-white" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Taxminiy vaqt (soat)</label>
            <input type="number" min={1} value={form.estimatedHours} onChange={e => set("estimatedHours", Number(e.target.value))}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9]" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tavsif</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] resize-none"
              placeholder="Muammo haqida batafsil ma'lumot..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 h-10 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Yuborish
            </button>
            <button type="button" onClick={onClose} className="h-10 px-4 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
              Bekor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function TexnikXizmatPage() {
  const [requests, setRequests] = useState<Request[]>(REQUESTS);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<ReqStatus | "Barchasi">("Barchasi");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "Barchasi">("Barchasi");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    let list = requests;
    if (search)                    list = list.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.equipment.toLowerCase().includes(search.toLowerCase()) || r.assignee.toLowerCase().includes(search.toLowerCase()));
    if (statusTab !== "Barchasi")  list = list.filter(r => r.status === statusTab);
    if (priorityFilter !== "Barchasi") list = list.filter(r => r.priority === priorityFilter);
    return list;
  }, [requests, search, statusTab, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  function handleStatusNext(id: string) {
    setRequests(list => list.map(r => r.id === id ? { ...r, status: STATUS_NEXT[r.status], ...(STATUS_NEXT[r.status] === "Bajarildi" ? { completedDate: TODAY, actualHours: r.estimatedHours } : {}) } : r));
    setSelectedId(null);
  }

  const selectedReq = requests.find(r => r.id === selectedId);

  /* Stats */
  const counts = {
    Kutilmoqda:     requests.filter(r => r.status === "Kutilmoqda").length,
    Bajarilmoqda:   requests.filter(r => r.status === "Bajarilmoqda").length,
    Tekshirilmoqda: requests.filter(r => r.status === "Tekshirilmoqda").length,
    Bajarildi:      requests.filter(r => r.status === "Bajarildi").length,
  };
  const critical = requests.filter(r => r.priority === "Favqulodda" && r.status !== "Bajarildi").length;

  /* Technician workload */
  const techLoad = useMemo(() =>
    TECHNICIANS.map(tech => ({
      name: tech,
      active: requests.filter(r => r.assignee === tech && (r.status === "Kutilmoqda" || r.status === "Bajarilmoqda")).length,
      total: requests.filter(r => r.assignee === tech).length,
    })),
  [requests]);

  /* Active requests (in progress) */
  const inProgress = requests.filter(r => r.status === "Bajarilmoqda").slice(0, 4);

  const stats = [
    { label:"Jami so'rovlar",    value: requests.length,        unit:"ta", icon: ClipboardList, bg:"bg-sky-50",    color:"text-[#0EA5E9]"  },
    { label:"Kutilmoqda",        value: counts.Kutilmoqda,      unit:"ta", icon: Clock,         bg:"bg-gray-100",  color:"text-gray-600"    },
    { label:"Bajarilmoqda",      value: counts.Bajarilmoqda,    unit:"ta", icon: RefreshCw,     bg:"bg-blue-50",   color:"text-[#3B82F6]"   },
    { label:"Bajarildi",         value: counts.Bajarildi,       unit:"ta", icon: CheckCircle2,  bg:"bg-green-50",  color:"text-[#22C55E]"   },
    { label:"Favqulodda",        value: critical,               unit:"ta", icon: Flame,         bg:"bg-red-50",    color:"text-[#EF4444]"   },
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
              <h1 className="text-xl font-bold text-gray-900">Texnik xizmat</h1>
              <p className="text-xs text-gray-400 mt-0.5">Ta'mirlash va texnik xizmat so'rovlari boshqaruvi</p>
            </div>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Yangi so'rov
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {stats.map(s => (
              <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium mb-2 leading-snug">{s.label}</p>
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

          {/* Main */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 268px" }}>

            {/* Left: table */}
            <div className="flex flex-col gap-3">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                      placeholder="So'rov, uskuna yoki texnik nomi..."
                      className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30" />
                  </div>
                  <div className="relative">
                    <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value as any); setPage(1); }}
                      className="h-9 pl-3 pr-7 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none appearance-none cursor-pointer">
                      {ALL_PRIORITIES.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {ALL_STATUSES.map(tab => (
                      <button key={tab} onClick={() => { setStatusTab(tab); setPage(1); }}
                        className={cn("px-2.5 h-7 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap",
                          statusTab === tab ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500"><span className="font-bold text-gray-800">{filtered.length}</span> ta so'rov</span>
                  <span className="text-xs text-gray-400">{page}/{totalPages} sahifa</span>
                </div>

                <div className="divide-y divide-gray-50">
                  {paginated.map(req => {
                    const pm = PRIORITY_META[req.priority];
                    const sm = STATUS_META[req.status];
                    const cm = CATEGORY_META[req.category];
                    const due = dueBadge(req.dueDate, req.status);
                    const progress = req.actualHours && req.estimatedHours ? Math.min(Math.round((req.actualHours / req.estimatedHours) * 100), 100) : 0;

                    return (
                      <div key={req.id}
                        className={cn("flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 group transition-colors cursor-pointer", PRIORITY_LEFT[req.priority])}
                        onClick={() => setSelectedId(req.id)}
                      >
                        {/* Priority dot */}
                        <div className="flex-shrink-0 mt-1">
                          <span className={cn("w-2.5 h-2.5 rounded-full block", pm.dot)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-800 leading-snug flex-1 min-w-0">{req.title}</p>
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0", cm.bg, cm.text)}>{req.category}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Wrench className="w-3 h-3" />
                              {req.equipment}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                              <User className="w-3 h-3" />
                              {req.assignee.split(" ")[0]}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-gray-500">
                              <Clock className="w-3 h-3" />
                              {req.estimatedHours} soat
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">{req.id}</span>
                          </div>
                          {req.status === "Bajarilmoqda" && req.actualHours !== undefined && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                                <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-[10px] text-gray-500">{progress}%</span>
                            </div>
                          )}
                        </div>

                        {/* Right: status + due */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full", sm.color, sm.bg)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
                            {sm.label}
                          </span>
                          {due && (
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", due.cls)}>{due.text}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-500">So'rov topilmadi</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={cn("w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                          p===page ? "bg-[#0EA5E9] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50")}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-3">

              {/* Active requests */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <Zap className="w-4 h-4 text-[#0EA5E9]" />
                  <h3 className="text-xs font-bold text-gray-800">Hozir bajarilmoqda</h3>
                  <span className="ml-auto text-xs font-bold text-[#0EA5E9] bg-sky-50 px-2 py-0.5 rounded-full">{counts.Bajarilmoqda} ta</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {inProgress.length === 0 ? (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Faol vazifalar yo'q</p>
                    </div>
                  ) : inProgress.map(req => {
                    const pm = PRIORITY_META[req.priority];
                    const prog = req.actualHours && req.estimatedHours ? Math.min(Math.round((req.actualHours/req.estimatedHours)*100), 100) : 0;
                    return (
                      <div key={req.id} className="px-4 py-3 hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelectedId(req.id)}>
                        <div className="flex items-start gap-2">
                          <span className={cn("w-2 h-2 rounded-full mt-1 flex-shrink-0", pm.dot)} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-gray-800 truncate leading-tight">{req.title}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{req.assignee.split(" ")[0]}</p>
                            {req.actualHours !== undefined && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: `${prog}%` }} />
                                </div>
                                <span className="text-[10px] text-gray-400">{prog}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technician workload */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                  <h3 className="text-xs font-bold text-gray-800">Texniklar yuklamasi</h3>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {techLoad.map(tech => {
                    const maxLoad = 5;
                    const pct = (tech.active / maxLoad) * 100;
                    return (
                      <div key={tech.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-gray-700 truncate">{tech.name.split(" ")[0]} {tech.name.split(" ")[1]?.[0]}.</span>
                          <span className="text-[11px] font-bold text-gray-600 flex-shrink-0 ml-2">{tech.active} ta</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", pct > 80 ? "bg-[#EF4444]" : pct > 60 ? "bg-[#F59E0B]" : "bg-[#22C55E]")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-xs font-bold text-gray-800">Ustuvorlik bo'yicha</h3>
                </div>
                <div className="px-4 py-3 space-y-2.5">
                  {(["Favqulodda","Yuqori","O'rta","Past"] as Priority[]).map(pr => {
                    const pm = PRIORITY_META[pr];
                    const count = requests.filter(r => r.priority === pr && r.status !== "Bajarildi").length;
                    const pct = requests.length ? (count / requests.length) * 100 : 0;
                    return (
                      <div key={pr}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", pm.color, pr === "Favqulodda" ? pm.bg : pm.bg, pr === "Favqulodda" ? "" : "")}>
                            {pr}
                          </span>
                          <span className="text-[11px] font-bold text-gray-600">{count} ta</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", pm.dot)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status pipeline */}
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0EA5E9] rounded-2xl p-4 text-white">
                <p className="text-xs font-semibold text-white/80 mb-3 flex items-center gap-2">
                  <TimerReset className="w-3.5 h-3.5" /> Ish oqimi
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {([["Kutilmoqda", counts.Kutilmoqda], ["Bajarilmoqda", counts.Bajarilmoqda], ["Tekshirilmoqda", counts.Tekshirilmoqda], ["Bajarildi", counts.Bajarildi]] as [string, number][]).map(([label, count]) => (
                    <div key={label} className="bg-white/15 rounded-xl px-3 py-2.5">
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-[10px] text-white/70 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedReq && (
          <DetailModal
            key={selectedReq.id}
            req={selectedReq}
            onClose={() => setSelectedId(null)}
            onStatusNext={() => handleStatusNext(selectedReq.id)}
          />
        )}
        {showNew && (
          <NewRequestModal
            key="new"
            onClose={() => setShowNew(false)}
            onAdd={r => setRequests(list => [r, ...list])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
