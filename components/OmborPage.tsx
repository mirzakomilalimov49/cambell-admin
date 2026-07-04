"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Package, AlertTriangle, CheckCircle2,
  XCircle, TrendingUp, X, Eye, ChevronDown, ChevronLeft,
  ChevronRight, Banknote, MapPin, Truck, ArrowDownCircle,
  ArrowUpCircle, BarChart3, RefreshCw,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
type StockStatus = "Yetarli" | "Kam" | "Tugagan" | "Ortiqcha";

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQty: number;
  price: number;
  location: string;
  supplier: string;
  lastUpdated: string;
}

/* ─── Data ─── */
const ITEMS: StockItem[] = [
  { id: "OM001", name: "Qoplama po'lat varaqlar",      category: "Korpus qismlari",     quantity: 450,  unit: "dona",  minQty: 100, price: 85000,    location: "A-1", supplier: "MetalPro LLC",      lastUpdated: "2026-06-28" },
  { id: "OM002", name: "Alyuminiy profillar",           category: "Korpus qismlari",     quantity: 230,  unit: "m",     minQty: 50,  price: 120000,   location: "A-2", supplier: "AluminumKG",        lastUpdated: "2026-06-25" },
  { id: "OM003", name: "Avtobus oynalari (katta)",     category: "Eshik va oynalar",    quantity: 48,   unit: "dona",  minQty: 20,  price: 650000,   location: "B-1", supplier: "GlassTech UZ",      lastUpdated: "2026-06-30" },
  { id: "OM004", name: "Avtobus eshiklari (to'liq)",   category: "Eshik va oynalar",    quantity: 12,   unit: "dona",  minQty: 8,   price: 1200000,  location: "B-2", supplier: "DoorSystems KZ",    lastUpdated: "2026-06-27" },
  { id: "OM005", name: "Avtobus shinalar (R22.5)",      category: "G'ildiraklar",        quantity: 24,   unit: "dona",  minQty: 32,  price: 980000,   location: "C-1", supplier: "Yokohama UZ",       lastUpdated: "2026-07-01" },
  { id: "OM006", name: "Elektr dvigateli (200 kW)",    category: "Dvigatel qismlari",   quantity: 6,    unit: "dona",  minQty: 4,   price: 18500000, location: "D-1", supplier: "ZF Electronics",    lastUpdated: "2026-06-29" },
  { id: "OM007", name: "Li-ion batareya (400 kWh)",    category: "Akkumulyatorlar",     quantity: 8,    unit: "dona",  minQty: 5,   price: 45000000, location: "D-2", supplier: "CATL Partner",      lastUpdated: "2026-07-01" },
  { id: "OM008", name: "Kabel to'plami (to'liq)",      category: "Elektr jihozlari",    quantity: 15,   unit: "dona",  minQty: 10,  price: 3200000,  location: "E-1", supplier: "Yazaki CIS",        lastUpdated: "2026-06-26" },
  { id: "OM009", name: "Bolt-gayka to'plami",          category: "Mahkamlash qismlari", quantity: 2500, unit: "dona",  minQty: 500, price: 1200,     location: "F-1", supplier: "Fasteners Plus",    lastUpdated: "2026-06-24" },
  { id: "OM010", name: "Oq bo'yoq (RAL 9010)",         category: "Bo'yoqlar",           quantity: 120,  unit: "litr",  minQty: 50,  price: 45000,    location: "G-1", supplier: "AkzoNobel UZ",      lastUpdated: "2026-07-02" },
  { id: "OM011", name: "Ko'k bo'yoq (RAL 5005)",       category: "Bo'yoqlar",           quantity: 28,   unit: "litr",  minQty: 30,  price: 48000,    location: "G-1", supplier: "AkzoNobel UZ",      lastUpdated: "2026-07-02" },
  { id: "OM012", name: "Grunt (epoksi asos)",          category: "Bo'yoqlar",           quantity: 80,   unit: "litr",  minQty: 40,  price: 35000,    location: "G-2", supplier: "Sherwin-Williams",  lastUpdated: "2026-06-30" },
  { id: "OM013", name: "Yo'lovchi o'rindiqlari",       category: "Salon jihozlari",     quantity: 156,  unit: "dona",  minQty: 50,  price: 850000,   location: "H-1", supplier: "ComfortSeat RU",    lastUpdated: "2026-06-22" },
  { id: "OM014", name: "Rul (elektr kuchaytirgich)",   category: "Dvigatel qismlari",   quantity: 4,    unit: "dona",  minQty: 2,   price: 4500000,  location: "D-3", supplier: "JTEKT Corp",        lastUpdated: "2026-06-28" },
  { id: "OM015", name: "Boshqaruv paneli",             category: "Elektr jihozlari",    quantity: 10,   unit: "dona",  minQty: 5,   price: 6800000,  location: "E-2", supplier: "Continental AG",    lastUpdated: "2026-06-25" },
  { id: "OM016", name: "Tormoz tizimi (to'liq)",       category: "Dvigatel qismlari",   quantity: 9,    unit: "dona",  minQty: 6,   price: 3200000,  location: "D-4", supplier: "WABCO Holdings",    lastUpdated: "2026-07-01" },
  { id: "OM017", name: "Konditsioner bloki",           category: "Salon jihozlari",     quantity: 3,    unit: "dona",  minQty: 4,   price: 8500000,  location: "H-2", supplier: "Carrier Corp",      lastUpdated: "2026-06-29" },
  { id: "OM018", name: "Gidravlik suyuqlik",           category: "Texnik suyuqliklar",  quantity: 180,  unit: "litr",  minQty: 50,  price: 18000,    location: "I-1", supplier: "Shell UZ",          lastUpdated: "2026-07-02" },
  { id: "OM019", name: "Dvigatel moyi (15W-40)",       category: "Texnik suyuqliklar",  quantity: 250,  unit: "litr",  minQty: 100, price: 22000,    location: "I-1", supplier: "Mobil UZ",          lastUpdated: "2026-07-01" },
  { id: "OM020", name: "Tozalash vositalari",          category: "Umumiy materiallar",  quantity: 0,    unit: "dona",  minQty: 20,  price: 15000,    location: "J-1", supplier: "CleanPro",          lastUpdated: "2026-06-20" },
  { id: "OM021", name: "Rezina muhrlari",              category: "Korpus qismlari",     quantity: 340,  unit: "m",     minQty: 100, price: 25000,    location: "A-3", supplier: "Trelleborg UZ",     lastUpdated: "2026-06-26" },
  { id: "OM022", name: "LED chiroqlar (salon)",        category: "Elektr jihozlari",    quantity: 180,  unit: "dona",  minQty: 60,  price: 85000,    location: "E-3", supplier: "Osram CIS",         lastUpdated: "2026-06-28" },
  { id: "OM023", name: "Sovutish tizimi (radiator)",   category: "Dvigatel qismlari",   quantity: 5,    unit: "dona",  minQty: 3,   price: 2800000,  location: "D-5", supplier: "Denso Corp",        lastUpdated: "2026-06-29" },
  { id: "OM024", name: "Shkvornya va vtulkalar",       category: "Mahkamlash qismlari", quantity: 60,   unit: "dona",  minQty: 40,  price: 180000,   location: "F-2", supplier: "Knorr-Bremse",      lastUpdated: "2026-06-27" },
];

/* ─── Constants ─── */
function getStatus(item: StockItem): StockStatus {
  if (item.quantity === 0)                return "Tugagan";
  if (item.quantity < item.minQty)        return "Kam";
  if (item.quantity > item.minQty * 4)   return "Ortiqcha";
  return "Yetarli";
}

const STATUS_META: Record<StockStatus, { color: string; bg: string; dot: string; icon: any }> = {
  "Yetarli":  { color: "text-[#22C55E]", bg: "bg-green-50",  dot: "bg-[#22C55E]", icon: CheckCircle2  },
  "Kam":      { color: "text-[#F59E0B]", bg: "bg-amber-50",  dot: "bg-[#F59E0B]", icon: AlertTriangle },
  "Tugagan":  { color: "text-[#EF4444]", bg: "bg-red-50",    dot: "bg-[#EF4444]", icon: XCircle       },
  "Ortiqcha": { color: "text-[#8B5CF6]", bg: "bg-purple-50", dot: "bg-[#8B5CF6]", icon: TrendingUp    },
};

const CATEGORY_META: Record<string, { bg: string; text: string; dot: string }> = {
  "Korpus qismlari":     { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "Eshik va oynalar":    { bg: "bg-sky-100",     text: "text-sky-700",    dot: "bg-sky-500"    },
  "G'ildiraklar":        { bg: "bg-green-100",   text: "text-green-700",  dot: "bg-green-500"  },
  "Dvigatel qismlari":   { bg: "bg-purple-100",  text: "text-purple-700", dot: "bg-purple-500" },
  "Akkumulyatorlar":     { bg: "bg-emerald-100", text: "text-emerald-700",dot: "bg-emerald-500"},
  "Elektr jihozlari":    { bg: "bg-yellow-100",  text: "text-yellow-700", dot: "bg-yellow-500" },
  "Mahkamlash qismlari": { bg: "bg-gray-100",    text: "text-gray-700",   dot: "bg-gray-500"   },
  "Bo'yoqlar":           { bg: "bg-rose-100",    text: "text-rose-700",   dot: "bg-rose-500"   },
  "Salon jihozlari":     { bg: "bg-orange-100",  text: "text-orange-700", dot: "bg-orange-500" },
  "Texnik suyuqliklar":  { bg: "bg-teal-100",    text: "text-teal-700",   dot: "bg-teal-500"   },
  "Umumiy materiallar":  { bg: "bg-slate-100",   text: "text-slate-700",  dot: "bg-slate-500"  },
};

function formatQty(qty: number, unit: string) {
  return `${qty.toLocaleString()} ${unit}`;
}
function formatPrice(p: number) {
  if (p >= 1_000_000) return `${(p / 1_000_000).toFixed(1)} mln`;
  if (p >= 1_000)     return `${(p / 1_000).toFixed(0)} ming`;
  return p.toLocaleString();
}
function formatTotal(qty: number, price: number) {
  const t = qty * price;
  if (t >= 1_000_000_000) return `${(t / 1_000_000_000).toFixed(2)} mlrd`;
  if (t >= 1_000_000)     return `${(t / 1_000_000).toFixed(1)} mln`;
  return `${(t / 1_000).toFixed(0)} ming`;
}
function totalValue(items: StockItem[]) {
  return items.reduce((s, it) => s + it.quantity * it.price, 0);
}

const CATEGORIES = ["Barchasi", ...Array.from(new Set(ITEMS.map(i => i.category))).sort()];
const STATUS_TABS: (StockStatus | "Barchasi")[] = ["Barchasi", "Yetarli", "Kam", "Tugagan", "Ortiqcha"];
const PER_PAGE = 10;

/* ─── Receive Stock Modal ─── */
function ReceiveModal({
  items,
  initialId,
  onClose,
  onSubmit,
}: {
  items: StockItem[];
  initialId: string | null;
  onClose: () => void;
  onSubmit: (id: string, qty: number) => void;
}) {
  const [selectedId, setSelectedId] = useState(initialId ?? items[0].id);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (qty > 0) onSubmit(selectedId, qty);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
              <ArrowDownCircle className="w-4 h-4 text-[#22C55E]" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Qabul qilish</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mahsulot *</label>
            <div className="relative">
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                className="w-full h-10 pl-3 pr-8 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0EA5E9] bg-white appearance-none">
                {items.map(it => <option key={it.id} value={it.id}>{it.id} — {it.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Miqdori *</label>
              <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9]" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Birlik</label>
              <input readOnly value={items.find(i => i.id === selectedId)?.unit ?? ""}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Izoh (ixtiyoriy)</label>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9]"
              placeholder="Qabul sababi yoki ta'minotchi..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit"
              className="flex-1 h-10 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <ArrowDownCircle className="w-4 h-4" />
              Qabul qilish
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-600 transition-colors">
              Bekor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ─── Item Detail Modal ─── */
function ItemDetailModal({ item, onClose }: { item: StockItem; onClose: () => void }) {
  const status = getStatus(item);
  const sm = STATUS_META[status];
  const cm = CATEGORY_META[item.category] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  const pct = Math.min((item.quantity / Math.max(item.minQty * 2, 1)) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-6 pt-5 pb-6">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{item.name}</h2>
              <p className="text-white/70 text-xs mt-1 font-mono">{item.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full", cm.bg, cm.text)}>
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Holat</span>
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", sm.color, sm.bg)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
              {status}
            </span>
          </div>

          {/* Stock level bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500 font-medium">Ombordagi miqdor</span>
              <span className="text-sm font-bold text-gray-900">{formatQty(item.quantity, item.unit)}</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", status === "Tugagan" ? "bg-[#EF4444]" : status === "Kam" ? "bg-[#F59E0B]" : status === "Ortiqcha" ? "bg-[#8B5CF6]" : "bg-[#22C55E]")}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-gray-400">0 {item.unit}</span>
              <span className="text-[11px] text-gray-400">Min: {item.minQty} {item.unit}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Joylashuvi",    value: item.location },
              { label: "Birlik narxi", value: `${formatPrice(item.price)} so'm` },
              { label: "Jami qiymat",  value: `${formatTotal(item.quantity, item.price)} so'm` },
              { label: "Min. miqdor",  value: `${item.minQty} ${item.unit}` },
              { label: "Ta'minotchi",  value: item.supplier },
              { label: "Yangilangan",  value: item.lastUpdated },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-gray-400 font-medium mb-1">{label}</p>
                <p className="text-xs font-semibold text-gray-800 leading-tight">{value}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 h-10 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Yopish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function OmborPage() {
  const [items, setItems] = useState<StockItem[]>(ITEMS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Barchasi");
  const [statusTab, setStatusTab] = useState<StockStatus | "Barchasi">("Barchasi");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [receiveId, setReceiveId] = useState<string | null>(null);
  const [showReceive, setShowReceive] = useState(false);

  const withStatus = useMemo(() => items.map(it => ({ ...it, status: getStatus(it) })), [items]);

  const filtered = useMemo(() => {
    let list = withStatus;
    if (search)             list = list.filter(it => it.name.toLowerCase().includes(search.toLowerCase()) || it.id.toLowerCase().includes(search.toLowerCase()) || it.supplier.toLowerCase().includes(search.toLowerCase()));
    if (category !== "Barchasi") list = list.filter(it => it.category === category);
    if (statusTab !== "Barchasi") list = list.filter(it => it.status === statusTab);
    return list;
  }, [withStatus, search, category, statusTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function resetPage() { setPage(1); }

  function handleReceive(id: string, qty: number) {
    setItems(list => list.map(it => it.id === id ? { ...it, quantity: it.quantity + qty, lastUpdated: "2026-07-03" } : it));
    setShowReceive(false);
    setReceiveId(null);
  }

  const lowStockItems = withStatus.filter(it => it.status === "Kam" || it.status === "Tugagan");

  /* stats */
  const totalVal = totalValue(items);
  const statsByStatus = {
    Yetarli: withStatus.filter(it => it.status === "Yetarli").length,
    Kam:     withStatus.filter(it => it.status === "Kam").length,
    Tugagan: withStatus.filter(it => it.status === "Tugagan").length,
    Ortiqcha:withStatus.filter(it => it.status === "Ortiqcha").length,
  };

  const stats = [
    { label: "Jami mahsulotlar",  value: items.length,       unit: "xil",    icon: Package,        bg: "bg-sky-50",    color: "text-[#0EA5E9]"  },
    { label: "Yetarli",           value: statsByStatus.Yetarli, unit: "ta",  icon: CheckCircle2,   bg: "bg-green-50",  color: "text-[#22C55E]"  },
    { label: "Kam qolgan",        value: statsByStatus.Kam,  unit: "ta",     icon: AlertTriangle,  bg: "bg-amber-50",  color: "text-[#F59E0B]"  },
    { label: "Tugagan",           value: statsByStatus.Tugagan, unit: "ta",  icon: XCircle,        bg: "bg-red-50",    color: "text-[#EF4444]"  },
    { label: "Jami qiymat",
      value: totalVal >= 1e9 ? `${(totalVal/1e9).toFixed(1)} mlrd` : `${(totalVal/1e6).toFixed(0)} mln`,
      unit: "so'm",               icon: Banknote,             bg: "bg-purple-50", color: "text-[#8B5CF6]" },
  ];

  /* category breakdown for right panel */
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    withStatus.forEach(it => { map[it.category] = (map[it.category] ?? 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [withStatus]);

  const selectedItem = items.find(it => it.id === selectedId);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ombor</h1>
              <p className="text-xs text-gray-400 mt-0.5">Ehtiyot qismlar va materiallar ombori</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setReceiveId(null); setShowReceive(true); }}
                className="flex items-center gap-2 px-4 h-9 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <ArrowDownCircle className="w-4 h-4" />
                Qabul qilish
              </button>
              <button className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Yangi mahsulot
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-5">
            {stats.map(s => (
              <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium mb-2 leading-snug">{s.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                      <span className="text-xs text-gray-400 font-medium">{s.unit}</span>
                    </div>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
                    <s.icon className={cn("w-5 h-5", s.color)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main: table + right panel */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>

            {/* Table card */}
            <div className="flex flex-col gap-3">
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={search} onChange={e => { setSearch(e.target.value); resetPage(); }}
                      placeholder="Mahsulot nomi, ID yoki ta'minotchi..."
                      className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30"
                    />
                  </div>
                  <div className="relative">
                    <select value={category} onChange={e => { setCategory(e.target.value); resetPage(); }}
                      className="h-9 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#0EA5E9] appearance-none cursor-pointer">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {STATUS_TABS.map(t => (
                      <button key={t} onClick={() => { setStatusTab(t); resetPage(); }}
                        className={cn("px-2.5 h-7 rounded-lg text-[11px] font-semibold transition-all",
                          statusTab === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700")}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-xs text-gray-500">
                    <span className="font-bold text-gray-800">{filtered.length}</span> ta mahsulot
                  </span>
                  <span className="text-xs text-gray-400">{page}/{totalPages} sahifa</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        {["#", "Mahsulot", "Joylashuvi", "Miqdor", "Min.", "Birlik narxi", "Holat", ""].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((it, i) => {
                        const sm = STATUS_META[it.status];
                        const cm = CATEGORY_META[it.category] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "" };
                        const isLow = it.status === "Kam" || it.status === "Tugagan";
                        return (
                          <tr key={it.id} className="border-b border-gray-50 hover:bg-gray-50/60 group transition-colors">
                            <td className="px-4 py-3 text-[11px] text-gray-400 font-mono">{(page-1)*PER_PAGE+i+1}</td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-semibold text-gray-800 leading-tight max-w-[180px]">{it.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", cm.bg, cm.text)}>{it.category}</span>
                                <span className="text-[10px] text-gray-400 font-mono">{it.id}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span className="font-mono font-semibold">{it.location}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={cn("text-sm font-bold", isLow ? "text-[#EF4444]" : "text-gray-800")}>
                                {it.quantity.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-gray-400 ml-1">{it.unit}</span>
                              {isLow && (
                                <div className="mt-0.5">
                                  <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${Math.min((it.quantity/it.minQty)*100, 100)}%` }} />
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{it.minQty} {it.unit}</td>
                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap font-medium">{formatPrice(it.price)} so'm</td>
                            <td className="px-4 py-3">
                              <span className={cn("inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", sm.color, sm.bg)}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", sm.dot)} />
                                {it.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setSelectedId(it.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sky-50 text-gray-400 hover:text-[#0EA5E9] transition-colors" title="Batafsil">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => { setReceiveId(it.id); setShowReceive(true); }} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-green-50 text-gray-400 hover:text-[#22C55E] transition-colors" title="Qabul qilish">
                                  <ArrowDownCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-500">Mahsulot topilmadi</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={cn("w-8 h-8 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors",
                          p===page ? "bg-[#0EA5E9] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50")}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col gap-3">

              {/* Low stock alerts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-xs font-bold text-gray-800">Kam qolgan mahsulotlar</h3>
                  <span className="ml-auto text-xs font-bold text-[#EF4444] bg-red-50 px-2 py-0.5 rounded-full">{lowStockItems.length} ta</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {lowStockItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CheckCircle2 className="w-6 h-6 text-[#22C55E] mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Barcha mahsulotlar yetarli</p>
                    </div>
                  ) : lowStockItems.map(it => {
                    const sm = STATUS_META[it.status];
                    return (
                      <div key={it.id} className="px-4 py-3 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-gray-800 leading-tight truncate">{it.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{it.location}</p>
                          </div>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0", sm.color, sm.bg)}>
                            {it.status}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", it.status === "Tugagan" ? "bg-[#EF4444]" : "bg-[#F59E0B]")}
                              style={{ width: it.quantity === 0 ? "0%" : `${Math.min((it.quantity/it.minQty)*100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-500 flex-shrink-0 font-medium">
                            {it.quantity}/{it.minQty} {it.unit}
                          </span>
                        </div>
                        <button
                          onClick={() => { setReceiveId(it.id); setShowReceive(true); }}
                          className="mt-2 w-full h-6 text-[10px] font-semibold text-[#22C55E] bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Qabul qilish
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden flex-1">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <BarChart3 className="w-4 h-4 text-[#0EA5E9]" />
                  <h3 className="text-xs font-bold text-gray-800">Kategoriyalar bo'yicha</h3>
                </div>
                <div className="px-4 py-3 space-y-2.5 overflow-y-auto max-h-64">
                  {categoryBreakdown.map(([cat, count]) => {
                    const cm = CATEGORY_META[cat] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
                    const pct = (count / items.length) * 100;
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", cm.bg, cm.text)}>{cat}</span>
                          <span className="text-[11px] font-bold text-gray-700">{count} ta</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", cm.dot)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats */}
              <div className="bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-white/80" />
                  <p className="text-xs font-semibold text-white/90">Ombor xulosasi</p>
                </div>
                <p className="text-2xl font-bold">
                  {totalVal >= 1e9 ? `${(totalVal/1e9).toFixed(2)} mlrd` : `${(totalVal/1e6).toFixed(0)} mln`}
                </p>
                <p className="text-xs text-white/70 mt-0.5">umumiy qiymat (so'm)</p>
                <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xl font-bold">{items.length}</p>
                    <p className="text-[10px] text-white/70">mahsulot turi</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{categoryBreakdown.length}</p>
                    <p className="text-[10px] text-white/70">kategoriya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showReceive && (
          <ReceiveModal
            key="receive"
            items={items}
            initialId={receiveId}
            onClose={() => { setShowReceive(false); setReceiveId(null); }}
            onSubmit={handleReceive}
          />
        )}
        {selectedItem && (
          <ItemDetailModal
            key="detail"
            item={selectedItem}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
