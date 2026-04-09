"use client";

import { motion } from "framer-motion";
import type { Scores } from "@/types";
import { useT } from "@/i18n";

interface ScoreBarsProps {
  scores: Scores;
}

const DIMENSION_KEYS = [
  { key: "safety" as const, tKey: "safety" as const, gradient: "from-emerald-600 to-emerald-400" },
  { key: "compatibility" as const, tKey: "compatibility" as const, gradient: "from-blue-600 to-blue-400" },
  { key: "repair" as const, tKey: "repair" as const, gradient: "from-purple-600 to-purple-400" },
];

export default function ScoreBars({ scores }: ScoreBarsProps) {
  const t = useT();
  return (
    <motion.div
      className="p-6 rounded-2xl border border-primary/10 bg-card space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {DIMENSION_KEYS.map((dim, i) => {
        const value = Math.round(scores[dim.key] ?? 50);
        return (
          <div key={dim.key}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-mono text-muted-foreground">{t.scoreBars[dim.tKey]}</span>
              <span className="text-xs font-mono text-foreground/80">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${dim.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
