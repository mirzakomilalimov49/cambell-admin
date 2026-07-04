"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Settings, Bell, Shield, Plug, Database,
  Camera, Save, Eye, EyeOff, Check, AlertTriangle,
  Smartphone, Monitor, Globe, Clock, Palette,
  Key, LogOut, Trash2, RefreshCw, Download, Upload,
  ChevronRight, Wifi, WifiOff, Plus, X, Info,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { cn } from "@/lib/utils";

/* ─── Toggle ─── */
function Toggle({ value, onChange, disabled }: { value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!value)}
      className={cn(
        "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
        value ? "bg-[#0EA5E9]" : "bg-gray-200",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <span className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
        value ? "left-6" : "left-1"
      )} />
    </button>
  );
}

/* ─── Field ─── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder, readOnly }: {
  value: string; onChange?: (v: string) => void;
  type?: string; placeholder?: string; readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "w-full h-9 px-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white text-gray-800",
        readOnly && "bg-gray-50 text-gray-500 cursor-not-allowed"
      )}
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-9 px-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] bg-white text-gray-800 appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

/* ─── SaveBar ─── */
function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
      {saved
        ? <div className="flex items-center gap-2 text-[#22C55E] text-xs font-semibold">
            <Check className="w-4 h-4" /> Muvaffaqiyatli saqlandi
          </div>
        : <div />
      }
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-5 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
      >
        <Save className="w-4 h-4" />
        Saqlash
      </button>
    </div>
  );
}

/* ─── NotifRow ─── */
function NotifRow({ label, desc, email, sms, push, app, onToggle }: {
  label: string; desc: string;
  email: boolean; sms: boolean; push: boolean; app: boolean;
  onToggle: (ch: "email" | "sms" | "push" | "app") => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div className="flex items-center gap-5 flex-shrink-0">
        {[
          { key: "email" as const, val: email  },
          { key: "sms"   as const, val: sms    },
          { key: "push"  as const, val: push   },
          { key: "app"   as const, val: app    },
        ].map(({ key, val }) => (
          <Toggle key={key} value={val} onChange={() => onToggle(key)} />
        ))}
      </div>
    </div>
  );
}

/* ─── Integration Card ─── */
function IntegCard({ name, desc, status, icon: Icon, color, bg }: {
  name: string; desc: string; status: "connected" | "disconnected" | "error";
  icon: any; color: string; bg: string;
}) {
  const st = {
    connected:    { label: "Ulangan",      dot: "bg-[#22C55E]", text: "text-[#22C55E]", badge: "bg-green-50" },
    disconnected: { label: "Ulanmagan",    dot: "bg-gray-400",   text: "text-gray-500",  badge: "bg-gray-100" },
    error:        { label: "Xato",         dot: "bg-[#EF4444]",  text: "text-[#EF4444]", badge: "bg-red-50"  },
  }[status];
  return (
    <motion.div whileHover={{ y: -1 }} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-card">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", st.badge, st.text)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
          {st.label}
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Session row ─── */
function SessionRow({ device, location, time, current }: {
  device: string; location: string; time: string; current?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Monitor className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-800">{device}</p>
          {current && (
            <span className="text-[10px] font-bold text-[#22C55E] bg-green-50 px-1.5 py-0.5 rounded-full">Joriy</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{location} · {time}</p>
      </div>
      {!current && (
        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:bg-red-50 px-3 h-7 rounded-xl transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          Chiqish
        </button>
      )}
    </div>
  );
}

/* ─── Nav items ─── */
const NAV = [
  { id: "profil",           label: "Profil",            icon: User,       desc: "Shaxsiy ma'lumotlar" },
  { id: "tizim",            label: "Tizim",             icon: Settings,   desc: "Interfeys sozlamalari" },
  { id: "bildirishnomalar", label: "Bildirishnomalar",  icon: Bell,       desc: "Xabar sozlamalari"   },
  { id: "xavfsizlik",       label: "Xavfsizlik",        icon: Shield,     desc: "Parol va kirish"     },
  { id: "integratsiya",     label: "Integratsiyalar",   icon: Plug,       desc: "Tashqi tizimlar"     },
  { id: "malumotlar",       label: "Ma'lumotlar",       icon: Database,   desc: "Zaxira va eksport"   },
];

/* ─── Main ─── */
export default function SozlamalarPage() {
  const [section, setSection] = useState("profil");

  /* Profil state */
  const [profil, setProfil] = useState({
    name: "Aziz Karimov", email: "aziz.karimov@busplant.uz",
    phone: "+998 90 123 45 67", position: "Bosh Direktor",
    department: "Boshqaruv", bio: "BUSPLANT Smart Factory bosh direktori",
  });
  const [profilSaved, setProfilSaved] = useState(false);

  /* Tizim state */
  const [tizim, setTizim] = useState({
    lang: "O'zbek", tz: "Asia/Tashkent (UTC+5)",
    dateFormat: "DD.MM.YYYY", timeFormat: "24 soat",
    theme: "Yorug'", autoLogout: "30 daqiqa", currency: "UZS (so'm)",
  });
  const [tizimSaved, setTizimSaved] = useState(false);

  /* Notif state */
  type NKey = "email"|"sms"|"push"|"app";
  const [notifs, setNotifs] = useState<Record<string, Record<NKey, boolean>>>({
    "yangi_buyurtma":   { email:true,  sms:true,  push:true,  app:true  },
    "buyurtma_status":  { email:true,  sms:false, push:true,  app:true  },
    "uskuna_nosozlik":  { email:true,  sms:true,  push:true,  app:true  },
    "kam_material":     { email:true,  sms:false, push:false, app:true  },
    "texnik_kor":       { email:false, sms:false, push:true,  app:true  },
    "reja_hisobot":     { email:true,  sms:false, push:false, app:false },
    "ai_xabar":         { email:false, sms:false, push:false, app:true  },
  });
  const [notifSaved, setNotifSaved] = useState(false);

  /* Security state */
  const [oldPass, setOldPass]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confPass, setConfPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [twoFA, setTwoFA]       = useState(false);
  const [secSaved, setSecSaved] = useState(false);

  function toggleNotif(rowKey: string, ch: NKey) {
    setNotifs(prev => ({
      ...prev,
      [rowKey]: { ...prev[rowKey], [ch]: !prev[rowKey][ch] }
    }));
  }

  function save(setFn: (v: boolean) => void) {
    setFn(true);
    setTimeout(() => setFn(false), 2500);
  }

  /* ── Profil section ── */
  function renderProfil() {
    return (
      <div className="space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Profil rasmi</h3>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold select-none">
                AK
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                <Camera className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{profil.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{profil.position}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex items-center gap-1.5 px-3 h-7 bg-[#0EA5E9] text-white rounded-xl text-xs font-semibold hover:bg-sky-600 transition-colors">
                  <Upload className="w-3 h-3" /> Yuklash
                </button>
                <button className="flex items-center gap-1.5 px-3 h-7 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors">
                  <Trash2 className="w-3 h-3" /> O'chirish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-5">Shaxsiy ma'lumotlar</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="To'liq ism">
              <Input value={profil.name} onChange={v => setProfil(p => ({ ...p, name: v }))} />
            </Field>
            <Field label="Elektron pochta">
              <Input value={profil.email} onChange={v => setProfil(p => ({ ...p, email: v }))} type="email" />
            </Field>
            <Field label="Telefon">
              <Input value={profil.phone} onChange={v => setProfil(p => ({ ...p, phone: v }))} />
            </Field>
            <Field label="Lavozim" hint="O'zgartirib bo'lmaydi">
              <Input value={profil.position} readOnly />
            </Field>
            <Field label="Bo'lim" hint="O'zgartirib bo'lmaydi">
              <Input value={profil.department} readOnly />
            </Field>
            <Field label="Rol" hint="Tizim tomonidan belgilanadi">
              <Input value="Super Admin" readOnly />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Qisqacha ma'lumot">
              <textarea
                value={profil.bio}
                onChange={e => setProfil(p => ({ ...p, bio: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 resize-none transition-all bg-white text-gray-800"
              />
            </Field>
          </div>
          <SaveBar onSave={() => save(setProfilSaved)} saved={profilSaved} />
        </div>
      </div>
    );
  }

  /* ── Tizim section ── */
  function renderTizim() {
    const themes = ["Yorug'", "Qorang'i", "Tizim"];
    return (
      <div className="space-y-5">
        {/* Theme picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Ko'rinish rejimi</h3>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t}
                onClick={() => setTizim(s => ({ ...s, theme: t }))}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-semibold",
                  tizim.theme === t
                    ? "border-[#0EA5E9] bg-sky-50 text-[#0EA5E9]"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                )}
              >
                {tizim.theme === t && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#0EA5E9] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <Palette className="w-6 h-6" />
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Regional */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-5">Mintaqaviy sozlamalar</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Interfeys tili">
              <Select value={tizim.lang} onChange={v => setTizim(s => ({ ...s, lang: v }))}
                options={["O'zbek", "Русский", "English"]} />
            </Field>
            <Field label="Vaqt zonasi">
              <Select value={tizim.tz} onChange={v => setTizim(s => ({ ...s, tz: v }))}
                options={["Asia/Tashkent (UTC+5)", "Europe/Moscow (UTC+3)", "UTC+0"]} />
            </Field>
            <Field label="Sana formati">
              <Select value={tizim.dateFormat} onChange={v => setTizim(s => ({ ...s, dateFormat: v }))}
                options={["DD.MM.YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]} />
            </Field>
            <Field label="Vaqt formati">
              <Select value={tizim.timeFormat} onChange={v => setTizim(s => ({ ...s, timeFormat: v }))}
                options={["24 soat", "12 soat (AM/PM)"]} />
            </Field>
            <Field label="Valyuta">
              <Select value={tizim.currency} onChange={v => setTizim(s => ({ ...s, currency: v }))}
                options={["UZS (so'm)", "USD ($)", "EUR (€)"]} />
            </Field>
            <Field label="Avtomatik chiqish" hint="Faoliyatsizlik vaqti">
              <Select value={tizim.autoLogout} onChange={v => setTizim(s => ({ ...s, autoLogout: v }))}
                options={["15 daqiqa", "30 daqiqa", "1 soat", "2 soat", "Hech qachon"]} />
            </Field>
          </div>
          <SaveBar onSave={() => save(setTizimSaved)} saved={tizimSaved} />
        </div>
      </div>
    );
  }

  /* ── Bildirishnomalar section ── */
  const NOTIF_ROWS = [
    { key:"yangi_buyurtma",  label:"Yangi buyurtma",            desc:"Yangi buyurtma kelganda xabar berish" },
    { key:"buyurtma_status", label:"Buyurtma statusi o'zgardi", desc:"Buyurtma holati yangilanganda xabar"  },
    { key:"uskuna_nosozlik", label:"Uskuna nosozligi",          desc:"Uskuna buzilganda yoki ta'mirda"      },
    { key:"kam_material",    label:"Kam qolgan material",       desc:"Ombor zaxirasi kritik darajada"       },
    { key:"texnik_kor",      label:"Texnik ko'rik eslatmasi",   desc:"Rejalashtirilgan texnik ko'rik"       },
    { key:"reja_hisobot",    label:"Ishlab chiqarish rejasi",   desc:"Kunlik ishlab chiqarish hisoboti"     },
    { key:"ai_xabar",        label:"AI Assistant xabarlari",    desc:"AI tomonidan aniqlangan ogohlantrish" },
  ];

  function renderBildirishnomalar() {
    return (
      <div className="space-y-5">
        {/* Channel labels */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800">Xabar kanallari</h3>
            <div className="flex items-center gap-5 text-[11px] font-bold text-gray-400 pr-1">
              <span>Email</span><span>SMS</span><span>Push</span><span>Dastur</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {NOTIF_ROWS.map(r => (
              <NotifRow
                key={r.key}
                label={r.label} desc={r.desc}
                email={notifs[r.key].email} sms={notifs[r.key].sms}
                push={notifs[r.key].push}  app={notifs[r.key].app}
                onToggle={(ch) => toggleNotif(r.key, ch)}
              />
            ))}
          </div>
          <SaveBar onSave={() => save(setNotifSaved)} saved={notifSaved} />
        </div>

        {/* Email settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Email sozlamalari</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Asosiy email">
              <Input value="aziz.karimov@busplant.uz" onChange={() => {}} />
            </Field>
            <Field label="Zaxira email">
              <Input value="a.karimov@gmail.com" onChange={() => {}} />
            </Field>
            <Field label="Email chastotasi">
              <Select value="Darhol" onChange={() => {}} options={["Darhol", "Soatlik xulosа", "Kunlik xulosa"]} />
            </Field>
            <Field label="SMS telefon">
              <Input value="+998 90 123 45 67" onChange={() => {}} />
            </Field>
          </div>
        </div>
      </div>
    );
  }

  /* ── Xavfsizlik section ── */
  function renderXavfsizlik() {
    const passStrength = newPass.length === 0 ? 0
      : newPass.length < 6 ? 1
      : newPass.length < 10 ? 2
      : /[A-Z]/.test(newPass) && /[0-9]/.test(newPass) ? 4 : 3;
    const strengthLabels = ["", "Juda zaif", "Zaif", "O'rtacha", "Kuchli"];
    const strengthColors = ["", "bg-[#EF4444]", "bg-[#F59E0B]", "bg-[#F59E0B]", "bg-[#22C55E]"];

    return (
      <div className="space-y-5">
        {/* Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-5">Parolni o'zgartirish</h3>
          <div className="space-y-4 max-w-md">
            <Field label="Joriy parol">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={oldPass} onChange={e => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 pr-10 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white"
                />
                <button onClick={() => setShowPass(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Field label="Yangi parol">
              <input
                type={showPass ? "text" : "password"}
                value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9 px-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]/30 transition-all bg-white"
              />
              {newPass && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", strengthColors[passStrength])}
                      style={{ width: `${(passStrength / 4) * 100}%` }}
                    />
                  </div>
                  <span className={cn("text-[11px] font-semibold", passStrength >= 4 ? "text-[#22C55E]" : passStrength >= 3 ? "text-[#F59E0B]" : "text-[#EF4444]")}>
                    {strengthLabels[passStrength]}
                  </span>
                </div>
              )}
            </Field>
            <Field label="Parolni tasdiqlash">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={confPass} onChange={e => setConfPass(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-9 px-3 pr-9 text-sm rounded-xl border focus:outline-none focus:ring-1 transition-all bg-white",
                    confPass && newPass !== confPass
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/30"
                      : "border-gray-200 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/30"
                  )}
                />
                {confPass && newPass === confPass && (
                  <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22C55E]" />
                )}
              </div>
              {confPass && newPass !== confPass && (
                <p className="text-[11px] text-[#EF4444] mt-1">Parollar mos kelmaydi</p>
              )}
            </Field>
          </div>
          <SaveBar onSave={() => save(setSecSaved)} saved={secSaved} />
        </div>

        {/* 2FA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Ikki bosqichli autentifikatsiya</p>
                <p className="text-xs text-gray-400 mt-0.5">SMS orqali tasdiqlash kodi</p>
              </div>
            </div>
            <Toggle value={twoFA} onChange={setTwoFA} />
          </div>
          {twoFA && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
              <Info className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Keyingi kirishda +998 90 *** 45 67 raqamiga SMS kod yuboriladi.</p>
            </div>
          )}
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">Faol seanslar</h3>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] hover:bg-red-50 px-3 h-7 rounded-xl transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Barchasidan chiqish
            </button>
          </div>
          <SessionRow device="Windows 11 · Chrome 126"    location="Toshkent, O'zbekiston" time="Hozir"          current />
          <SessionRow device="Android · BUSPLANT Ilovasi"  location="Toshkent, O'zbekiston" time="2 soat oldin"          />
          <SessionRow device="MacBook · Safari 17"         location="Toshkent, O'zbekiston" time="Kecha, 18:42"          />
        </div>
      </div>
    );
  }

  /* ── Integratsiyalar section ── */
  function renderIntegratsiya() {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800">Integratsiya kalitlari maxfiy</p>
            <p className="text-xs text-amber-600 mt-0.5">API kalitlarini hech kimga ko'rsatmang. Muammoli kalitni darhol yangilang.</p>
          </div>
        </div>

        <IntegCard name="1C:Korxona"         desc="ERP tizimi bilan sinxronizatsiya"         status="connected"    icon={Database} color="text-[#EF4444]"  bg="bg-red-50"    />
        <IntegCard name="SAP Integration"    desc="Xom ashyo va logistika boshqaruvi"        status="connected"    icon={Plug}     color="text-[#F59E0B]"  bg="bg-amber-50"  />
        <IntegCard name="Email (SMTP)"       desc="smtp.busplant.uz:587"                    status="connected"    icon={Globe}    color="text-[#0EA5E9]"  bg="bg-sky-50"    />
        <IntegCard name="SMS Gateway"        desc="Eskiz.uz SMS xizmati"                   status="connected"    icon={Smartphone} color="text-[#22C55E]" bg="bg-green-50"  />
        <IntegCard name="Power BI"           desc="Tahlil va vizualizatsiya platformasi"     status="disconnected" icon={BarChart3 as any} color="text-gray-500" bg="bg-gray-100" />
        <IntegCard name="Telegram Bot"       desc="@busplant_notify_bot"                   status="error"        icon={Key}      color="text-[#EF4444]"  bg="bg-red-50"    />

        {/* API Keys */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800">API kalitlari</h3>
            <button className="flex items-center gap-1.5 px-3 h-7 bg-[#0EA5E9] text-white rounded-xl text-xs font-semibold hover:bg-sky-600 transition-colors">
              <Plus className="w-3 h-3" /> Yangi kalit
            </button>
          </div>
          {[
            { name:"Production API Key",  key:"bsp_prod_•••••••••••••••••kX9m", date:"2026-01-15", active:true  },
            { name:"Development API Key", key:"bsp_dev_••••••••••••••••••R3pQ",  date:"2025-12-01", active:true  },
            { name:"Legacy Key",          key:"bsp_leg_••••••••••••••••••5tYw",  date:"2025-06-10", active:false },
          ].map(k => (
            <div key={k.name} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Key className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800">{k.name}</p>
                <p className="text-[11px] font-mono text-gray-400 mt-0.5">{k.key}</p>
              </div>
              <span className="text-[10px] text-gray-400">{k.date}</span>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", k.active ? "text-[#22C55E] bg-green-50" : "text-gray-400 bg-gray-100")}>
                {k.active ? "Faol" : "Faolsiz"}
              </span>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#EF4444] transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Ma'lumotlar section ── */
  function renderMalumotlar() {
    return (
      <div className="space-y-5">
        {/* Backup */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Ma'lumotlarni zaxiralash</h3>
          <div className="space-y-3">
            {[
              { label:"Avtomatik zaxira",      desc:"Har kuni 02:00 da zaxira yaratiladi",          active:true  },
              { label:"Bulutga yuklash",        desc:"Zaxira fayllarini xavfsiz bulutga saqlash",   active:true  },
              { label:"Zaxira siqish",          desc:"ZIP siqish orqali joy tejash (50% iqtisod)",  active:false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle value={item.active} onChange={() => {}} />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-700">Oxirgi zaxiralar</p>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-[#0EA5E9] hover:text-sky-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Yangilash
              </button>
            </div>
            {[
              { name:"busplant_backup_2026-07-03.zip", size:"124 MB", date:"2026-07-03 02:00", ok:true  },
              { name:"busplant_backup_2026-07-02.zip", size:"121 MB", date:"2026-07-02 02:00", ok:true  },
              { name:"busplant_backup_2026-07-01.zip", size:"118 MB", date:"2026-07-01 02:00", ok:true  },
            ].map(b => (
              <div key={b.name} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <Database className="w-4 h-4 text-[#0EA5E9] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-gray-700 truncate">{b.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{b.size} · {b.date}</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0EA5E9] px-2 h-7 rounded-xl hover:bg-sky-50 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Yuklab olish
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="flex items-center gap-2 px-4 h-9 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors">
              <Download className="w-4 h-4" /> Hozir zaxira yaratish
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Ma'lumotlarni eksport qilish</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:"Ishlab chiqarish ma'lumotlari", fmt:"Excel",  icon:Download, color:"text-[#22C55E]", bg:"bg-green-50"  },
              { label:"Buyurtmalar ro'yxati",          fmt:"PDF",    icon:Download, color:"text-[#EF4444]", bg:"bg-red-50"    },
              { label:"Ishchilar ma'lumotlari",        fmt:"Excel",  icon:Download, color:"text-[#22C55E]", bg:"bg-green-50"  },
              { label:"Moliyaviy hisobot",             fmt:"PDF",    icon:Download, color:"text-[#EF4444]", bg:"bg-red-50"    },
              { label:"Ombor inventarizatsiyasi",      fmt:"Excel",  icon:Download, color:"text-[#22C55E]", bg:"bg-green-50"  },
              { label:"To'liq ma'lumotlar bazasi",     fmt:"SQL",    icon:Download, color:"text-[#8B5CF6]", bg:"bg-purple-50" },
            ].map(e => (
              <button key={e.label} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all text-left">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", e.bg)}>
                  <e.icon className={cn("w-4 h-4", e.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{e.label}</p>
                  <p className={cn("text-[10px] font-bold", e.color)}>{e.fmt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            <h3 className="text-sm font-bold text-[#EF4444]">Xavfli zona</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-800">Kesh ma'lumotlarni tozalash</p>
                <p className="text-xs text-gray-400 mt-0.5">Tizim keshini tozalash (sahifani yangilash kerak)</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 h-8 border border-amber-200 text-[#F59E0B] hover:bg-amber-50 rounded-xl text-xs font-semibold transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Tozalash
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">Barcha ma'lumotlarni o'chirish</p>
                <p className="text-xs text-gray-400 mt-0.5">Bu amalni qaytarib bo'lmaydi. Avval zaxira yarating.</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 h-8 border border-red-200 text-[#EF4444] hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> O'chirish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sectionMap: Record<string, () => React.ReactNode> = {
    profil:           renderProfil,
    tizim:            renderTizim,
    bildirishnomalar: renderBildirishnomalar,
    xavfsizlik:       renderXavfsizlik,
    integratsiya:     renderIntegratsiya,
    malumotlar:       renderMalumotlar,
  };

  const activeNav = NAV.find(n => n.id === section)!;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5">
            <h1 className="text-xl font-bold text-gray-900">Sozlamalar</h1>
            <p className="text-xs text-gray-400 mt-0.5">Tizim va profil sozlamalari</p>
          </div>

          <div className="flex gap-5" style={{ alignItems: "flex-start" }}>
            {/* Nav sidebar */}
            <div className="w-52 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="p-2">
                {NAV.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSection(n.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-colors",
                      section === n.id
                        ? "bg-sky-50 text-[#0EA5E9]"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <n.icon className="w-4 h-4 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold truncate", section === n.id ? "text-[#0EA5E9]" : "text-gray-800")}>
                        {n.label}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">{n.desc}</p>
                    </div>
                    {section === n.id && <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-medium">BUSPLANT Admin v2.1.4</p>
                <p className="text-[10px] text-gray-300 mt-0.5">© 2026 BUSPLANT</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <activeNav.icon className="w-4 h-4 text-[#0EA5E9]" />
                <h2 className="text-sm font-bold text-gray-800">{activeNav.label}</h2>
                <span className="text-xs text-gray-400">/ {activeNav.desc}</span>
              </div>
              {sectionMap[section]?.()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* Missing import fix */
function BarChart3(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
