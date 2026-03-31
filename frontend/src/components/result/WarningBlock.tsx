"use client";

import { motion } from "framer-motion";

interface WarningBlockProps {
  warningBlock?: string | null;
}

export default function WarningBlock({ warningBlock }: WarningBlockProps) {
  if (!warningBlock) return null;

  return (
    <motion.div
      className="p-5 rounded-2xl border border-red-500/30 bg-red-950/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-xs font-mono text-red-400/80 tracking-widest mb-2">安全提示</p>
      <p className="text-sm text-red-200/90 leading-relaxed">{warningBlock}</p>
    </motion.div>
  );
}
