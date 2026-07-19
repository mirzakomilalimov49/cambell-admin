"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Factory,
  Map,
  Users,
  Package,
  Wrench,
  Settings2,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  Bus,
  Newspaper,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Boshqaruv paneli", href: "/" },
  { icon: Handshake,       label: "CRM Tizimi",       href: "/crm" },
  { icon: ShoppingCart,    label: "Buyurtmalar",       href: "/buyurtmalar" },
  { icon: Factory,         label: "Ishlab chiqarish",  href: "/ishlab-chiqarish" },
  { icon: Map,             label: "Zavod xaritasi",    href: "/zavod-xaritasi" },
  { icon: Users,           label: "Ishchilar",         href: "/ishchilar" },
  { icon: Package,         label: "Ombor",             href: "/ombor" },
  { icon: Wrench,          label: "Uskunalar",         href: "/uskunalar" },
  { icon: Settings2,       label: "Texnik xizmat",     href: "/texnik-xizmat" },
  { icon: BarChart3,       label: "Hisobotlar",        href: "/hisobotlar" },
  { icon: Newspaper,       label: "Yangiliklar",       href: "/yangiliklar" },
  { icon: Bot,             label: "AI Assistant",      href: "/ai-assistant" },
  { icon: Settings,        label: "Sozlamalar",        href: "/sozlamalar" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-[#0EA5E9] rounded-xl flex items-center justify-center flex-shrink-0">
          <Bus className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900 leading-tight">BUSPLANT</div>
          <div className="text-[10px] text-gray-400 font-medium tracking-wide leading-tight">SMART FACTORY</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "bg-[#0EA5E9] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    isActive ? "text-white" : "text-gray-400"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-gray-100 pt-3">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Chiqish</span>
        </motion.button>
      </div>
    </aside>
  );
}
