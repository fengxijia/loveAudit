"use client";

import { motion } from "framer-motion";
import type { ResultType } from "@/types";

interface ResultHeroProps {
  resultType: ResultType;
  resultLabel: string;
  summaryLine: string;
}

const CONFIG: Record<string, { color: string; glow: string }> = {
  angel_couple: { color: "text-emerald-300", glow: "shadow-[0_0_30px_rgba(110,231,183,0.2)]" },
  grinding_growth: { color: "text-amber-300", glow: "shadow-[0_0_30px_rgba(252,211,77,0.2)]" },
  reality_gap: { color: "text-blue-300", glow: "shadow-[0_0_30px_rgba(147,197,253,0.2)]" },
  high_drain: { color: "text-rose-300", glow: "shadow-[0_0_30px_rgba(253,164,175,0.2)]" },
  boundary_imbalance: { color: "text-orange-300", glow: "shadow-[0_0_30px_rgba(253,186,116,0.2)]" },
  high_risk: { color: "text-red-400", glow: "shadow-[0_0_30px_rgba(248,113,113,0.2)]" },
};

const FALLBACK = { color: "text-purple-300", glow: "" };

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
      <h2 className={`text-2xl font-bold font-display ${cfg.color} mb-3`}>{resultLabel}</h2>
      {summaryLine && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto font-display">
          {summaryLine}
        </p>
      )}
    </motion.div>
  );
}
