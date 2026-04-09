"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useT } from "@/i18n";

interface MentalHealthProps {
  user: string;
  partner: string;
}

export default function MentalHealth({ user, partner }: MentalHealthProps) {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-mono text-neon/80">
            {t.mentalHealth.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-mono text-rose/80 mb-1">{t.mentalHealth.userLabel}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{user}</p>
          </div>
          <div className="h-px bg-primary/10" />
          <div>
            <p className="text-xs font-mono text-rose/80 mb-1">{t.mentalHealth.partnerLabel}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{partner}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
