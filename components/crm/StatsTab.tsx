"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, TrendingUp, Wallet, Percent } from "lucide-react";

type Stage = "yangi" | "aloqada" | "taklif" | "kelishildi" | "yopildi" | "yutqazildi";

interface Lead {
  id: string;
  amount: number;
  stage: Stage;
}

interface Contract {
  id: string;
  amount: number;
  status: string;
}

interface Customer {
  id: string;
}

const STAGES: { key: Stage; label: string; color: string }[] = [
  { key: "yangi", label: "Yangi", color: "#0EA5E9" },
  { key: "aloqada", label: "Aloqada", color: "#8B5CF6" },
  { key: "taklif", label: "Taklif", color: "#F59E0B" },
  { key: "kelishildi", label: "Kelishildi", color: "#6366F1" },
  { key: "yopildi", label: "Yopildi", color: "#22C55E" },
  { key: "yutqazildi", label: "Yutqazildi", color: "#EF4444" },
];

function formatSum(n: number) {
  return n.toLocaleString("uz-UZ");
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-gray-500">Soni: <span className="font-semibold text-gray-800">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function StatsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [leadsRes, contractsRes, customersRes] = await Promise.all([
          fetch("/api/crm/leads"),
          fetch("/api/crm/contracts"),
          fetch("/api/crm/customers"),
        ]);
        const [leadsData, contractsData, customersData] = await Promise.all([
          leadsRes.json(),
          contractsRes.json(),
          customersRes.json(),
        ]);
        setLeads(Array.isArray(leadsData?.leads) ? leadsData.leads : []);
        setContracts(Array.isArray(contractsData?.contracts) ? contractsData.contracts : []);
        setCustomers(Array.isArray(customersData?.customers) ? customersData.customers : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400 text-center py-14">Yuklanmoqda...</p>;
  }

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === "yopildi").length;
  const lostLeads = leads.filter((l) => l.stage === "yutqazildi").length;
  const closedLeads = wonLeads + lostLeads;
  const conversion = closedLeads > 0 ? Math.round((wonLeads / closedLeads) * 100) : 0;

  const activeContractsValue = contracts
    .filter((c) => c.status === "imzolangan" || c.status === "bajarilmoqda" || c.status === "yakunlangan")
    .reduce((sum, c) => sum + c.amount, 0);

  const stats = [
    { label: "Jami leadlar", value: totalLeads, icon: TrendingUp, bg: "bg-sky-50", color: "text-[#0EA5E9]" },
    { label: "Mijozlar bazasi", value: customers.length, icon: Users, bg: "bg-purple-50", color: "text-[#8B5CF6]" },
    { label: "Shartnomalar summasi", value: `${formatSum(activeContractsValue)} so'm`, icon: Wallet, bg: "bg-green-50", color: "text-[#22C55E]" },
    { label: "Konversiya", value: `${conversion}%`, icon: Percent, bg: "bg-amber-50", color: "text-[#F59E0B]" },
  ];

  const chartData = STAGES.map((s) => ({
    stage: s.label,
    count: leads.filter((l) => l.stage === s.key).length,
    color: s.color,
  }));

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium mb-2 leading-snug">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card"
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Bosqichlar bo'yicha leadlar</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={6} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {chartData.map((d) => <Cell key={d.stage} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
