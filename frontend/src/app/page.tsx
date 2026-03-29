"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import HookCards from "@/components/landing/HookCards";

export default function LandingPage() {
  const router = useRouter();
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/v1/counter/visit", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setVisitCount(d.count))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Decorative rose ornament background */}
      <div className="rose-ornament fixed inset-0 pointer-events-none" />

      {/* Title */}
      <motion.div
        className="text-center mb-10 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          <span className="text-glow-red">LoveAudit: 亲密关系评估</span>
        </h1>
        <p className="text-xs font-mono text-neon/80 tracking-widest mt-1">
          TA真的适合和你携手一生吗？
        </p>
        <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-muted-foreground text-center text-sm mb-8 max-w-xs relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        如果你曾被以下问题困扰 <br />
        那你可能需要这个测评 ⬇️
      </motion.p>

      {/* Hook Cards */}
      <HookCards />

      {/* CTA */}
      <motion.div
        className="mt-10 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          variant="neon"
          size="lg"
          onClick={() => router.push("/assessment")}
          className="relative group"
        >
          <span className="relative z-10 font-mono tracking-wider">
            [ 开始深度扫描 ]
          </span>
          <div className="absolute inset-0 rounded-lg bg-neon/5 group-hover:bg-neon/10 transition-colors" />
        </Button>
        <p className="text-xs text-muted-foreground mt-3 font-mono">
          25 道题 · 约 4–5 分钟 · 完全匿名
        </p>
      </motion.div>

      {/* Visit counter */}
      {visitCount !== null && (
        <motion.p
          className="mt-12 text-xs text-muted-foreground/40 text-center font-mono relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          已有 {visitCount.toLocaleString()} 人访问
        </motion.p>
      )}
    </div>
  );
}
