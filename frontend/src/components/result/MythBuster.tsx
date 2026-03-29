"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MythBusterProps {
  myths: Array<{
    buzzword: string;
    realMeaning: string;
    analysis: string;
  }>;
}

export default function MythBuster({ myths }: MythBusterProps) {
  if (!myths?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-mono text-neon/80">
            💥 网红名词真相解构
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            那些让你越想越害怕的名词，真相是什么？
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {myths.map((myth, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 line-through">
                  {myth.buzzword}
                </span>
                <span className="text-xs text-muted-foreground">→</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neon/10 text-neon">
                  {myth.realMeaning}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                {myth.analysis}
              </p>
              {i < myths.length - 1 && <div className="h-px bg-primary/10" />}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
