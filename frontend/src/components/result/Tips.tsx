"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useT } from "@/i18n";

interface TipsProps {
  tips: string[];
}

export default function Tips({ tips }: TipsProps) {
  const t = useT();
  if (!tips?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display text-neon/80">
            {t.tips.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
              >
                <span className="text-rose/60 shrink-0 font-mono text-xs mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
