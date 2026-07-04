"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Cog, CheckCircle2, AlertTriangle, XCircle,
  PauseCircle, Wrench, Clock, Calendar, X, Eye,
  ChevronDown, ChevronLeft, ChevronRight, Zap,
  Activity, MapPin, Hash, Building2, BarChart3,
  CalendarClock, Play, RefreshCw, ShieldCheck,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type EqStatus = "Ishlayapti" | "Ta'mirda" | "Buzilgan" | "Kutish";

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: EqStatus;
  hoursWorked: number;
  maxHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  purchaseDate: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
}

/* ─── Data ─── */
const TODAY = new Date("2026-07-03");

const EQUIPMENT: Equipment[] = [
  { id:"EQ001", name:"Yig'ish konveyeri №1",     type:"Konveyer",           location:"1-liniya",        status:"Ishlayapti", hoursWorked:12480, maxHours:20000, lastMaintenance:"2026-05-15", nextMaintenance:"2026-08-15", purchaseDate:"2020-03-01", manufacturer:"Bosch Rexroth",  model:"MTT-3200",    serialNumber:"BR-20-001" },
  { id:"EQ002", name:"Yig'ish konveyeri №2",     type:"Konveyer",           location:"2-liniya",        status:"Ishlayapti", hoursWorked:11200, maxHours:20000, lastMaintenance:"2026-05-20", nextMaintenance:"2026-08-20", purchaseDate:"2020-03-01", manufacturer:"Bosch Rexroth",  model:"MTT-3200",    serialNumber:"BR-20-002" },
  { id:"EQ003", name:"Yig'ish konveyeri №3",     type:"Konveyer",           location:"3-liniya",        status:"Ishlayapti", hoursWorked: 9800, maxHours:20000, lastMaintenance:"2026-06-01", nextMaintenance:"2026-09-01", purchaseDate:"2021-02-15", manufacturer:"Bosch Rexroth",  model:"MTT-3200",    serialNumber:"BR-21-003" },
  { id:"EQ004", name:"Yig'ish konveyeri №4",     type:"Konveyer",           location:"4-liniya",        status:"Ishlayapti", hoursWorked: 8600, maxHours:20000, lastMaintenance:"2026-06-10", nextMaintenance:"2026-09-10", purchaseDate:"2021-06-01", manufacturer:"Bosch Rexroth",  model:"MTT-3200",    serialNumber:"BR-21-004" },
  { id:"EQ005", name:"Yig'ish konveyeri №5",     type:"Konveyer",           location:"5-liniya",        status:"Ta'mirda",   hoursWorked:15200, maxHours:20000, lastMaintenance:"2026-06-15", nextMaintenance:"2026-07-15", purchaseDate:"2019-09-01", manufacturer:"Bosch Rexroth",  model:"MTT-2800",    serialNumber:"BR-19-005" },
  { id:"EQ006", name:"Ko'taruvchi kran №1",      type:"Ko'taruvchi kran",   location:"1-liniya",        status:"Ishlayapti", hoursWorked: 8200, maxHours:15000, lastMaintenance:"2026-04-20", nextMaintenance:"2026-07-20", purchaseDate:"2020-07-15", manufacturer:"Demag",          model:"DR-Pro 10",   serialNumber:"DM-20-006" },
  { id:"EQ007", name:"Ko'taruvchi kran №2",      type:"Ko'taruvchi kran",   location:"2-liniya",        status:"Ishlayapti", hoursWorked: 7600, maxHours:15000, lastMaintenance:"2026-05-05", nextMaintenance:"2026-08-05", purchaseDate:"2020-07-15", manufacturer:"Demag",          model:"DR-Pro 10",   serialNumber:"DM-20-007" },
  { id:"EQ008", name:"Payvandlash roboti №1",    type:"Payvandlash roboti", location:"1-liniya",        status:"Ishlayapti", hoursWorked: 6400, maxHours:12000, lastMaintenance:"2026-06-01", nextMaintenance:"2026-09-01", purchaseDate:"2021-11-20", manufacturer:"KUKA",           model:"KR 6 R900",   serialNumber:"KK-21-008" },
  { id:"EQ009", name:"Payvandlash roboti №2",    type:"Payvandlash roboti", location:"3-liniya",        status:"Ishlayapti", hoursWorked: 5800, maxHours:12000, lastMaintenance:"2026-06-05", nextMaintenance:"2026-09-05", purchaseDate:"2021-11-20", manufacturer:"KUKA",           model:"KR 6 R900",   serialNumber:"KK-21-009" },
  { id:"EQ010", name:"Payvandlash roboti №3",    type:"Payvandlash roboti", location:"2-liniya",        status:"Buzilgan",   hoursWorked: 7200, maxHours:12000, lastMaintenance:"2026-03-10", nextMaintenance:"2026-06-10", purchaseDate:"2021-05-15", manufacturer:"KUKA",           model:"KR 6 R900",   serialNumber:"KK-21-010" },
  { id:"EQ011", name:"Bo'yash kamerasi №1",      type:"Bo'yash kamerasi",   location:"Bo'yash sexi",    status:"Ishlayapti", hoursWorked: 9200, maxHours:18000, lastMaintenance:"2026-05-25", nextMaintenance:"2026-08-25", purchaseDate:"2020-12-01", manufacturer:"Eisenmann",      model:"EC-500",      serialNumber:"EM-20-011" },
  { id:"EQ012", name:"Bo'yash kamerasi №2",      type:"Bo'yash kamerasi",   location:"Bo'yash sexi",    status:"Ta'mirda",   hoursWorked: 8800, maxHours:18000, lastMaintenance:"2026-06-20", nextMaintenance:"2026-09-20", purchaseDate:"2020-12-01", manufacturer:"Eisenmann",      model:"EC-500",      serialNumber:"EM-20-012" },
  { id:"EQ013", name:"Gidravlik lift №1",        type:"Gidravlik lift",     location:"1-liniya",        status:"Ishlayapti", hoursWorked:11600, maxHours:25000, lastMaintenance:"2026-06-08", nextMaintenance:"2026-09-08", purchaseDate:"2020-04-10", manufacturer:"Nussbaum",       model:"LIFT-4500",   serialNumber:"NB-20-013" },
  { id:"EQ014", name:"Gidravlik lift №2",        type:"Gidravlik lift",     location:"2-liniya",        status:"Ishlayapti", hoursWorked:10400, maxHours:25000, lastMaintenance:"2026-06-12", nextMaintenance:"2026-09-12", purchaseDate:"2020-04-10", manufacturer:"Nussbaum",       model:"LIFT-4500",   serialNumber:"NB-20-014" },
  { id:"EQ015", name:"Sinov stendi №1",          type:"Sinov stendi",       location:"Test maydoni",    status:"Ishlayapti", hoursWorked: 4200, maxHours:10000, lastMaintenance:"2026-05-30", nextMaintenance:"2026-08-30", purchaseDate:"2022-01-20", manufacturer:"AVL List",       model:"APA 4X4",     serialNumber:"AV-22-015" },
  { id:"EQ016", name:"CNC dastgohi №1",          type:"CNC dastgoh",        location:"Elektrik montaj", status:"Ishlayapti", hoursWorked: 6800, maxHours:15000, lastMaintenance:"2026-06-02", nextMaintenance:"2026-09-02", purchaseDate:"2021-08-05", manufacturer:"DMG MORI",       model:"DMU 50",      serialNumber:"DM-21-016" },
  { id:"EQ017", name:"Kompressor №1",            type:"Kompressor",         location:"Energetika",      status:"Ishlayapti", hoursWorked:18400, maxHours:30000, lastMaintenance:"2026-04-15", nextMaintenance:"2026-07-15", purchaseDate:"2019-06-01", manufacturer:"Atlas Copco",    model:"GA 55",       serialNumber:"AC-19-017" },
  { id:"EQ018", name:"Zaxira generator",         type:"Generator",          location:"Energetika",      status:"Kutish",     hoursWorked:  320, maxHours:10000, lastMaintenance:"2026-03-01", nextMaintenance:"2026-09-01", purchaseDate:"2020-11-15", manufacturer:"Caterpillar",    model:"C18",         serialNumber:"CP-20-018" },
  { id:"EQ019", name:"Bosh transformator",       type:"Transformator",      location:"Energetika",      status:"Ishlayapti", hoursWorked:22000, maxHours:50000, lastMaintenance:"2026-01-10", nextMaintenance:"2027-01-10", purchaseDate:"2017-05-20", manufacturer:"ABB",            model:"T3-630",      serialNumber:"AB-17-019" },
  { id:"EQ020", name:"Diagnostika uskunasi",     type:"Diagnostika",        location:"Test maydoni",    status:"Ishlayapti", hoursWorked: 3600, maxHours: 8000, lastMaintenance:"2026-06-15", nextMaintenance:"2026-12-15", purchaseDate:"2023-02-10", manufacturer:"Bosch",          model:"KTS 590",     serialNumber:"BS-23-020" },
  { id:"EQ021", name:"Frezerli dastgoh №1",      type:"Frezerli dastgoh",   location:"Elektrik montaj", status:"Kutish",     hoursWorked: 4800, maxHours:12000, lastMaintenance:"2026-05-12", nextMaintenance:"2026-08-12", purchaseDate:"2022-07-18", manufacturer:"Haas",           model:"VF-2SS",      serialNumber:"HS-22-021" },
  { id:"EQ022", name:"Quritish pechi (bo'yash)", type:"Quritish pechi",     location:"Bo'yash sexi",    status:"Ishlayapti", hoursWorked: 7800, maxHours:20000, lastMaintenance:"2026-06-18", nextMaintenance:"2026-09-18", purchaseDate:"2020-12-15", manufacturer:"Hestia",         model:"DP-800",      serialNumber:"HT-20-022" },
  { id:"EQ023", name:"Gidravlik press №1",       type:"Gidravlik press",    location:"1-liniya",        status:"Ishlayapti", hoursWorked: 5600, maxHours:15000, lastMaintenance:"2026-06-22", nextMaintenance:"2026-09-22", purchaseDate:"2022-04-08", manufacturer:"REXROTH",        model:"HP-250",      serialNumber:"RX-22-023" },
];

/* ─── Constants ─── */
const STATUS_META: Record<EqStatus, { label: string; color: string; bg: string; dot: string; icon: any; actionLabel: string; actionColor: string }> = {
  "Ishlayapti": { label:"Ishlayapti", color:"text-[#22C55E]", bg:"bg-green-50",  dot:"bg-[#22C55E]", icon:CheckCircle2, actionLabel:"Ta'mirlash",          actionColor:"text-[#F59E0B] bg-amber-50 hover:bg-amber-100" },
  "Ta'mirda":   { label:"Ta'mirda",   color:"text-[#F59E0B]", bg:"bg-amber-50",  dot:"bg-[#F59E0B]", icon:Wrench,       actionLabel:"Tayyor deb belgilash", actionColor:"text-[#22C55E] bg-green-50 hover:bg-green-100" },
  "Buzilgan":   { label:"Buzilgan",   color:"text-[#EF4444]", bg:"bg-red-50",    dot:"bg-[#EF4444]", icon:XCircle,      actionLabel:"Ta'mirlashga jo'natish",actionColor:"text-[#F59E0B] bg-amber-50 hover:bg-amber-100" },
  "Kutish":     { label:"Kutish",     color:"text-gray-500",  bg:"bg-gray-50",   dot:"bg-gray-300",  icon:PauseCircle,  actionLabel:"Ishga tushirish",      actionColor:"text-[#0EA5E9] bg-sky-50 hover:bg-sky-100"    },
};

const TYPE_META: Record<string, { bg: string; text: string }> = {
  "Konveyer":           { bg:"bg-blue-100",    text:"text-blue-700"    },
  "Ko'taruvchi kran":   { bg:"bg-sky-100",     text:"text-sky-700"     },
  "Payvandlash roboti": { bg:"bg-purple-100",  text:"text-purple-700"  },
  "Bo'yash kamerasi":   { bg:"bg-rose-100",    text:"text-rose-700"    },
  "Gidravlik lift":     { bg:"bg-orange-100",  text:"text-orange-700"  },
  "Sinov stendi":       { bg:"bg-green-100",   text:"text-green-700"   },
  "CNC dastgoh":        { bg:"bg-indigo-100",  text:"text-indigo-700"  },
  "Kompressor":         { bg:"bg-yellow-100",  text:"text-yellow-700"  },
  "Generator":          { bg:"bg-amber-100",   text:"text-amber-700"   },
  "Transformator":      { bg:"bg-teal-100",    text:"text-teal-700"    },
  "Diagnostika":        { bg:"bg-emerald-100", text:"text-emerald-700" },
  "Frezerli dastgoh":   { bg:"bg-violet-100",  text:"text-violet-700"  },
  "Quritish pechi":     { bg:"bg-red-100",     text:"text-red-700"     },
  "Gidravlik press":    { bg:"bg-slate-100",   text:"text-slate-700"   },
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - TODAY.getTime()) / 86400000);
}

function maintenanceColor(dateStr: string) {
  const d = daysUntil(dateStr);
  if (d < 0)   return { text: "text-[#EF4444]", bg: "bg-red-50",   label: `${Math.abs(d)} kun o'tdi` };
  if (d <= 14) return { text: "text-[#EF4444]", bg: "bg-red-50",   label: `${d} kun` };
  if (d <= 30) return { text: "text-[#F59E0B]", bg: "bg-amber-50", label: `${d} kun` };
  return       { text: "text-gray-500",          bg: "bg-gray-50",  label: new Date(dateStr).toLocaleDateString("uz-UZ", { day:"numeric", month:"short", year:"numeric" }) };
}

const EQUIPMENT_TYPES = ["Barchasi", ...Array.from(new Set(EQUIPMENT.map(e => e.type))).sort()];
const STATUS_TABS: (EqStatus | "Barchasi")[] = ["Barchasi", "Ishlayapti", "Ta'mirda", "Buzilgan", "Kutish"];
const PER_PAGE = 10;

/* ─── Equipment Detail Modal ─── */
function EquipmentDetailModal({ eq, onClose, onStatusChange }: {
  eq: Equipment;
  onClose: () => void;
  onStatusChange: (id: string, status: EqStatus) => void;
}) {
  const sm = STATUS_META[eq.status];
  const tm = TYPE_META[eq.type] ?? { bg:"bg-gray-100", text:"text-gray-600" };
  const mc = maintenanceColor(eq.nextMaintenance);
  const healthPct = Math.round((eq.hoursWorked / eq.maxHours) * 100);

  function handleAction() {
    const next: Record<EqStatus, EqStatus> = {
      "Ishlayapti": "Ta'mirda",
      "Ta'mirda":   "Ishlayapti",
      "Buzilgan":   "Ta'mirda",
      "Kutish":     "Ishlayapti",
    };
    onStatusChange(eq.id, next[eq.status]);
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
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0EA5E9] px-6 pt-5 pb-7">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
              <Cog className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{eq.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", tm.bg, tm.text)}>{eq.type}</span>
                <span className="font-mono text-white/60 text-xs">{eq.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Holat</span>
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", sm.color, sm.bg)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
              {sm.label}
            </span>
          </div>

          {/* Health bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-600 font-medium">Resurs holati</span>
              <span className={cn("text-xs font-bold", healthPct > 80 ? "text-[#EF4444]" : healthPct > 60 ? "text-[#F59E0B]" : "text-[#22C55E]")}>
                {healthPct}% ishlatilgan
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full",
                  healthPct > 80 ? "bg-gradient-to-r from-orange-400 to-red-500"
                  : healthPct > 60 ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                  : "bg-gradient-to-r from-green-400 to-emerald-500")}
                style={{ width: `${healthPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">0 soat</span>
              <span className="text-[10px] text-gray-500 font-medium">{eq.hoursWorked.toLocaleString()} / {eq.maxHours.toLocaleString()} soat</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label:"Joylashuvi",        value: eq.location },
              { label:"Ishlab chiqaruvchi", value: eq.manufacturer },
              { label:"Model",             value: eq.model },
              { label:"Seriya raqami",     value: eq.serialNumber },
              { label:"Sotib olingan",     value: eq.purchaseDate },
              { label:"Ish soati",         value: `${eq.hoursWorked.toLocaleString()} soat` },
              { label:"Oxirgi ko'rik",     value: eq.lastMaintenance },
              { label:"Keyingi ko'rik",    value: eq.nextMaintenance },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-gray-400 font-medium mb-1">{label}</p>
                <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Next maintenance alert */}
          <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl", mc.bg)}>
            <CalendarClock className={cn("w-4 h-4 flex-shrink-0", mc.text)} />
            <div>
              <p className={cn("text-xs font-semibold", mc.text)}>Keyingi texnik ko'rik</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{eq.nextMaintenance} — {mc.label}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={handleAction}
              className={cn("flex-1 h-10 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2", sm.actionColor)}>
              <Wrench className="w-4 h-4" />
              {sm.actionLabel}
            </button>
            <button onClick={onClose}
              className="h-10 px-5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
              Yopish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function UskunalarPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(EQUIPMENT);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Barchasi");
  const [statusTab, setStatusTab] = useState<EqStatus | "Barchasi">("Barchasi");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = equipment;
    if (search)              list = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()) || e.serialNumber.toLowerCase().includes(search.toLowerCase()) || e.manufacturer.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "Barchasi") list = list.filter(e => e.type === typeFilter);
    if (statusTab  !== "Barchasi") list = list.filter(e => e.status === statusTab);
    return list;
  }, [equipment, search, typeFilter, statusTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  function resetPage() { setPage(1); }

  function handleStatusChange(id: string, status: EqStatus) {
    setEquipment(list => list.map(e => e.id === id ? { ...e, status } : e));
  }

  const selectedEq = equipment.find(e => e.id === selectedId);

  /* Upcoming maintenance in next 30 days */
  const upcomingMaint = useMemo(() =>
    equipment
      .map(e => ({ ...e, days: daysUntil(e.nextMaintenance) }))
      .filter(e => e.days >= 0 && e.days <= 30)
      .sort((a, b) => a.days - b.days),
  [equipment]);

  /* Overdue maintenance */
  const overdue = useMemo(() =>
    equipment.filter(e => daysUntil(e.nextMaintenance) < 0 && e.status === "Ishlayapti"),
  [equipment]);

  /* Type breakdown */
  const typeBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    equipment.forEach(e => { map[e.type] = (map[e.type] ?? 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [equipment]);

  const counts = {
    Ishlayapti: equipment.filter(e => e.status === "Ishlayapti").length,
    "Ta'mirda":  equipment.filter(e => e.status === "Ta'mirda").length,
    Buzilgan:   equipment.filter(e => e.status === "Buzilgan").length,
    Kutish:     equipment.filter(e => e.status === "Kutish").length,
  };

  const avgHealth = Math.round(equipment.reduce((s, e) => s + (e.hoursWorked / e.maxHours) * 100, 0) / equipment.length);

  const stats = [
    { label:"Jami uskunalar",   value: equipment.length,    unit:"ta",   icon: Cog,          bg:"bg-sky-50",    color:"text-[#0EA5E9]"  },
    { label:"Ishlamoqda",       value: counts.Ishlayapti,   unit:"ta",   icon: CheckCircle2, bg:"bg-green-50",  color:"text-[#22C55E]"  },
    { label:"Ta'mirda",         value: counts["Ta'mirda"],  unit:"ta",   icon: Wrench,       bg:"bg-amber-50",  color:"text-[#F59E0B]"  },
    { label:"Buzilgan",         value: counts.Buzilgan,     unit:"ta",   icon: XCircle,      bg:"bg-red-50",    color:"text-[#EF4444]"  },
    { label:"O'rtacha resurs",  value: avgHealth,           unit:"%",    icon: Activity,     bg:"bg-purple-50", color:"text-[#8B5CF6]"  },
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
              <h1 className="text-xl font-bold text-gray-900">Uskunalar</h1>
              <p className="text-xs text-gray-400 mt-0.5">Zavod uskunalari holati va texnik ko'rik jadvali</p>
            </div>
            <div className="flex items-center gap-2">
              {overdue.length > 0 && (
                <div className="flex items-center gap-2 px-3 h-9 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {overdue.length} ta ko'rik muddati o'tdi
                </div>
              )}
              <button className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                <CalendarClock className="w-4 h-4" />
                Ko'rik rejalashtirish
              </button>
            </div>
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

          {/* Main: table + right panel */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 275px" }}>

            {/* Left: table */}
            <div className="flex flex-col gap-3">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                      placeholder="Uskuna nomi, ID, seriya yoki ishlab chiqaruvchi..."
                      className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
                    />
                  </div>
                  <div className="relative">
                    <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); resetPage(); }}
                      className="h-9 pl-3 pr-7 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0EA5E9] appearance-none cursor-pointer">
                      {EQUIPMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {STATUS_TABS.map(tab => (
                      <button key={tab} onClick={() => { setStatusTab(tab); resetPage(); }}
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
                  <span className="text-xs text-gray-500">
                    <span className="font-bold text-gray-800">{filtered.length}</span> ta uskuna
                  </span>
                  <span className="text-xs text-gray-400">{page}/{totalPages} sahifa</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        {["#","Uskuna","Joylashuv","Ish soati","Keyingi ko'rik","Holat",""].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((eq, i) => {
                        const sm = STATUS_META[eq.status];
                        const tm = TYPE_META[eq.type] ?? { bg:"bg-gray-100", text:"text-gray-600" };
                        const mc = maintenanceColor(eq.nextMaintenance);
                        const healthPct = Math.round((eq.hoursWorked / eq.maxHours) * 100);

                        return (
                          <tr key={eq.id} className="border-b border-gray-50 hover:bg-gray-50/60 group transition-colors">
                            <td className="px-4 py-3 text-[11px] text-gray-400 font-mono">{(page-1)*PER_PAGE+i+1}</td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-semibold text-gray-800 leading-tight max-w-[180px]">{eq.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", tm.bg, tm.text)}>{eq.type}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{eq.id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{eq.location}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-semibold text-gray-800">{eq.hoursWorked.toLocaleString()} soat</p>
                              <div className="mt-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", healthPct > 80 ? "bg-[#EF4444]" : healthPct > 60 ? "bg-[#F59E0B]" : "bg-[#22C55E]")}
                                  style={{ width: `${healthPct}%` }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full", mc.text, mc.bg)}>
                                <Clock className="w-3 h-3" />
                                {mc.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap", sm.color, sm.bg)}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
                                {sm.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setSelectedId(eq.id)}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9] transition-colors" title="Batafsil">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => {
                                  const next: Record<EqStatus, EqStatus> = { "Ishlayapti":"Ta'mirda", "Ta'mirda":"Ishlayapti", "Buzilgan":"Ta'mirda", "Kutish":"Ishlayapti" };
                                  handleStatusChange(eq.id, next[eq.status]);
                                }}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-50 text-gray-400 hover:text-[#F59E0B] transition-colors" title="Holat o'zgartirish">
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Cog className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-500">Uskuna topilmadi</p>
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

              {/* Status summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-[#0EA5E9]" />
                  <h3 className="text-xs font-bold text-gray-800">Holat bo'yicha</h3>
                </div>
                <div className="space-y-3">
                  {(Object.entries(counts) as [EqStatus, number][]).map(([status, count]) => {
                    const sm = STATUS_META[status];
                    const pct = (count / equipment.length) * 100;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-xs font-semibold", sm.color)}>{sm.label}</span>
                          <span className="text-xs font-bold text-gray-700">{count} ta</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", sm.dot)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming maintenance */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <CalendarClock className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-xs font-bold text-gray-800">Yaqin ko'riklar</h3>
                  <span className="ml-auto text-xs font-bold text-[#F59E0B] bg-amber-50 px-2 py-0.5 rounded-full">{upcomingMaint.length} ta</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
                  {upcomingMaint.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ShieldCheck className="w-6 h-6 text-[#22C55E] mb-2" />
                      <p className="text-xs text-gray-500 font-medium">30 kun ichida ko'rik yo'q</p>
                    </div>
                  ) : upcomingMaint.map(eq => {
                    const urgent = eq.days <= 14;
                    return (
                      <div key={eq.id} className="px-4 py-3 hover:bg-gray-50/50">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-gray-800 truncate leading-tight">{eq.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{eq.location}</p>
                          </div>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap",
                            urgent ? "text-[#EF4444] bg-red-50" : "text-[#F59E0B] bg-amber-50")}>
                            {eq.days} kun
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                          <span className="font-medium">{eq.nextMaintenance}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Type breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                  <h3 className="text-xs font-bold text-gray-800">Tur bo'yicha</h3>
                </div>
                <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
                  {typeBreakdown.map(([type, count]) => {
                    const tm = TYPE_META[type] ?? { bg:"bg-gray-100", text:"text-gray-600" };
                    return (
                      <div key={type} className="flex items-center justify-between gap-2">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full truncate", tm.bg, tm.text)}>{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full bg-[#0EA5E9]")} style={{ width: `${(count/equipment.length)*100}%` }} />
                          </div>
                          <span className="text-[11px] font-bold text-gray-600 flex-shrink-0">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEq && (
          <EquipmentDetailModal
            key={selectedEq.id}
            eq={selectedEq}
            onClose={() => setSelectedId(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
