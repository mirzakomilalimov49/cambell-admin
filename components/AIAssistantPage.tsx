"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Plus, Bot, User, Sparkles, Package, Layers,
  Wrench, ClipboardList, BarChart3, Trash2, ChevronRight,
  Clock, CheckCircle2, AlertTriangle, TrendingUp,
  MessageSquare, Zap, RefreshCw,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timeAgo: string;
  active?: boolean;
}

/* ─── AI Responses ─── */
const RESPONSES: { keywords: string[]; text: string }[] = [
  {
    keywords: ["ishlab chiqarish", "liniya", "bugun", "holat", "production"],
    text: `📊 **Bugungi ishlab chiqarish holati** — 3-Iyul, 2026

**Faol liniyalar:** 4/6 ta
**Bugun yig'ildi:** 3 avtobus
**Kunlik reja:** 4 avtobus (75% bajarilgan)

**Liniyalar:**
• 1-liniya — Faol · B-2024-127 · 72% tayyor
• 2-liniya — Faol · B-2024-125 · 58% tayyor
• 3-liniya — Faol · B-2024-122 · 91% tayyor
• 4-liniya — Faol · B-2024-118 · 45% tayyor
• 5-liniya — ⚠️ Ta'mirda (konveyer)
• 6-liniya — ⏸ Standby rejimida

**Tavsiya:** 3-liniyada bugun 1 ta avtobus tayyor bo'ladi. Reja to'liq bajarilishi uchun kechki smena kuchaytirish tavsiya etiladi.`,
  },
  {
    keywords: ["buyurtma", "order", "kechik", "yetkazib"],
    text: `📋 **Buyurtmalar holati** — Joriy holat

**Jami faol:** 5 ta buyurtma
**Kechikayotgan:** 1 ta (B-2024-118)
**Bugun tayyor bo'ladi:** 1 ta (B-2024-122)

**Tafsilot:**
• B-2024-127 — Toshkent Shahar Transporti — 3 avtobus → 72% ✅
• B-2024-125 — Samarqand Avtobus Parki — 5 avtobus → 58% ✅
• B-2024-122 — Buxoro Viloyat — 2 avtobus → 91% 🔜 tayyor
• B-2024-118 — Andijon Shahar — 4 avtobus → 45% ⚠️ 2 kun kechikishi mumkin
• B-2024-115 — Namangan — 6 avtobus → Kutilmoqda

**Diqqat:** B-2024-118 uchun qo'shimcha resurslar ajratish kerak.`,
  },
  {
    keywords: ["ombor", "material", "zaxira", "kam", "tugagan"],
    text: `📦 **Ombor holati** — Kam qolgan mahsulotlar

**Jami mahsulot:** 24 xil
**Kritik holat:** 1 ta (Tugagan)
**Kam qolgan:** 3 ta

⛔ **Tugagan:**
• Tozalash vositalari (0/20 dona) — ZUDLIK BILAN zarur

⚠️ **Kam qolgan:**
• Avtobus shinalar R22.5 — 24/32 dona (75%)
• Ko'k bo'yoq RAL 5005 — 28/30 litr (93%)
• Konditsioner bloki — 3/4 dona (75%)

**Tavsiya:** Tozalash vositalarini bugun buyurtma qiling. Shina va bo'yoq zaxirasini to'ldirish rejalashtiring.

💰 **Umumiy ombor qiymati:** 997 mln so'm`,
  },
  {
    keywords: ["uskuna", "equipment", "ta'mir", "nosoz", "buzil"],
    text: `🔧 **Uskunalar holati** — Joriy ko'rsatkichlar

**Jami uskunalar:** 23 ta
**Ishlamoqda:** 18 ta (78%)
**Ta'mirda:** 2 ta
**Buzilgan:** 1 ta
**Standby:** 2 ta

⛔ **Zudlik talab etadi:**
• Payvandlash roboti №3 — Buzilgan (motor drayveri)

⚠️ **Ta'mirdagi:**
• Yig'ish konveyeri №5 — Ta'mirda (12 kun)
• Bo'yash kamerasi №2 — Ta'mirda (9 kun)

📅 **Yaqin ko'riklar (30 kun ichida):**
• Kompressor №1 — 12 kun qoldi
• Ko'taruvchi kran №1 — 17 kun qoldi

**OEE ko'rsatkichi:** 87% (maqsad: 90%)`,
  },
  {
    keywords: ["ishchi", "xodim", "kadr", "worker", "smena"],
    text: `👷 **Xodimlar holati** — Bugungi holat

**Jami xodimlar:** 138 nafar
**Faol (bugun):** 125 nafar (90.6%)
**Ta'tilda:** 8 nafar
**Kasal:** 5 nafar

**Smena taqsimoti (bugun):**
• I-smena (06:00–14:00) — 52 nafar ✅
• II-smena (14:00–22:00) — 48 nafar ✅
• III-smena (22:00–06:00) — 25 nafar

**Eng samarali bo'limlar:**
1. 3-liniya — 94% samaradorlik
2. 1-liniya — 92% samaradorlik
3. Test maydoni — 91% samaradorlik

**Diqqat:** 5 nafar ishchi kasal sababli yo'q. II-smenada to'ldirish tavsiya etiladi.`,
  },
  {
    keywords: ["hisobot", "report", "tahlil", "statistika"],
    text: `📊 **Hisobot yaratish** — 2026 yil I-yarim yillik

**Mavjud hisobotlar:**
• Iyun 2026 ishlab chiqarish hisoboti (PDF, 1.2 MB)
• Q2 2026 buyurtmalar tahlili (Excel, 845 KB)
• Iyun 2026 ombor inventarizatsiyasi (PDF, 632 KB)
• Q2 2026 xodimlar samaradorligi (Excel, 512 KB)

**Asosiy ko'rsatkichlar (2026 I-yarim yil):**
• Ishlab chiqarilgan: **93 avtobus** (+8.2% o'sish)
• Reja bajarilishi: **97%**
• Sifat ko'rsatkichi: **98.5%**
• Daromad: ~**48 mlrd so'm**

Hisobotlar bo'limiga o'tib barcha hujjatlarni yuklab olishingiz mumkin. Qaysi bo'lim uchun batafsil hisobot kerak?`,
  },
  {
    keywords: ["salom", "assalomu", "hello", "hi", "yordam"],
    text: `Assalomu alaykum! 👋 Men BUSPLANT Smart Factory AI yordamchisiman.

Quyidagi mavzularda yordam bera olaman:

🏭 **Ishlab chiqarish** — liniyalar holati, kunlik reja, avtobus yig'ish
📋 **Buyurtmalar** — holat, kechikishlar, mijozlar
📦 **Ombor** — zaxira darajasi, kam qolgan materiallar
🔧 **Uskunalar** — ta'mir holati, texnik ko'rik jadvali
👷 **Ishchilar** — kadrlar, smena taqsimoti, samaradorlik
📊 **Hisobotlar** — tahlil, statistika, yuklab olish

Qanday savol bor?`,
  },
];

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r.text;
  }
  return `Men sizning so'rovingizni tushundim: "${input}"\n\nBu mavzu bo'yicha qo'shimcha ma'lumot taqdim etish uchun tizimdan ma'lumot olinmoqda...\n\nSavolni aniqroq qo'yib ko'ring yoki quyidagi mavzulardan birini tanlang: **ishlab chiqarish**, **buyurtmalar**, **ombor**, **uskunalar**, **ishchilar**, **hisobotlar**.`;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Message bubble ─── */
function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line === "") return <div key={i} className="h-1.5" />;

    // Parse **bold**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((p, j) =>
      p.startsWith("**") && p.endsWith("**")
        ? <strong key={j} className="font-semibold text-gray-900">{p.slice(2, -2)}</strong>
        : p
    );

    if (line.startsWith("•")) {
      return (
        <div key={i} className="flex gap-2 leading-snug mt-0.5">
          <span className="text-[#0EA5E9] mt-0.5 flex-shrink-0">•</span>
          <span>{rendered}</span>
        </div>
      );
    }
    if (line.startsWith("⛔") || line.startsWith("⚠️") || line.startsWith("📅") || line.startsWith("💰")) {
      return <p key={i} className="mt-2 leading-snug font-medium">{rendered}</p>;
    }
    if (/^\d+\./.test(line)) {
      return <p key={i} className="mt-0.5 leading-snug">{rendered}</p>;
    }
    return <p key={i} className="leading-snug">{rendered}</p>;
  });
}

/* ─── Typing indicator ─── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ─── Conversation list item ─── */
const CONVS: Conversation[] = [
  { id:"c1", title:"Ishlab chiqarish holati",    preview:"Bugungi 4 ta liniya faol...",          timeAgo:"Hozir",        active: true },
  { id:"c2", title:"Buyurtma B-2024-127",        preview:"Toshkent uchun 3 avtobus yig'ilmoqda", timeAgo:"2 soat oldin"            },
  { id:"c3", title:"Uskuna nosozligi",           preview:"Payvandlash roboti №3 buzilgan",       timeAgo:"Kecha"                   },
  { id:"c4", title:"Haftalik statistika",        preview:"Bu haftada 12 avtobus...",             timeAgo:"3 kun oldin"             },
  { id:"c5", title:"Ombor inventarizatsiyasi",   preview:"24 xil mahsulotdan 4 ta kam...",       timeAgo:"1 hafta oldin"           },
];

const QUICK_PROMPTS = [
  { label:"Ishlab chiqarish holati?",   icon: Layers,       color:"text-[#0EA5E9]",  bg:"bg-sky-50"    },
  { label:"Kechikayotgan buyurtmalar?", icon: ClipboardList, color:"text-[#F59E0B]", bg:"bg-amber-50"  },
  { label:"Kam qolgan materiallar?",   icon: Package,       color:"text-[#EF4444]",  bg:"bg-red-50"    },
  { label:"Uskunalar texnik holati?",  icon: Wrench,        color:"text-[#8B5CF6]",  bg:"bg-purple-50" },
  { label:"Bugungi xodimlar holati?",  icon: BarChart3,     color:"text-[#22C55E]",  bg:"bg-green-50"  },
  { label:"Hisobot yarating",          icon: TrendingUp,    color:"text-[#6366F1]",  bg:"bg-indigo-50" },
];

const INIT_MESSAGES: Message[] = [
  {
    id: "m0",
    role: "assistant",
    content: `Assalomu alaykum! 👋 Men BUSPLANT Smart Factory AI yordamchisiman.

Quyidagi mavzularda yordam bera olaman:

🏭 **Ishlab chiqarish** — liniyalar holati, kunlik reja, avtobus yig'ish
📋 **Buyurtmalar** — holat, kechikishlar, mijozlar
📦 **Ombor** — zaxira darajasi, kam qolgan materiallar
🔧 **Uskunalar** — ta'mir holati, texnik ko'rik jadvali
👷 **Ishchilar** — kadrlar, smena taqsimoti, samaradorlik
📊 **Hisobotlar** — tahlil, statistika, yuklab olish

Qanday savol bor?`,
    time: "08:00",
  },
];

/* ─── Main Page ─── */
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeConv, setActiveConv] = useState("c1");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;

    const userMsg: Message = {
      id: `u${Date.now()}`,
      role: "user",
      content: msg,
      time: formatTime(new Date()),
    };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `a${Date.now()}`,
        role: "assistant",
        content: getAIResponse(msg),
        time: formatTime(new Date()),
      };
      setMessages(m => [...m, aiMsg]);
      setIsTyping(false);
    }, 1400);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMessages(INIT_MESSAGES);
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      {/* ── Conversation sidebar ── */}
      <div className="w-60 flex flex-col bg-white border-r border-gray-100 flex-shrink-0">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">AI Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-[10px] text-gray-400">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-center gap-2 h-8 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Yangi suhbat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Oxirgi suhbatlar</p>
          {CONVS.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv.id)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-colors",
                activeConv === conv.id ? "bg-sky-50 border border-sky-100" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={cn("text-xs font-semibold truncate leading-snug", activeConv === conv.id ? "text-[#0EA5E9]" : "text-gray-700")}>
                  {conv.title}
                </p>
                <span className="text-[9px] text-gray-400 flex-shrink-0 mt-0.5">{conv.timeAgo}</span>
              </div>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{conv.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">BUSPLANT AI</p>
              <p className="text-[11px] text-gray-400">Claude Sonnet 4.6 · Zavod ma'lumotlar bazasi bilan ulangan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-medium bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Faol
            </div>
            <button onClick={clearChat} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Suhbatni tozalash">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              {/* Avatar */}
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 self-end",
                msg.role === "user"
                  ? "bg-gradient-to-br from-gray-700 to-gray-900"
                  : "bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6]")}>
                {msg.role === "user"
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-white" />
                }
              </div>

              {/* Bubble */}
              <div className={cn("max-w-[70%] flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#0EA5E9] text-white rounded-br-sm"
                    : "bg-white border border-gray-100 shadow-sm text-gray-700 rounded-bl-sm"
                )}>
                  {msg.role === "assistant"
                    ? <div className="text-xs space-y-0.5">{renderContent(msg.content)}</div>
                    : <p className="text-sm">{msg.content}</p>
                  }
                </div>
                <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3">
            <p className="text-xs text-gray-400 font-medium mb-2">Tezkor savollar:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q.label}
                  onClick={() => send(q.label)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors",
                    q.color
                  )}
                >
                  <q.icon className="w-3.5 h-3.5" />
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="px-6 pb-5">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-[#0EA5E9] focus-within:ring-1 focus-within:ring-[#0EA5E9]/30 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Savol yozing... (Enter — yuborish, Shift+Enter — yangi qator)"
              rows={1}
              className="w-full px-4 pt-3.5 pb-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none bg-transparent"
              style={{ minHeight: 48, maxHeight: 120 }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Zavod ma'lumotlari bilan ishlayapti</span>
              </div>
              <button
                onClick={() => send()}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-xl transition-all",
                  input.trim() && !isTyping
                    ? "bg-[#0EA5E9] hover:bg-sky-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            AI noto'g'ri ma'lumot berishi mumkin. Muhim qarorlar uchun rasmiy ma'lumotlarni tekshiring.
          </p>
        </div>
      </div>
    </div>
  );
}
