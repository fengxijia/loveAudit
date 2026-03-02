"use client";

import { motion } from "framer-motion";
import type { VerdictLevel } from "@/types";

interface VerdictProps {
  level: VerdictLevel;
  title: string;
  description: string;
}

const verdictConfig: Record<VerdictLevel, { emoji: string; color: string; glow: string; animation: string }> = {
  angel: {
    emoji: "✨",
    color: "text-green-400",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
    animation: "pulse-green",
  },
  observe: {
    emoji: "🔍",
    color: "text-yellow-400",
    glow: "shadow-[0_0_30px_rgba(234,179,8,0.3)]",
    animation: "pulse-yellow",
  },
  run: {
    emoji: "🚨",
    color: "text-red-400",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]",
    animation: "pulse-red",
  },
};

export default function Verdict({ level, title, description }: VerdictProps) {
  const config = verdictConfig[level];

  return (
    <motion.div
      className={`text-center p-8 rounded-2xl border border-purple-500/10 bg-card ${config.glow}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      style={{ animation: `${config.animation} 3s ease-in-out infinite` }}
    >
      <span className="text-5xl block mb-4">{config.emoji}</span>
      <h2 className={`text-2xl font-bold ${config.color} mb-3`}>{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
    </motion.div>
  );
}
