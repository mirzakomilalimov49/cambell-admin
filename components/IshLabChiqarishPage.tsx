"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Factory, Users, Target, TrendingUp, Clock,
  Play, Pause, Wrench, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type LineStatus = "Faol" | "To'xtagan" | "Ta'mirda";

interface ProductionLine {
  id: number;
  name: string;
  status: LineStatus;
  model: string;
  orderId: string;
  stage: string;
  stageIndex: number;
  workers: number;
  progress: number;
  busNo: string;
  totalBus: number;
  completionDate: string;
}

/* ─── Static data ─── */
const STAGES = ["Gövde", "Dvigatel", "Elektrik", "Salon", "Bo'yash", "Test"];

const LINES: ProductionLine[] = [
  { id: 1, name: "1-liniya", status: "Faol",      model: "ELECTRO BUS E12", orderId: "B-2024-127", stage: "Salon",    stageIndex: 3, workers: 12, progress: 65, busNo: "3", totalBus: 5, completionDate: "14.06.2024" },
  { id: 2, name: "2-liniya", status: "Faol",      model: "DIESEL BUS D8",   orderId: "B-2024-125", stage: "Bo'yash",  stageIndex: 4, workers: 10, progress: 80, busNo: "6", totalBus: 8, completionDate: "10.06.2024" },
  { id: 3, name: "3-liniya", status: "Faol",      model: "ELECTRO BUS E12", orderId: "B-2024-122", stage: "Elektrik", stageIndex: 2, workers: 11, progress: 40, busNo: "2", totalBus: 6, completionDate: "25.07.2024" },
  { id: 4, name: "4-liniya", status: "Faol",      model: "HYBRID BUS H10",  orderId: "B-2024-118", stage: "Dvigatel", stageIndex: 1, workers: 9,  progress: 55, busNo: "1", totalBus: 2, completionDate: "15.06.2024" },
  { id: 5, name: "5-liniya", status: "To'xtagan", model: "—",               orderId: "—",          stage: "—",        stageIndex: -1, workers: 0,  progress: 0,  busNo: "—", totalBus: 0, completionDate: "—" },
  { id: 6, name: "6-liniya", status: "Ta'mirda",  model: "—",               orderId: "—",          stage: "—",        stageIndex: -1, workers: 0,  progress: 0,  busNo: "—", totalBus: 0, completionDate: "—" },
];

const WEEKLY_DATA = [
  { day: "Dush", reja: 20, bajarildi: 18 },
  { day: "Sesh", reja: 20, bajarildi: 22 },
  { day: "Chor", reja: 18, bajarildi: 15 },
  { day: "Pay",  reja: 22, bajarildi: 20 },
  { day: "Juma", reja: 20, bajarildi: 14 },
  { day: "Shan", reja: 10, bajarildi: 0  },
  { day: "Yak",  reja: 0,  bajarildi: 0  },
];
const TODAY_IDX = 4;

const SHIFTS = [
  { id: 1, label: "1-smena", time: "06:00–14:00", workers: 52 },
  { id: 2, label: "2-smena", time: "14:00–22:00", workers: 47 },
  { id: 3, label: "3-smena", time: "22:00–06:00", workers: 39 },
];

/* ─── Helpers ─── */
const LINE_STATUS_STYLE: Record<LineStatus, { color: string; bg: string; dot: string; icon: any }> = {
  "Faol":       { color: "text-[#22C55E]", bg: "bg-green-50",  dot: "bg-[#22C55E]", icon: Play   },
  "To'xtagan":  { color: "text-gray-400",  bg: "bg-gray-50",   dot: "bg-gray-300",  icon: Pause  },
  "Ta'mirda":   { color: "text-[#F59E0B]", bg: "bg-amber-50",  dot: "bg-[#F59E0B]", icon: Wrench },
};

const MODEL_COLOR: Record<string, string> = {
  "ELECTRO BUS E12": "text-[#0EA5E9]",
  "DIESEL BUS D8":   "text-[#8B5CF6]",
  "HYBRID BUS H10":  "text-[#22C55E]",
};

/* ─── Custom Tooltip ─── */
const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{p.value} dona</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Active Bus Production Card ─── */
function ActiveBusCard({ line }: { line: ProductionLine }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0EA5E9] rounded-lg flex items-center justify-center">
            <span className="text-[11px] font-bold text-white">{line.id}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-800">{line.name}</p>
            <p className={cn("text-[10px] font-semibold", MODEL_COLOR[line.model] ?? "text-gray-500")}>
              {line.model}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Avtobus</p>
          <p className="text-sm font-bold text-gray-900">{line.busNo}/{line.totalBus}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-400">Bajarilish</span>
          <span className="text-[10px] font-bold text-[#0EA5E9]">{line.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] rounded-full transition-all duration-1000"
            style={{ width: `${line.progress}%` }}
          />
        </div>
      </div>

      {/* Stage bar */}
      <div className="flex items-center gap-0.5 mb-2.5">
        {STAGES.map((s, i) => (
          <div key={s} className="flex-1 h-1 rounded-full" title={s}
            style={{
              background: i < line.stageIndex ? "#22C55E"
                : i === line.stageIndex ? "#0EA5E9"
                : "#F3F4F6"
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Hozirgi bosqich:</span>
        <span className="text-[10px] font-semibold text-[#0EA5E9] bg-sky-50 px-2 py-0.5 rounded-full">
          {line.stage}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Users className="w-3 h-3" />
          <span>{line.workers} ishchi</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{line.completionDate}</span>
        </div>
        <span className="text-[10px] font-mono text-gray-300">{line.orderId}</span>
      </div>
    </motion.div>
  );
}

/* ─── Line Status Row ─── */
function LineRow({ line }: { line: ProductionLine }) {
  const s = LINE_STATUS_STYLE[line.status];
  const Icon = s.icon;
  const isActive = line.status === "Faol";

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", isActive ? "bg-[#0EA5E9]" : "bg-gray-100")}>
            <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-gray-400")} />
          </div>
          <span className="text-sm font-semibold text-gray-800">{line.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", s.color, s.bg)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
          {line.status}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className={cn("text-xs font-semibold", MODEL_COLOR[line.model] ?? "text-gray-300")}>
          {line.model}
        </span>
      </td>
      <td className="px-4 py-3.5">
        {isActive
          ? <span className="text-xs bg-sky-50 text-[#0EA5E9] font-semibold px-2 py-0.5 rounded-full">{line.stage}</span>
          : <span className="text-xs text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3.5">
        {isActive ? (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#22C55E] rounded-full"
                style={{ width: `${line.progress}%` }} />
            </div>
            <span className="text-[11px] font-bold text-gray-600 w-8 text-right">{line.progress}%</span>
          </div>
        ) : <span className="text-xs text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3.5 h-3.5 text-gray-300" />
          <span className="font-medium">{line.workers || "—"}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="font-mono text-[11px] text-gray-400">{line.orderId}</span>
      </td>
    </tr>
  );
}

/* ─── Main Page ─── */
export default function IshLabChiqarishPage() {
  const [activeShift, setActiveShift] = useState(2);

  const activeLines  = LINES.filter(l => l.status === "Faol");
  const totalWorkers = LINES.reduce((s, l) => s + l.workers, 0);
  const weekTotal    = WEEKLY_DATA.reduce((s, d) => s + d.bajarildi, 0);
  const weekPlan     = WEEKLY_DATA.reduce((s, d) => s + d.reja, 0);

  const stats = [
    { label: "Bugungi ishlab chiqarish", value: "14",             unit: "dona",   icon: Factory,    iconBg: "bg-sky-50",    iconColor: "text-[#0EA5E9]"  },
    { label: "Faol liniyalar",           value: "4 / 6",          unit: "",        icon: Zap,        iconBg: "bg-green-50",  iconColor: "text-[#22C55E]"  },
    { label: "Haftalik bajarildi",       value: `${weekTotal}`,   unit: "dona",   icon: TrendingUp, iconBg: "bg-purple-50", iconColor: "text-[#8B5CF6]"  },
    { label: "Umumiy ishchilar",         value: `${totalWorkers}`,unit: "nafar",  icon: Users,      iconBg: "bg-amber-50",  iconColor: "text-[#F59E0B]"  },
    { label: "Haftalik reja",            value: `${weekPlan}`,    unit: "dona",   icon: Target,     iconBg: "bg-red-50",    iconColor: "text-[#EF4444]"  },
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
              <h1 className="text-xl font-bold text-gray-900">Ishlab chiqarish</h1>
              <p className="text-xs text-gray-400 mt-0.5">Liniyalar holati va ishlab chiqarish jarayoni</p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              {SHIFTS.map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => setActiveShift(sh.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors",
                    activeShift === sh.id ? "bg-[#0EA5E9] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium mb-2 leading-snug">{s.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                        {s.unit && <span className="text-xs text-gray-400 font-medium">{s.unit}</span>}
                      </div>
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.iconBg)}>
                      <Icon className={cn("w-5 h-5", s.iconColor)} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Row 1: Lines table + Weekly chart + Shifts */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "7fr 5fr" }}>

            {/* Production lines table */}
            <motion.div
              whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">Ishlab chiqarish liniyalari</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Barcha 6 ta liniya holati</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-[#22C55E] font-medium">
                    <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
                    Faol ({activeLines.length})
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400 font-medium">
                    <span className="w-2 h-2 bg-gray-300 rounded-full" />
                    Nofaol ({LINES.length - activeLines.length})
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Liniya", "Holat", "Model", "Bosqich", "Bajarilish", "Ishchilar", "Buyurtma"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap first:pl-5">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LINES.map((line) => (
                      <LineRow key={line.id} line={line} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Weekly bar chart */}
              <motion.div
                whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Haftalik statistika</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Reja va bajarilgan</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#E0F2FE]" />
                      Reja
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#0EA5E9]" />
                      Bajarildi
                    </span>
                  </div>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={3}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={36} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: "#F8FAFC" }} />
                      <Bar dataKey="reja"      name="Reja"      radius={[4,4,0,0]} fill="#E0F2FE" />
                      <Bar dataKey="bajarildi" name="Bajarildi" radius={[4,4,0,0]}>
                        {WEEKLY_DATA.map((_, i) => (
                          <Cell key={i} fill={i === TODAY_IDX ? "#F59E0B" : "#0EA5E9"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Smena info */}
              <motion.div
                whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card"
              >
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Smenalar</h3>
                <div className="space-y-2.5">
                  {SHIFTS.map((sh) => (
                    <div
                      key={sh.id}
                      onClick={() => setActiveShift(sh.id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                        sh.id === activeShift ? "bg-[#F0F9FF] border border-[#BAE6FD]" : "bg-gray-50 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-2 h-2 rounded-full", sh.id === activeShift ? "bg-[#0EA5E9]" : "bg-gray-300")} />
                        <div>
                          <p className={cn("text-xs font-semibold", sh.id === activeShift ? "text-[#0EA5E9]" : "text-gray-600")}>
                            {sh.label}
                          </p>
                          <p className="text-[10px] text-gray-400">{sh.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-800">{sh.workers}</p>
                          <p className="text-[10px] text-gray-400">ishchi</p>
                        </div>
                        {sh.id === activeShift && (
                          <span className="text-[10px] font-semibold text-[#0EA5E9] bg-sky-100 px-2 py-0.5 rounded-full">
                            Faol
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Row 2: Active bus production cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Faol ishlab chiqarish</h3>
              <p className="text-xs text-gray-400">Hozirda ishlab chiqarilayotgan avtobuslar</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {activeLines.map((line) => (
                <ActiveBusCard key={line.id} line={line} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
