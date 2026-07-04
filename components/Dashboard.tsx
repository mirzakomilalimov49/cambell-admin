"use client";

import {
  Box,
  ClipboardList,
  Activity,
  Users,
  Banknote,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatsCard from "./StatsCard";
import ProductionChart from "./ProductionChart";
import ProgressCard from "./ProgressCard";
import BusCard from "./BusCard";
import FactoryMap from "./FactoryMap";
import NotificationCard from "./NotificationCard";
import AIAssistant from "./AIAssistant";

const stats = [
  {
    title: "Bugungi ishlab chiqarish",
    value: "14",
    unit: "dona",
    icon: Box,
    iconBg: "bg-sky-50",
    iconColor: "text-[#0EA5E9]",
  },
  {
    title: "Faol buyurtmalar",
    value: "27",
    unit: "ta",
    icon: ClipboardList,
    iconBg: "bg-orange-50",
    iconColor: "text-[#F59E0B]",
  },
  {
    title: "Ishlayotgan liniyalar",
    value: "4 / 6",
    unit: "",
    icon: Activity,
    iconBg: "bg-sky-50",
    iconColor: "text-[#0EA5E9]",
  },
  {
    title: "Ishchilar soni",
    value: "289",
    unit: "nafar",
    icon: Users,
    iconBg: "bg-green-50",
    iconColor: "text-[#22C55E]",
  },
  {
    title: "Oylik tushum",
    value: "9.8 M",
    unit: "so'm",
    icon: Banknote,
    iconBg: "bg-purple-50",
    iconColor: "text-[#8B5CF6]",
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          {/* Page title */}
          <h1 className="text-xl font-bold text-gray-900 mb-5">Boshqaruv paneli</h1>

          {/* Stats row */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            {stats.map((s, i) => (
              <StatsCard key={s.title} {...s} index={i} />
            ))}
          </div>

          {/* Row 1: Chart + Progress + Bus */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "5fr 3fr 4fr" }}>
            <ProductionChart />
            <ProgressCard />
            <BusCard />
          </div>

          {/* Row 2: Factory map + Notifications + AI */}
          <div className="grid grid-cols-3 gap-4">
            <FactoryMap />
            <NotificationCard />
            <AIAssistant />
          </div>
        </main>
      </div>
    </div>
  );
}
