"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Package, Zap, Car, Wrench, Users,
  MapPin, Layers, X, ChevronRight, Activity,
  CheckCircle2, AlertTriangle, PauseCircle,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type ZoneType   = "production" | "warehouse" | "admin" | "utility" | "test" | "parking";
type ZoneStatus = "Faol" | "To'xtagan" | "Ta'mirda";

interface Zone {
  id: string;
  name: string;
  shortName: string;
  type: ZoneType;
  status: ZoneStatus;
  workers: number;
  manager: string;
  area: number;
  equipment: string[];
  description: string;
  currentOrder?: string;
  /* SVG coords */
  x: number; y: number; w: number; h: number;
}

/* ─── Zone data ─── */
const ZONES: Zone[] = [
  {
    id: "admin", name: "Ma'muriyat binosi", shortName: "Ma'muriyat",
    type: "admin", status: "Faol", workers: 15, manager: "Abdullayev Jahongir",
    area: 1800, equipment: ["Kompyuter tizimi", "Konferens xona", "Arxiv xona", "Qabul bo'limi"],
    description: "Zavod bosh ma'muriyati va boshqaruv markazi",
    x: 15, y: 15, w: 200, h: 78,
  },
  {
    id: "line1", name: "1-Liniya (Yig'ish sexi)", shortName: "1-Liniya",
    type: "production", status: "Faol", workers: 12, manager: "Karimov Botir",
    area: 2400, equipment: ["Konveyer №1", "Gidravlik lift", "Payvandlash apparati", "Yukxona krani"],
    description: "ELECTRO BUS E12 yig'ish liniyasi. Hozirda 3-avtobus yig'ilmoqda.",
    currentOrder: "B-2024-127",
    x: 15, y: 108, w: 110, h: 160,
  },
  {
    id: "line2", name: "2-Liniya (Yig'ish sexi)", shortName: "2-Liniya",
    type: "production", status: "Faol", workers: 10, manager: "Yusupov Sherzod",
    area: 2400, equipment: ["Konveyer №2", "Elektrik lift", "Vintovoy uskuna", "Kran balka"],
    description: "DIESEL BUS D8 yig'ish liniyasi. Hozirda 6-avtobus yig'ilmoqda.",
    currentOrder: "B-2024-125",
    x: 135, y: 108, w: 110, h: 160,
  },
  {
    id: "elec", name: "Elektrik montaj sexi", shortName: "Elektrik",
    type: "production", status: "Faol", workers: 9, manager: "Mirzayev Sanjar",
    area: 1600, equipment: ["Kabel taxlash stendi", "Sinovchi asbob", "Izolyatsiya mashinasi"],
    description: "Elektr tizimlarini o'rnatish va sinovdan o'tkazish bo'limi",
    x: 250, y: 108, w: 220, h: 80,
  },
  {
    id: "line3", name: "3-Liniya (Yig'ish sexi)", shortName: "3-Liniya",
    type: "production", status: "Faol", workers: 11, manager: "Holmatov Dilshod",
    area: 2400, equipment: ["Konveyer №3", "Gidravlik lift", "Bronelash uskunasi", "Kran №3"],
    description: "ELECTRO BUS E12 yig'ish liniyasi. Hozirda 2-avtobus yig'ilmoqda.",
    currentOrder: "B-2024-122",
    x: 15, y: 283, w: 110, h: 150,
  },
  {
    id: "line4", name: "4-Liniya (Yig'ish sexi)", shortName: "4-Liniya",
    type: "production", status: "Faol", workers: 9, manager: "Tursunov Ilhom",
    area: 2400, equipment: ["Konveyer №4", "Yuqori ko'taruvchi lift", "Kran №4"],
    description: "HYBRID BUS H10 yig'ish liniyasi. Hozirda 1-avtobus yig'ilmoqda.",
    currentOrder: "B-2024-118",
    x: 135, y: 283, w: 110, h: 150,
  },
  {
    id: "paint", name: "Bo'yash sexi", shortName: "Bo'yash",
    type: "production", status: "Faol", workers: 8, manager: "Razzaqov Jamshid",
    area: 2000, equipment: ["Bo'yash kamerasi", "Quritish pech", "Grunlash uskunasi", "Kompresor"],
    description: "Avtobuslarni bo'yash va pardozlash bo'limi. Uch bosqichli bo'yash tizimi.",
    x: 250, y: 198, w: 220, h: 115,
  },
  {
    id: "parts", name: "Ehtiyot qismlar ombori", shortName: "Eht. Ombor",
    type: "warehouse", status: "Faol", workers: 5, manager: "Qodirov Mansur",
    area: 3200, equipment: ["Shtabeler", "Tarozi tizimi", "Barkod skaneri", "Sovutish birliklar"],
    description: "Ishlab chiqarish uchun zarur bo'lgan barcha ehtiyot qismlar va materiallar ombori",
    x: 250, y: 15, w: 220, h: 83,
  },
  {
    id: "finished", name: "Tayyor mahsulotlar ombori", shortName: "Tayr. Ombor",
    type: "warehouse", status: "Faol", workers: 6, manager: "Ergashev Nodir",
    area: 4800, equipment: ["Avtobus yo'lak", "Sifat nazorat stendi", "GPS tizimi", "Hujjatlashtirish"],
    description: "Tayyor avtobuslarni saqlash va mijozlarga topshirishdan oldingi tekshirish hududi",
    x: 485, y: 15, w: 260, h: 168,
  },
  {
    id: "test", name: "Test maydoni", shortName: "Test",
    type: "test", status: "Faol", workers: 4, manager: "Nazarov Aziz",
    area: 6000, equipment: ["Tezlik o'lchagich", "Brake tester", "ABS sinovchi", "Diagnostika kompyuteri"],
    description: "Tayyor avtobuslarni sinov haydash va texnik parametrlarni tekshirish maydoni",
    x: 485, y: 193, w: 260, h: 250,
  },
  {
    id: "energy", name: "Energetika stansiyasi", shortName: "Energetika",
    type: "utility", status: "Faol", workers: 3, manager: "Sotvoldiyev Behruz",
    area: 600, equipment: ["Transformator", "Generator", "UPS tizimi", "Nazorat paneli"],
    description: "Zavod uchun asosiy elektr energiya ta'minoti va zaxira generatorlar",
    x: 250, y: 323, w: 105, h: 110,
  },
  {
    id: "control", name: "Nazorat punkti", shortName: "Nazorat",
    type: "utility", status: "Faol", workers: 4, manager: "Xasanov Ruslan",
    area: 120, equipment: ["CCTV tizimi", "Kirish nazorati", "Radio aloqa", "Hujjatlar"],
    description: "Zavod xavfsizlik va kirish-chiqish nazorat markazi",
    x: 365, y: 323, w: 105, h: 110,
  },
  {
    id: "line5", name: "5-Liniya (Ta'mirda)", shortName: "5-Liniya",
    type: "production", status: "Ta'mirda", workers: 0, manager: "Karimov Botir",
    area: 2400, equipment: ["Konveyer №5 (ta'mirda)", "Kran №5"],
    description: "Texnik ta'mir ishlari olib borilmoqda. Konveyer tizimi yangilanmoqda.",
    x: 15, y: 443, w: 110, h: 62,
  },
  {
    id: "line6", name: "6-Liniya (To'xtagan)", shortName: "6-Liniya",
    type: "production", status: "To'xtagan", workers: 0, manager: "Yusupov Sherzod",
    area: 2400, equipment: ["Konveyer №6", "Kran №6"],
    description: "Yangi buyurtma kelmagunicha kutish rejimida.",
    x: 135, y: 443, w: 110, h: 62,
  },
  {
    id: "parking", name: "Avtomobil parklovka", shortName: "Parking",
    type: "parking", status: "Faol", workers: 0, manager: "Xasanov Ruslan",
    area: 2800, equipment: ["Kamera tizimi", "Raqamli displej"],
    description: "Xodimlar va mehmonlar uchun avtomobil to'xtash joyi",
    x: 250, y: 443, w: 220, h: 62,
  },
];

/* ─── Constants ─── */
const ZONE_STYLE: Record<ZoneType, { fill: string; stroke: string; hoverFill: string }> = {
  production: { fill: "#DBEAFE", stroke: "#3B82F6", hoverFill: "#BFDBFE" },
  warehouse:  { fill: "#FED7AA", stroke: "#F97316", hoverFill: "#FDBA74" },
  admin:      { fill: "#E0E7FF", stroke: "#6366F1", hoverFill: "#C7D2FE" },
  utility:    { fill: "#FEF9C3", stroke: "#CA8A04", hoverFill: "#FEF08A" },
  test:       { fill: "#DCFCE7", stroke: "#16A34A", hoverFill: "#BBF7D0" },
  parking:    { fill: "#F3F4F6", stroke: "#9CA3AF", hoverFill: "#E5E7EB" },
};

const STATUS_STYLE: Record<ZoneStatus, { color: string; bg: string; dot: string; icon: any }> = {
  "Faol":       { color: "text-[#22C55E]", bg: "bg-green-50",  dot: "bg-[#22C55E]", icon: CheckCircle2  },
  "Ta'mirda":   { color: "text-[#F59E0B]", bg: "bg-amber-50",  dot: "bg-[#F59E0B]", icon: AlertTriangle },
  "To'xtagan":  { color: "text-gray-400",  bg: "bg-gray-50",   dot: "bg-gray-300",  icon: PauseCircle   },
};

const TYPE_ICON: Record<ZoneType, any> = {
  production: Building2,
  warehouse:  Package,
  admin:      Users,
  utility:    Zap,
  test:       Activity,
  parking:    Car,
};

const TYPE_LABEL: Record<ZoneType, string> = {
  production: "Ishlab chiqarish",
  warehouse:  "Ombor",
  admin:      "Ma'muriyat",
  utility:    "Kommunikatsiya",
  test:       "Sinovlar",
  parking:    "Parking",
};

/* ─── Inactive zone style ─── */
function getZoneStyle(zone: Zone, isSelected: boolean, isHovered: boolean) {
  const base = ZONE_STYLE[zone.type];
  const inactive = zone.status !== "Faol";
  if (inactive) return { fill: "#F9FAFB", stroke: "#D1D5DB" };
  if (isSelected) return { fill: base.hoverFill, stroke: base.stroke };
  if (isHovered)  return { fill: base.hoverFill, stroke: base.stroke };
  return { fill: base.fill, stroke: base.stroke };
}

/* ─── Factory SVG Map ─── */
function FactoryMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 760 520"
      className="w-full h-full"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Ground / background */}
      <rect x="0" y="0" width="760" height="520" fill="#F0FDF4" />

      {/* Outer factory fence */}
      <rect x="5" y="5" width="750" height="510" rx="8"
        fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="8 4" />

      {/* ── Roads ── */}
      {/* Horizontal main road (between top row and production) */}
      <rect x="10" y="96" width="745" height="10" rx="2" fill="#D1D5DB" />
      {/* Horizontal road between row2 and row3 */}
      <rect x="10" y="270" width="470" height="10" rx="2" fill="#D1D5DB" />
      {/* Horizontal road between row3 and bottom */}
      <rect x="10" y="435" width="470" height="6" rx="2" fill="#D1D5DB" />
      {/* Vertical road between left-production and center */}
      <rect x="230" y="96" width="16" height="340" rx="2" fill="#D1D5DB" />
      {/* Vertical road between center and right */}
      <rect x="476" y="5" width="8" height="505" fill="#D1D5DB" />
      {/* Inner horizontal (center section) */}
      <rect x="246" y="186" width="225" height="9" rx="2" fill="#E5E7EB" />
      <rect x="246" y="311" width="225" height="9" rx="2" fill="#E5E7EB" />
      {/* Vertical in center */}
      <rect x="356" y="186" width="8" height="225" rx="2" fill="#E5E7EB" />

      {/* Road markings (dashes) */}
      {[120, 160, 200, 230, 270, 310, 350, 390, 430].map(x => (
        <rect key={x} x={x} y="99" width="12" height="4" rx="1" fill="white" opacity="0.7" />
      ))}
      {[130, 160, 190].map(x => (
        <rect key={x} x={x} y="273" width="10" height="4" rx="1" fill="white" opacity="0.7" />
      ))}
      {[510, 540, 570, 600, 640, 680, 720].map(x => (
        <rect key={x} x={x} y="99" width="12" height="4" rx="1" fill="white" opacity="0.7" />
      ))}

      {/* ── Gate indicator ── */}
      <rect x="80" y="1" width="60" height="8" rx="2" fill="#0EA5E9" opacity="0.6" />
      <text x="110" y="7" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">ASOSIY KIRISH</text>

      {/* ── Render zones ── */}
      {ZONES.map(zone => {
        const isSelected = zone.id === selectedId;
        const isHovered  = zone.id === hoveredId;
        const style = getZoneStyle(zone, isSelected, isHovered);
        const inactive = zone.status !== "Faol";

        return (
          <g
            key={zone.id}
            onClick={() => onSelect(zone.id)}
            onMouseEnter={() => setHoveredId(zone.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Zone rect */}
            <rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h}
              rx="5"
              fill={style.fill}
              stroke={isSelected ? style.stroke : style.stroke}
              strokeWidth={isSelected ? 2.5 : 1.5}
              opacity={inactive ? 0.6 : 1}
              style={{ transition: "all 0.15s ease" }}
            />

            {/* Selected glow */}
            {isSelected && (
              <rect
                x={zone.x - 2} y={zone.y - 2}
                width={zone.w + 4} height={zone.h + 4}
                rx="7"
                fill="none"
                stroke={ZONE_STYLE[zone.type].stroke}
                strokeWidth="3"
                opacity="0.3"
              />
            )}

            {/* Zone label */}
            <text
              x={zone.x + zone.w / 2}
              y={zone.y + zone.h / 2 - (zone.h > 60 ? 6 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={inactive ? "#9CA3AF" : "#1F2937"}
              fontSize={zone.w < 120 ? "8" : zone.w < 180 ? "9" : "10"}
              fontWeight="600"
            >
              {zone.shortName}
            </text>

            {/* Workers count (for taller zones) */}
            {zone.h > 70 && zone.workers > 0 && (
              <text
                x={zone.x + zone.w / 2}
                y={zone.y + zone.h / 2 + 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={inactive ? "#D1D5DB" : "#6B7280"}
                fontSize="8"
              >
                {zone.workers} ishchi
              </text>
            )}

            {/* Status dot */}
            <circle
              cx={zone.x + zone.w - 9}
              cy={zone.y + 9}
              r="4.5"
              fill={
                zone.status === "Faol"      ? "#22C55E" :
                zone.status === "Ta'mirda"  ? "#F59E0B" : "#9CA3AF"
              }
              stroke="white"
              strokeWidth="1"
            />

            {/* Current order badge (for active production) */}
            {zone.currentOrder && zone.h > 80 && (
              <g>
                <rect
                  x={zone.x + 4} y={zone.y + zone.h - 18}
                  width={zone.w - 8} height={14}
                  rx="3" fill={ZONE_STYLE[zone.type].stroke} opacity="0.15"
                />
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={ZONE_STYLE[zone.type].stroke}
                  fontSize="7"
                  fontWeight="700"
                >
                  {zone.currentOrder}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* ── Legend ── */}
      <g transform="translate(10, 500)">
        {([
          ["production", "Ishlab chiqarish"],
          ["warehouse",  "Ombor"],
          ["test",       "Test maydoni"],
          ["admin",      "Ma'muriyat"],
          ["utility",    "Kommunikatsiya"],
        ] as const).map(([type, label], i) => (
          <g key={type} transform={`translate(${i * 145}, 0)`}>
            <rect x="0" y="-7" width="12" height="9" rx="2"
              fill={ZONE_STYLE[type].fill} stroke={ZONE_STYLE[type].stroke} strokeWidth="1" />
            <text x="16" y="0" fill="#6B7280" fontSize="8">{label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ─── Zone Detail Panel ─── */
function ZoneDetail({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  const s = STATUS_STYLE[zone.status];
  const Icon = TYPE_ICON[zone.type];
  const StatusIcon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div
        className="px-4 py-4 border-b border-gray-100 flex items-start justify-between gap-3"
        style={{ background: ZONE_STYLE[zone.type].fill }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: ZONE_STYLE[zone.type].stroke + "22", border: `1.5px solid ${ZONE_STYLE[zone.type].stroke}` }}
          >
            <Icon className="w-5 h-5" style={{ color: ZONE_STYLE[zone.type].stroke }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-tight">{zone.name}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{TYPE_LABEL[zone.type]}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/60 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Holat</span>
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", s.color, s.bg)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
            {zone.status}
          </span>
        </div>

        {/* Area */}
        <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-medium">Maydon</span>
          <span className="text-xs font-semibold text-gray-800">{zone.area.toLocaleString()} m²</span>
        </div>

        {/* Workers */}
        {zone.workers > 0 && (
          <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
            <span className="text-xs text-gray-400 font-medium">Ishchilar</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-800">{zone.workers} nafar</span>
            </div>
          </div>
        )}

        {/* Manager */}
        <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-medium">Mas'ul</span>
          <span className="text-xs font-semibold text-gray-800 text-right max-w-[130px] leading-tight">{zone.manager}</span>
        </div>

        {/* Current order */}
        {zone.currentOrder && (
          <div className="flex items-center justify-between py-1.5 border-t border-gray-50">
            <span className="text-xs text-gray-400 font-medium">Buyurtma</span>
            <span className="text-xs font-mono font-bold text-[#0EA5E9]">{zone.currentOrder}</span>
          </div>
        )}

        {/* Description */}
        <div className="py-1.5 border-t border-gray-50">
          <p className="text-[11px] text-gray-500 leading-relaxed">{zone.description}</p>
        </div>

        {/* Equipment */}
        <div className="border-t border-gray-50 pt-2">
          <p className="text-[11px] font-semibold text-gray-600 mb-2">Uskunalar:</p>
          <div className="space-y-1.5">
            {zone.equipment.map((eq, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] flex-shrink-0" />
                <span className="text-[11px] text-gray-600">{eq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function ZavodXaritasiPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedZone = ZONES.find(z => z.id === selectedId) ?? null;

  const totalWorkers = ZONES.reduce((s, z) => s + z.workers, 0);
  const activeZones  = ZONES.filter(z => z.status === "Faol").length;
  const totalArea    = ZONES.reduce((s, z) => s + z.area, 0);
  const maintenance  = ZONES.filter(z => z.status === "Ta'mirda").length;

  const stats = [
    { label: "Jami zonalar",     value: ZONES.length,                  unit: "ta",    iconBg: "bg-sky-50",    iconColor: "text-[#0EA5E9]",  Icon: Layers      },
    { label: "Faol zonalar",     value: activeZones,                   unit: "ta",    iconBg: "bg-green-50",  iconColor: "text-[#22C55E]",  Icon: CheckCircle2},
    { label: "Umumiy maydon",    value: (totalArea/1000).toFixed(1),   unit: "ming m²",iconBg:"bg-purple-50", iconColor: "text-[#8B5CF6]",  Icon: MapPin      },
    { label: "Jami ishchilar",   value: totalWorkers,                  unit: "nafar", iconBg: "bg-amber-50",  iconColor: "text-[#F59E0B]",  Icon: Users       },
    { label: "Ta'mirdagi zona",  value: maintenance,                   unit: "ta",    iconBg: "bg-red-50",    iconColor: "text-[#EF4444]",  Icon: Wrench      },
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
              <h1 className="text-xl font-bold text-gray-900">Zavod xaritasi</h1>
              <p className="text-xs text-gray-400 mt-0.5">BUSPLANT zavodi interaktiv binolar xaritasi</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                Faol
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                Ta'mirda
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                To'xtagan
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            {stats.map((s) => (
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
                      <span className="text-xs text-gray-400 font-medium">{s.unit}</span>
                    </div>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.iconBg)}>
                    <s.Icon className={cn("w-5 h-5", s.iconColor)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main: Map + Sidebar */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 260px" }}>

            {/* Map card */}
            <motion.div
              whileHover={{ boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
              style={{ height: "calc(100vh - 320px)", minHeight: 380 }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0EA5E9]" />
                  <h3 className="text-sm font-semibold text-gray-800">Zavod binolari xaritasi</h3>
                </div>
                <span className="text-xs text-gray-400">
                  {selectedZone ? (
                    <span className="text-[#0EA5E9] font-medium">{selectedZone.name} tanlangan</span>
                  ) : "Bino ustiga bosing"}
                </span>
              </div>
              <div className="p-4 h-[calc(100%-52px)]">
                <FactoryMap selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </motion.div>

            {/* Right: Zone list + detail */}
            <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 320px)", minHeight: 380 }}>

              {/* Zone detail */}
              <AnimatePresence mode="wait">
                {selectedZone ? (
                  <ZoneDetail
                    key={selectedZone.id}
                    zone={selectedZone}
                    onClose={() => setSelectedId(null)}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card flex flex-col items-center justify-center py-8 px-4 text-center"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                      <MapPin className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">Bino tanlang</p>
                    <p className="text-xs text-gray-400 mt-1">Xaritadagi binoga bosing</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zone list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                  <h3 className="text-xs font-semibold text-gray-700">Barcha zonalar</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {ZONES.map(zone => {
                    const s = STATUS_STYLE[zone.status];
                    const Icon = TYPE_ICON[zone.type];
                    const isActive = zone.id === selectedId;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedId(isActive ? null : zone.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left",
                          isActive && "bg-sky-50 border-sky-100"
                        )}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: ZONE_STYLE[zone.type].fill,
                            border: `1px solid ${ZONE_STYLE[zone.type].stroke}`,
                          }}
                        >
                          <Icon className="w-3 h-3" style={{ color: ZONE_STYLE[zone.type].stroke }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-[11px] font-semibold leading-tight truncate", isActive ? "text-[#0EA5E9]" : "text-gray-700")}>
                            {zone.shortName}
                          </p>
                          {zone.workers > 0 && (
                            <p className="text-[10px] text-gray-400">{zone.workers} ishchi</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                          {isActive && <ChevronRight className="w-3 h-3 text-[#0EA5E9]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
