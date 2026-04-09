"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/i18n";

export default function CbtTips() {
  const t = useT();
  const tips = t.cbtTips;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tips.length]);

  return (
    <div className="relative h-32 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="text-center px-6 absolute"
        >
          <p className="text-xs font-mono text-neon/70 mb-2">
            {tips[current].title}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {tips[current].content}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
