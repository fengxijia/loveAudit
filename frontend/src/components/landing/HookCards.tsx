"use client";

import { motion } from "framer-motion";
import { useT, useLocale } from "@/i18n";

// Desktop: staircase indent; Mobile: all left-aligned
const indents = ["sm:ml-0", "sm:ml-10", "sm:ml-20", "sm:ml-30"];

export default function HookCards() {
  const t = useT();
  const locale = useLocale();
  const isEn = locale === "en";

  return (
    <div className={`flex flex-col gap-2 lg:gap-4 w-full max-w-3xl mx-auto relative z-10 pr-4 ${isEn ? "pl-4 sm:pl-10" : "pl-10 sm:pl-28"} sm:pr-0`}>
      {t.hooks.map((hook, i) => (
        <motion.div
          key={i}
          className={`flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 ${isEn ? "" : indents[i]}`}
          style={{ opacity: 0, transform: "translateX(-20px)" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.2, duration: 0.5 }}
        >
          <p className={`text-base sm:text-lg lg:text-xl text-foreground/80 font-display ${isEn ? "" : "whitespace-nowrap"}`}>
            {hook.question}
          </p>
          <span className={`text-sm sm:text-base lg:text-lg text-neon/50 font-display ${isEn ? "" : "whitespace-nowrap"}`}>
            —— {hook.subtext}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
