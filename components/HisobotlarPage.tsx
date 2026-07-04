"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import {
  FileText, Download, TrendingUp, TrendingDown,
  Package, Users, Cog, Banknote, Target,
  BarChart3, FileSpreadsheet, Award, ChevronRight,
  Calendar, CheckCircle2, Layers, Zap,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Data ─── */
const MONTHLY_PROD = [
  { month: "Yan",  plan: 14, actual: 12 },
  { month: "Feb",  plan: 14, actual: 15 },
  { month: "Mar",  plan: 16, actual: 14 },
  { month: "Apr",  plan: 16, actual: 17 },
  { month: "May",  plan: 18, actual: 16 },
  { month: "Iyn",  plan: 18, actual: 19 },
];

const ORDERS_DATA = [
  { month: "Yan", yangi: 3,  jarayonda: 5,  tugallangan: 6  },
  { month: "Feb", yangi: 4,  jarayonda: 7,  tugallangan: 8  },
  { month: "Mar", yangi: 2,  jarayonda: 6,  tugallangan: 7  },
  { month: "Apr", yangi: 5,  jarayonda: 8,  tugallangan: 9  },
  { month: "May", yangi: 3,  jarayonda: 7,  tugallangan: 8  },
  { month: "Iyn", yangi: 6,  jarayonda: 8,  tugallangan: 10 },
];

const LINE_EFF = [
  { name: "1-liniya", eff: 94, color: "#0EA5E9" },
  { name: "2-liniya", eff: 88, color: "#0EA5E9" },
  { name: "3-liniya", eff: 91, color: "#0EA5E9" },
  { name: "4-liniya", eff: 86, color: "#0EA5E9" },
  { name: "5-liniya", eff: 0,  color: "#D1D5DB" },
  { name: "6-liniya", eff: 0,  color: "#D1D5DB" },
];

interface ReportFile {
  id: string;
  name: string;
  category: string;
  type: "PDF" | "Excel";
  size: string;
  date: string;
  pages?: number;
}

const REPORTS: ReportFile[] = [
  { id:"R001", name:"Iyun 2026 ishlab chiqarish hisoboti",     category:"Ishlab chiqarish", type:"PDF",   size:"1.2 MB", date:"2026-07-01", pages:12 },
  { id:"R002", name:"Q2 2026 buyurtmalar tahlili",             category:"Buyurtmalar",      type:"Excel", size:"845 KB", date:"2026-07-01"          },
  { id:"R003", name:"Iyun 2026 ombor inventarizatsiyasi",      category:"Ombor",            type:"PDF",   size:"632 KB", date:"2026-07-01", pages:8  },
  { id:"R004", name:"May 2026 moliyaviy hisobot",              category:"Moliya",           type:"PDF",   size:"1.5 MB", date:"2026-06-01", pages:18 },
  { id:"R005", name:"Q2 2026 xodimlar samaradorligi",          category:"Ishchilar",        type:"Excel", size:"512 KB", date:"2026-07-01"          },
  { id:"R006", name:"Uskunalar texnik ko'rik hisoboti",        category:"Uskunalar",        type:"PDF",   size:"890 KB", date:"2026-06-30", pages:10 },
  { id:"R007", name:"Iyun 2026 sifat nazorat hisoboti",        category:"Sifat",            type:"PDF",   size:"445 KB", date:"2026-07-02", pages:6  },
  { id:"R008", name:"Aprel–Iyun 2026 energiya sarfi hisoboti", category:"Energetika",       type:"Excel", size:"310 KB", date:"2026-07-01"          },
];

const CAT_COLOR: Record<string, { bg: string; text: string }> = {
  "Ishlab chiqarish": { bg:"bg-blue-100",   text:"text-blue-700"   },
  "Buyurtmalar":      { bg:"bg-sky-100",    text:"text-sky-700"    },
  "Ombor":            { bg:"bg-orange-100", text:"text-orange-700" },
  "Moliya":           { bg:"bg-green-100",  text:"text-green-700"  },
  "Ishchilar":        { bg:"bg-purple-100", text:"text-purple-700" },
  "Uskunalar":        { bg:"bg-amber-100",  text:"text-amber-700"  },
  "Sifat":            { bg:"bg-rose-100",   text:"text-rose-700"   },
  "Energetika":       { bg:"bg-teal-100",   text:"text-teal-700"   },
};

const PERIODS = ["Haftalik", "Oylik", "Choraklik", "Yillik"];

/* ─── Custom Tooltip ─── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 min-w-[140px]">
      <p className="text-xs font-bold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[11px] text-gray-500">{p.name}</span>
          </div>
          <span className="text-[11px] font-bold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── KPI comparison card ─── */
function KpiCard({ label, value, unit, change, positive, icon: Icon, bg, color }: {
  label: string; value: string | number; unit?: string; change?: number;
  positive?: boolean; icon: any; bg: string; color: string;
}) {
  return (
    <div className="bg-gray-50/80 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", bg)}>
          <Icon className={cn("w-3.5 h-3.5", color)} />
        </div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-0.5 text-[10px] font-bold", positive ? "text-[#22C55E]" : "text-[#EF4444]")}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-[10px] text-gray-400 font-medium leading-tight mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {unit && <span className="text-[11px] text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function HisobotlarPage() {
  const [period, setPeriod] = useState("Oylik");

  const totalProduced = MONTHLY_PROD.reduce((s, m) => s + m.actual, 0);
  const totalPlan     = MONTHLY_PROD.reduce((s, m) => s + m.plan, 0);
  const fulfillPct    = Math.round((totalProduced / totalPlan) * 100);

  const stats = [
    { label:"Ishlab chiqarilgan (2026)", value: totalProduced, unit:"dona", icon: Package,     bg:"bg-sky-50",    color:"text-[#0EA5E9]",  change:+8.2,  positive:true  },
    { label:"Reja bajarilishi",          value: fulfillPct,    unit:"%",    icon: Target,      bg:"bg-green-50",  color:"text-[#22C55E]",  change:+2.1,  positive:true  },
    { label:"OEE ko'rsatkichi",          value: 87,            unit:"%",    icon: Cog,         bg:"bg-purple-50", color:"text-[#8B5CF6]",  change:-1.3,  positive:false },
    { label:"Sifat ko'rsatkichi",        value: 98.5,          unit:"%",    icon: Award,       bg:"bg-amber-50",  color:"text-[#F59E0B]",  change:+0.5,  positive:true  },
    { label:"Daromad (Iyun)",            value:"8.4 mlrd",     unit:"so'm", icon: Banknote,    bg:"bg-rose-50",   color:"text-[#F43F5E]",  change:+12.4, positive:true  },
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
              <h1 className="text-xl font-bold text-gray-900">Hisobotlar</h1>
              <p className="text-xs text-gray-400 mt-0.5">Ishlab chiqarish tahlili va hisobotlar</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                {PERIODS.map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={cn("px-3 h-7 rounded-lg text-xs font-semibold transition-all",
                      period === p ? "bg-[#0EA5E9] text-white shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                    {p}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Hisobot yuklash
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {stats.map(s => (
              <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <div className={cn("flex items-center gap-0.5 text-[11px] font-bold rounded-full px-2 py-0.5",
                    s.positive ? "text-[#22C55E] bg-green-50" : "text-[#EF4444] bg-red-50")}>
                    {s.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(s.change)}%
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 font-medium mb-1 leading-snug">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900">{s.value}</span>
                  <span className="text-xs text-gray-400">{s.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "1fr 276px" }}>

            {/* Left: Charts */}
            <div className="flex flex-col gap-4">

              {/* Production AreaChart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Oylik ishlab chiqarish</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Reja va haqiqiy natijalar (2026)</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-3 h-0.5 bg-[#8B5CF6] rounded block" style={{ borderTop: "2px dashed #8B5CF6", background: "none" }} />
                      Reja
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-3 h-2 rounded bg-[#0EA5E9]/30 border-t-2 border-[#0EA5E9] block" />
                      Haqiqiy
                    </span>
                  </div>
                </div>
                <div style={{ height: 230 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_PROD} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#0EA5E9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gPlan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 24]} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="plan"   name="Reja"    stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 3" fill="url(#gPlan)"   dot={false} />
                      <Area type="monotone" dataKey="actual" name="Haqiqiy" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#gActual)" dot={{ fill:"#0EA5E9", r:4, strokeWidth:2, stroke:"white" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Orders BarChart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Buyurtmalar statistikasi</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Holat bo'yicha oylik taqsimot</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {[["#0EA5E9","Yangi"],["#F59E0B","Jarayonda"],["#22C55E","Tugallangan"]].map(([c,l]) => (
                      <span key={l} className="flex items-center gap-1.5 text-gray-500">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c }} />
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ height: 190 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ORDERS_DATA} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barSize={10} barGap={3}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F9FAFB" }} />
                      <Bar dataKey="yangi"       name="Yangi"       fill="#0EA5E9" radius={[3,3,0,0]} />
                      <Bar dataKey="jarayonda"   name="Jarayonda"   fill="#F59E0B" radius={[3,3,0,0]} />
                      <Bar dataKey="tugallangan" name="Tugallangan" fill="#22C55E" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-4">

              {/* KPI comparison */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-xs font-bold text-gray-800">Iyun 2026 yutuqlari</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <KpiCard label="Ishlab chiqarildi"  value={19}      unit="dona"  change={18.8} positive icon={Package}  bg="bg-sky-50"    color="text-[#0EA5E9]" />
                  <KpiCard label="Yetkazildi"         value={14}      unit="ta"    change={16.7} positive icon={CheckCircle2} bg="bg-green-50" color="text-[#22C55E]" />
                  <KpiCard label="Samaradorlik"       value="94.2"    unit="%"     change={1.8}  positive icon={Target}   bg="bg-purple-50" color="text-[#8B5CF6]" />
                  <KpiCard label="Kadrlar"            value={96}      unit="nafar" change={2.1}  positive icon={Users}    bg="bg-amber-50"  color="text-[#F59E0B]" />
                </div>
              </div>

              {/* Line efficiency */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-[#0EA5E9]" />
                  <h3 className="text-xs font-bold text-gray-800">Liniyalar samaradorligi</h3>
                  <span className="ml-auto text-[10px] text-gray-400 font-medium">Maqsad: 90%</span>
                </div>
                <div className="space-y-3.5">
                  {LINE_EFF.map(line => {
                    const inactive = line.eff === 0;
                    const aboveTarget = line.eff >= 90;
                    return (
                      <div key={line.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-gray-700">{line.name}</span>
                          <span className={cn("text-xs font-bold",
                            inactive ? "text-gray-400" : aboveTarget ? "text-[#22C55E]" : "text-[#F59E0B]")}>
                            {inactive ? "—" : `${line.eff}%`}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                          {/* Target line at 90% */}
                          <div className="absolute top-0 bottom-0 w-px bg-gray-400/40 z-10" style={{ left: "90%" }} />
                          <div
                            className={cn("h-full rounded-full transition-all", inactive ? "bg-gray-200" : aboveTarget ? "bg-[#22C55E]" : "bg-[#F59E0B]")}
                            style={{ width: inactive ? "0%" : `${line.eff}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* OEE summary */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">Umumiy OEE</span>
                    <span className="text-sm font-bold text-gray-800">87%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]" style={{ width: "87%" }} />
                  </div>
                </div>
              </div>

              {/* Yearly summary card */}
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0EA5E9] rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-white/80" />
                  <p className="text-xs font-semibold text-white/90">2026 yil xulosasi</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["93",  "dona",   "Avtobus"],
                    [fulfillPct+"%", "",  "Reja bajarilishi"],
                    ["48",  "ta",     "Buyurtma"],
                    ["98.5%","",      "Sifat"],
                  ].map(([v, u, l]) => (
                    <div key={l} className="bg-white/15 rounded-xl px-3 py-2.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold">{v}</span>
                        {u && <span className="text-[10px] text-white/70">{u}</span>}
                      </div>
                      <p className="text-[10px] text-white/60 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reports download list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0EA5E9]" />
                <h3 className="text-sm font-bold text-gray-800">Hisobotlar arxivi</h3>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{REPORTS.length} ta</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-[#0EA5E9] hover:text-sky-600 transition-colors">
                Barchasini ko'rish <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {REPORTS.map(r => {
                const cm = CAT_COLOR[r.category] ?? { bg:"bg-gray-100", text:"text-gray-600" };
                return (
                  <motion.div
                    key={r.id}
                    whileHover={{ backgroundColor: "#F9FAFB" }}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    {/* Icon */}
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      r.type === "PDF" ? "bg-red-50" : "bg-green-50")}>
                      {r.type === "PDF"
                        ? <FileText className="w-5 h-5 text-[#EF4444]" />
                        : <FileSpreadsheet className="w-5 h-5 text-[#22C55E]" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", cm.bg, cm.text)}>{r.category}</span>
                        <span className="text-[11px] text-gray-400">{r.size}</span>
                        {r.pages && <span className="text-[11px] text-gray-400">{r.pages} bet</span>}
                      </div>
                    </div>

                    {/* Type badge */}
                    <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0",
                      r.type === "PDF" ? "bg-red-50 text-[#EF4444]" : "bg-green-50 text-[#22C55E]")}>
                      {r.type}
                    </span>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 flex-shrink-0 w-24">
                      <Calendar className="w-3 h-3" />
                      {r.date}
                    </div>

                    {/* Download btn */}
                    <button className="flex items-center gap-1.5 px-3 h-8 bg-gray-50 hover:bg-[#0EA5E9] hover:text-white text-gray-600 rounded-xl text-xs font-semibold transition-all flex-shrink-0 border border-gray-200 hover:border-[#0EA5E9]">
                      <Download className="w-3.5 h-3.5" />
                      Yuklab olish
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
