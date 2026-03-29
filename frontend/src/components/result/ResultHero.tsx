"use client";

import { motion } from "framer-motion";
import type { ResultType } from "@/types";

interface ResultHeroProps {
  resultType: ResultType;
  resultLabel: string;
  summaryLine: string;
}

const CONFIG: Record<string, { emoji: string; color: string; glow: string }> = {
  angel_couple: { emoji: "✨", color: "text-emerald-300", glow: "shadow-[0_0_30px_rgba(110,231,183,0.2)]" },
  grinding_growth: { emoji: "🔧", color: "text-amber-300", glow: "shadow-[0_0_30px_rgba(252,211,77,0.2)]" },
  reality_gap: { emoji: "🧭", color: "text-blue-300", glow: "shadow-[0_0_30px_rgba(147,197,253,0.2)]" },
  high_drain: { emoji: "🌀", color: "text-rose-300", glow: "shadow-[0_0_30px_rgba(253,164,175,0.2)]" },
  boundary_imbalance: { emoji: "⚖️", color: "text-orange-300", glow: "shadow-[0_0_30px_rgba(253,186,116,0.2)]" },
  high_risk: { emoji: "🚨", color: "text-red-400", glow: "shadow-[0_0_30px_rgba(248,113,113,0.2)]" },
};

const FALLBACK = { emoji: "🔮", color: "text-purple-300", glow: "" };

export default function ResultHero({ resultType, resultLabel, summaryLine }: ResultHeroProps) {
  const cfg = CONFIG[resultType] || FALLBACK;

  return (
    <motion.div
      className={`text-center p-8 rounded-2xl border border-primary/10 bg-card ${cfg.glow}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <p className="text-xs font-mono text-muted-foreground/60 tracking-widest mb-4">
        你的关系更像
      </p>
      <span className="text-5xl block mb-4">{cfg.emoji}</span>
      <h2 className={`text-2xl font-bold ${cfg.color} mb-3`}>{resultLabel}</h2>
      {summaryLine && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          {summaryLine}
        </p>
      )}
    </motion.div>
  );
}
