"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const stages = [
  { label: "Gövde", done: true, current: false, color: "bg-[#22C55E]" },
  { label: "Bo'yash", done: true, current: false, color: "bg-[#22C55E]" },
  { label: "Elektrik", done: true, current: false, color: "bg-[#0EA5E9]" },
  { label: "Yig'ish", done: false, current: true, color: "bg-[#F59E0B]" },
  { label: "Test", done: false, current: false, color: "bg-gray-200" },
];

const PROGRESS = 72;

function BusSVG() {
  return (
    <svg viewBox="0 0 380 170" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ground shadow */}
      <ellipse cx="190" cy="166" rx="165" ry="6" fill="rgba(0,0,0,0.08)" />

      {/* Bus body */}
      <rect x="8" y="22" width="364" height="128" rx="14" fill="#1a2f5a" />

      {/* Front cap */}
      <rect x="328" y="30" width="40" height="112" rx="10" fill="#162345" />

      {/* Windshield */}
      <rect x="332" y="38" width="32" height="68" rx="6" fill="#5BB8F5" opacity="0.75" />
      <line x1="348" y1="38" x2="348" y2="106" stroke="white" strokeWidth="1" opacity="0.3" />

      {/* Passenger windows */}
      {[22, 80, 138, 196, 254].map((x) => (
        <g key={x}>
          <rect x={x} y="34" width="48" height="48" rx="6" fill="#5BB8F5" opacity="0.65" />
          <rect x={x + 2} y="36" width="44" height="4" rx="2" fill="white" opacity="0.15" />
        </g>
      ))}

      {/* Blue accent stripe */}
      <rect x="8" y="95" width="364" height="6" fill="#0EA5E9" opacity="0.45" />

      {/* Door */}
      <rect x="22" y="100" width="28" height="50" rx="3" fill="#0f1e3d" />
      <rect x="26" y="104" width="11" height="42" rx="2" fill="#4A90D9" opacity="0.55" />
      <rect x="39" y="104" width="8" height="42" rx="2" fill="#4A90D9" opacity="0.55" />

      {/* ELECTRIC text on body */}
      <text x="190" y="82" textAnchor="middle" fill="white" opacity="0.25" fontSize="11" fontWeight="700" fontFamily="sans-serif" letterSpacing="3">ELECTRO BUS E12</text>

      {/* Wheels */}
      <circle cx="72" cy="153" r="19" fill="#111827" />
      <circle cx="72" cy="153" r="11" fill="#374151" />
      <circle cx="72" cy="153" r="4" fill="#6B7280" />

      <circle cx="300" cy="153" r="19" fill="#111827" />
      <circle cx="300" cy="153" r="11" fill="#374151" />
      <circle cx="300" cy="153" r="4" fill="#6B7280" />

      {/* Front headlights */}
      <rect x="352" y="50" width="14" height="8" rx="3" fill="#FCD34D" />
      <rect x="352" y="62" width="10" height="4" rx="2" fill="#F9A8D4" opacity="0.8" />

      {/* Rear tail lights */}
      <rect x="8" y="48" width="10" height="10" rx="3" fill="#F87171" />
      <rect x="8" y="90" width="10" height="6" rx="2" fill="#FCA5A5" opacity="0.6" />

      {/* Charging port indicator */}
      <rect x="290" y="100" width="12" height="8" rx="2" fill="#34D399" />
      <text x="296" y="107" textAnchor="middle" fill="white" fontSize="6" fontWeight="700" fontFamily="sans-serif">⚡</text>
    </svg>
  );
}

export default function BusCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card h-full flex flex-col"
    >
      <div className="mb-3">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Avtobus modeli:</p>
        <h3 className="text-sm font-bold text-gray-900 mt-0.5">ELECTRO BUS E12</h3>
      </div>

      {/* Bus image */}
      <div className="flex-1 flex items-center justify-center py-1 px-2 bg-gradient-to-b from-slate-50 to-gray-100 rounded-xl min-h-[100px]">
        <BusSVG />
      </div>

      {/* Production progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">Ishlab chiqarish bosqichi</span>
          <span className="text-xs font-bold text-[#F59E0B]">{PROGRESS}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${PROGRESS}%` }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#F59E0B] rounded-full"
          />
        </div>

        {/* Stage dots */}
        <div className="flex items-center justify-between gap-1">
          {stages.map((stage, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  stage.done ? "bg-[#22C55E]" : stage.current ? "bg-[#F59E0B] ring-2 ring-[#F59E0B]/30" : "bg-gray-200"
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-medium text-center leading-tight",
                  stage.current ? "text-[#F59E0B]" : stage.done ? "text-[#22C55E]" : "text-gray-300"
                )}
              >
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
