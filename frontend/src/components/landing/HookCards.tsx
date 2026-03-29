"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const hooks = [
  {
    question: "你是否因为伴侣提起前任而难过？",
    subtext: "你的不安可能不是小题大做",
    icon: "💔",
  },
  {
    question: "你是否被伴侣与异性的交往边界困扰？",
    subtext: "边界模糊是关系最大的隐患之一",
    icon: "🚧",
  },
  {
    question: "你是否处在一段将就的关系中，看不到未来又不想分开？",
    subtext: "沉没成本正在消耗你的生命",
    icon: "⏳",
  },
  {
    question: "你是否被NPD、血包、三角测量等概念越搞越焦虑？",
    subtext: "网红名词可能正在误导你",
    icon: "🧠",
  },
];

export default function HookCards() {
  return (
    <div className="grid gap-4 max-w-lg mx-auto">
      {hooks.map((hook, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
        >
          <Card className="p-5 relative overflow-hidden scan-line cursor-default">
            <div className="flex gap-4 items-start">
              <span className="text-2xl shrink-0">{hook.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {hook.question}
                </p>
                <p className="text-xs text-neon/70 mt-1.5 font-mono">
                  → {hook.subtext}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
