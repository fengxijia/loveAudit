"use client";

import { motion } from "framer-motion";
import type { Reframe } from "@/types";

interface ReframeBlockProps {
  reframes: Reframe[];
}

export default function ReframeBlock({ reframes }: ReframeBlockProps) {
  if (!reframes || reframes.length === 0) return null;

  return (
    <div className="space-y-4">
      {reframes.map((item, i) => (
        <motion.div
          key={i}
          className="p-5 rounded-2xl border border-primary/10 bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}
        >
          {/* Myth */}
          <div className="mb-3">
            <p className="text-xs font-mono text-muted-foreground/60 mb-1.5">你可能以为</p>
            <p className="text-sm text-foreground/60 leading-relaxed italic">
              &ldquo;{item.myth}&rdquo;
            </p>
          </div>

          {/* Divider arrow */}
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-primary/10" />
            <span className="text-xs text-neon/80">↓</span>
            <div className="flex-1 h-px bg-primary/10" />
          </div>

          {/* Truth */}
          <div>
            <p className="text-xs font-mono text-neon/70 mb-1.5">更接近的真相</p>
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              {item.truth}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
