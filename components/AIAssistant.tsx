"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";

const quickActions = [
  "Bugungi ishlab chiqarish hisoboti",
  "Buyurtmalar qanday?",
  "Texnik xizmat",
  "Ishlab chiqarish prognozi",
];

const initialMessage =
  "Salom! Men BUSPLANT AI Assistantman. Bugun sizga qanday yordam bera olaman? Ishlab chiqarish, buyurtmalar yoki texnik masalalar haqida so'rab ko'ring.";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { from: "ai", text: initialMessage },
  ]);
  const [input, setInput] = useState("");

  const handleQuickAction = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      {
        from: "ai",
        text: `"${text}" haqida ma'lumot tayyorlanmoqda...`,
      },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: input },
      { from: "ai", text: "Javob tayyorlanmoqda..." },
    ]);
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#0EA5E9] to-[#6366F1] rounded-xl flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">AI Assistant</h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-[10px] text-gray-400">Online</span>
          </div>
        </div>
        <div className="ml-auto">
          <Sparkles className="w-4 h-4 text-[#6366F1]" />
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-2.5 mb-3 min-h-0">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.from === "ai"
                  ? "bg-[#F0F9FF] text-gray-700 border border-[#E0F2FE]"
                  : "bg-[#0EA5E9] text-white"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-3">
        <p className="text-[10px] text-gray-400 font-medium mb-2">Tezkor amallar:</p>
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg bg-sky-50 text-[#0EA5E9] border border-[#BAE6FD] hover:bg-sky-100 transition-colors leading-none"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Savol yozing..."
          className="flex-1 bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none"
        />
        <button
          onClick={handleSend}
          className="w-7 h-7 bg-[#0EA5E9] rounded-lg flex items-center justify-center hover:bg-[#0284C7] transition-colors flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </motion.div>
  );
}
