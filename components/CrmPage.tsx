"use client";

import { useState } from "react";
import { Handshake, Users, TrendingUp, FileText, BarChart3 } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CustomersTab from "./crm/CustomersTab";
import LeadsTab from "./crm/LeadsTab";
import ContractsTab from "./crm/ContractsTab";
import StatsTab from "./crm/StatsTab";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "mijozlar", label: "Mijozlar bazasi", icon: Users },
  { key: "leadlar", label: "Leadlar", icon: TrendingUp },
  { key: "shartnomalar", label: "Shartnomalar", icon: FileText },
  { key: "statistika", label: "Sotuv statistikasi", icon: BarChart3 },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("mijozlar");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] rounded-xl flex items-center justify-center flex-shrink-0">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CRM Tizimi</h1>
                <p className="text-xs text-gray-400">Mijozlar, leadlar, shartnomalar va sotuv statistikasi</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-5 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit shadow-card">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap",
                      active ? "bg-[#0EA5E9] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "mijozlar" && <CustomersTab />}
            {activeTab === "leadlar" && <LeadsTab />}
            {activeTab === "shartnomalar" && <ContractsTab />}
            {activeTab === "statistika" && <StatsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
