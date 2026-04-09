"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n";

interface InsightCardsProps {
  insights: string[];
}

export default function InsightCards({ insights }: InsightCardsProps) {
  const t = useT();
  if (!insights || insights.length === 0) return null;

  return (
    <motion.div
      className="p-6 rounded-2xl border border-primary/10 bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <p className="text-xs font-display text-neon/70 tracking-widest mb-4">{t.insightCards.title}</p>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            className="flex gap-3 text-sm text-foreground/85 leading-relaxed"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <span className="text-primary/60 shrink-0 mt-0.5">›</span>
            <span>{insight}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
