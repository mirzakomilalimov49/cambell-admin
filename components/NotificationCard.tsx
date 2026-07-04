"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    color: "bg-[#0EA5E9]",
    dot: "bg-[#0EA5E9]",
    title: "Yangi buyurtma qabul qilindi",
    desc: "#B-2024 — 3 ta avtobus buyurtmasi",
    time: "10 daq.",
  },
  {
    id: 2,
    color: "bg-[#22C55E]",
    dot: "bg-[#22C55E]",
    title: "Ishlab chiqarish yakunlandi",
    desc: "E12 modeli — 2 ta avtobus tayyor",
    time: "45 daq.",
  },
  {
    id: 3,
    color: "bg-[#F59E0B]",
    dot: "bg-[#F59E0B]",
    title: "Ombor ogohlantirishisi",
    desc: "Ehtiyot qismlar kamaymoqda",
    time: "1 soat",
  },
  {
    id: 4,
    color: "bg-[#EF4444]",
    dot: "bg-[#EF4444]",
    title: "Texnik nosozlik aniqlandi",
    desc: "3-liniya — darhol e'tibor kerak",
    time: "2 soat",
  },
  {
    id: 5,
    color: "bg-[#8B5CF6]",
    dot: "bg-[#8B5CF6]",
    title: "Hisobot tayyor",
    desc: "May oyi ishlab chiqarish hisoboti",
    time: "3 soat",
  },
];

export default function NotificationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">So'nggi bildirishnomalar</h3>
        <span className="text-xs bg-red-50 text-red-500 font-medium px-2 py-0.5 rounded-full">
          5 yangi
        </span>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.5 + i * 0.07 }}
            className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            {/* Left color dot */}
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", n.dot)} />
              {i < notifications.length - 1 && (
                <div className="w-px flex-1 bg-gray-100" style={{ height: 20 }} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 leading-tight truncate">
                {n.title}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{n.desc}</p>
            </div>

            {/* Time */}
            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
              {n.time}
            </span>
          </motion.div>
        ))}
      </div>

      {/* View all button */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="w-full text-xs font-semibold text-[#0EA5E9] hover:text-[#0284C7] transition-colors py-1">
          Barchasini ko'rish →
        </button>
      </div>
    </motion.div>
  );
}
