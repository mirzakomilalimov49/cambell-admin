"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "9-Maj", liniya1: 18, liniya2: 12 },
  { date: "11-Maj", liniya1: 26, liniya2: 16 },
  { date: "13-Maj", liniya1: 21, liniya2: 20 },
  { date: "15-Maj", liniya1: 32, liniya2: 24 },
  { date: "17-Maj", liniya1: 24, liniya2: 19 },
  { date: "19-Maj", liniya1: 29, liniya2: 26 },
  { date: "21-Maj", liniya1: 22, liniya2: 21 },
  { date: "23-Maj", liniya1: 34, liniya2: 28 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-semibold text-gray-800">{p.value} dona</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProductionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Ishlab chiqarish statistikasi</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#0EA5E9] rounded" />
            Liniya 1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#22C55E] rounded" />
            Liniya 2
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="liniya1"
            name="Liniya 1"
            stroke="#0EA5E9"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#0EA5E9", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#0EA5E9", strokeWidth: 2, stroke: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="liniya2"
            name="Liniya 2"
            stroke="#22C55E"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#22C55E", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#22C55E", strokeWidth: 2, stroke: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
