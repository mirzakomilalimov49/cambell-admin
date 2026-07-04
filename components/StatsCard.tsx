"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  index: number;
}

export default function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  iconBg,
  iconColor,
  index,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card cursor-default"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium leading-snug mb-2 truncate">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
            <span className="text-sm font-medium text-gray-400">{unit}</span>
          </div>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
