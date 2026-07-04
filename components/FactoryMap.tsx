"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

function FactorySVG() {
  return (
    <svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <rect width="320" height="220" fill="#F0FDF4" rx="8" />

      {/* Roads */}
      <rect x="140" y="0" width="24" height="220" fill="#D1D5DB" opacity="0.5" />
      <rect x="0" y="100" width="320" height="20" fill="#D1D5DB" opacity="0.5" />

      {/* Road markings */}
      {[0, 40, 80, 140, 180].map((y) => (
        <rect key={y} x="150" y={y} width="4" height="18" fill="white" opacity="0.8" />
      ))}
      {[0, 50, 110, 170, 220, 280].map((x) => (
        <rect key={x} x={x} y="108" width="22" height="4" fill="white" opacity="0.8" />
      ))}

      {/* Green areas */}
      <rect x="0" y="0" width="130" height="92" rx="4" fill="#BBF7D0" opacity="0.6" />
      <rect x="174" y="0" width="146" height="92" rx="4" fill="#BBF7D0" opacity="0.6" />
      <rect x="0" y="128" width="130" height="92" rx="4" fill="#BBF7D0" opacity="0.6" />
      <rect x="174" y="128" width="146" height="92" rx="4" fill="#BBF7D0" opacity="0.6" />

      {/* Trees top-left */}
      {[[20, 20], [50, 15], [20, 55], [80, 40], [100, 20]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#4ADE80" opacity="0.8" />
          <rect x={x - 1.5} y={y + 8} width="3" height="6" fill="#92400E" opacity="0.5" />
        </g>
      ))}

      {/* Trees top-right */}
      {[[200, 20], [240, 30], [280, 15], [220, 60], [260, 65]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#4ADE80" opacity="0.8" />
          <rect x={x - 1.5} y={y + 8} width="3" height="6" fill="#92400E" opacity="0.5" />
        </g>
      ))}

      {/* Trees bottom-left */}
      {[[20, 150], [60, 165], [100, 155], [30, 195]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#4ADE80" opacity="0.8" />
          <rect x={x - 1.5} y={y + 7} width="3" height="5" fill="#92400E" opacity="0.5" />
        </g>
      ))}

      {/* Trees bottom-right */}
      {[[200, 145], [240, 170], [280, 155], [220, 205]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#4ADE80" opacity="0.8" />
          <rect x={x - 1.5} y={y + 7} width="3" height="5" fill="#92400E" opacity="0.5" />
        </g>
      ))}

      {/* Main factory building (top-left) */}
      <rect x="8" y="18" width="118" height="64" rx="4" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
      <rect x="8" y="18" width="118" height="12" rx="4" fill="#3B82F6" />
      <rect x="8" y="22" width="118" height="8" fill="#3B82F6" />
      {/* Windows factory */}
      {[16, 40, 64, 88].map((x) => (
        <g key={x}>
          <rect x={x} y="36" width="18" height="14" rx="2" fill="#BFDBFE" />
          <rect x={x} y="58" width="18" height="14" rx="2" fill="#BFDBFE" />
        </g>
      ))}
      {/* Factory chimneys */}
      <rect x="90" y="8" width="6" height="14" rx="2" fill="#6B7280" />
      <rect x="102" y="10" width="6" height="12" rx="2" fill="#6B7280" />
      {/* Smoke */}
      <circle cx="93" cy="6" r="3" fill="#E5E7EB" opacity="0.7" />
      <circle cx="105" cy="8" r="2.5" fill="#E5E7EB" opacity="0.6" />

      {/* Warehouse (top-right) */}
      <rect x="178" y="14" width="134" height="70" rx="4" fill="#FED7AA" stroke="#F97316" strokeWidth="1.5" />
      <rect x="178" y="14" width="134" height="12" rx="4" fill="#F97316" />
      <rect x="178" y="18" width="134" height="8" fill="#F97316" />
      {/* Warehouse doors */}
      <rect x="185" y="46" width="22" height="28" rx="2" fill="#FCA5A5" stroke="#F97316" strokeWidth="1" />
      <rect x="213" y="46" width="22" height="28" rx="2" fill="#FCA5A5" stroke="#F97316" strokeWidth="1" />
      {/* Warehouse windows */}
      {[248, 278].map((x) => (
        <rect key={x} x={x} y="30" width="24" height="16" rx="2" fill="#FEF3C7" />
      ))}

      {/* Assembly shop (bottom-left) */}
      <rect x="8" y="128" width="118" height="78" rx="4" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.5" />
      <rect x="8" y="128" width="118" height="12" rx="4" fill="#7C3AED" />
      <rect x="8" y="132" width="118" height="8" fill="#7C3AED" />
      {/* Assembly windows */}
      {[16, 48, 80].map((x) => (
        <rect key={x} x={x} y="148" width="26" height="20" rx="2" fill="#DDD6FE" />
      ))}
      {[16, 48, 80].map((x) => (
        <rect key={x} x={x} y="175" width="26" height="20" rx="2" fill="#DDD6FE" />
      ))}

      {/* Paint shop (bottom-right) */}
      <rect x="178" y="128" width="134" height="78" rx="4" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
      <rect x="178" y="128" width="134" height="12" rx="4" fill="#059669" />
      <rect x="178" y="132" width="134" height="8" fill="#059669" />
      {/* Paint windows */}
      {[185, 220, 255].map((x) => (
        <rect key={x} x={x} y="148" width="24" height="18" rx="2" fill="#D1FAE5" />
      ))}
      {[185, 220, 255].map((x) => (
        <rect key={x} x={x} y="173" width="24" height="18" rx="2" fill="#D1FAE5" />
      ))}

      {/* Parking lot */}
      <rect x="295" y="128" width="20" height="78" rx="2" fill="#E5E7EB" />
      {[138, 152, 166, 180, 194].map((y) => (
        <rect key={y} x="296" y={y} width="18" height="10" rx="1" fill="#D1D5DB" />
      ))}

      {/* Location pins */}
      <g transform="translate(60,20)">
        <circle cx="7" cy="7" r="5" fill="#3B82F6" opacity="0.9" />
        <circle cx="7" cy="7" r="2.5" fill="white" />
      </g>
      <g transform="translate(230,18)">
        <circle cx="7" cy="7" r="5" fill="#F97316" opacity="0.9" />
        <circle cx="7" cy="7" r="2.5" fill="white" />
      </g>

      {/* Labels */}
      <rect x="14" y="90" width="80" height="14" rx="3" fill="white" opacity="0.9" />
      <text x="54" y="100" textAnchor="middle" fill="#1D4ED8" fontSize="8" fontWeight="700" fontFamily="sans-serif">Yig'ish sexi</text>

      <rect x="178" y="90" width="80" height="14" rx="3" fill="white" opacity="0.9" />
      <text x="218" y="100" textAnchor="middle" fill="#C2410C" fontSize="8" fontWeight="700" fontFamily="sans-serif">Ombor</text>

      <rect x="8" y="210" width="82" height="13" rx="3" fill="white" opacity="0.9" />
      <text x="49" y="219" textAnchor="middle" fill="#5B21B6" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Yig'ish liniyasi</text>

      <rect x="178" y="210" width="74" height="13" rx="3" fill="white" opacity="0.9" />
      <text x="215" y="219" textAnchor="middle" fill="#065F46" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">Bo'yash sexi</text>
    </svg>
  );
}

export default function FactoryMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Zavod xaritasi</h3>
        <div className="flex items-center gap-1 text-xs text-[#0EA5E9]">
          <MapPin className="w-3 h-3" />
          <span className="font-medium">Toshkent</span>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-gray-100">
        <FactorySVG />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#93C5FD]" />
          <span>Asosiy sex</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#FED7AA]" />
          <span>Ombor</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#A7F3D0]" />
          <span>Bo'yash</span>
        </div>
      </div>
    </motion.div>
  );
}
