"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const PERCENTAGE = 66;
const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressCard() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const offset = CIRCUMFERENCE - (animated ? PERCENTAGE / 100 : 0) * CIRCUMFERENCE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card h-full flex flex-col"
    >
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Reja bajarilgan</h3>
      <p className="text-xs text-gray-400 mb-4">Oylik maqsad</p>

      {/* Circular progress */}
      <div className="flex items-center justify-center flex-1">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="10"
            />
            {/* Progress ring */}
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke="#22C55E"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              style={{
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{PERCENTAGE}%</span>
          </div>
        </div>
      </div>

      {/* Stats below */}
      <div className="flex gap-3 mt-4">
        <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-400 font-medium mb-1">Reja</p>
          <p className="text-base font-bold text-gray-800">220</p>
          <p className="text-[10px] text-gray-400">dona</p>
        </div>
        <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-green-500 font-medium mb-1">Bajarildi</p>
          <p className="text-base font-bold text-green-600">139</p>
          <p className="text-[10px] text-green-400">dona</p>
        </div>
      </div>
    </motion.div>
  );
}
