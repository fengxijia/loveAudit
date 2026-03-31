"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import HookCards from "@/components/landing/HookCards";
import FloralBg from "@/components/landing/FloralBg";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative">
      {/* Decorative mandala & rose line art background */}
      <FloralBg />

      {/* Top spacer — push all content to lower portion */}
      <div className="flex-[10] sm:flex-[4] lg:flex-[1]" />

      {/* Title */}
      <motion.div
        className="text-center mb-6 lg:mb-8 relative z-10 -mt-0 sm:mt-0"
        style={{ opacity: 0, transform: "translateY(-20px)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-bold mb-2 font-display">
          <span className="text-glow-red text-3xl sm:text-5xl lg:text-6xl block sm:inline">LoveAudit: </span>
          <span className="text-glow-red text-4xl sm:text-5xl lg:text-6xl block sm:inline mt-3 sm:mt-0">终身伴侣适配度评估</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl font-display text-neon tracking-widest mt-6 sm:mt-8">
          TA真的适合和你携手一生吗？
        </p>
        <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-muted-foreground text-center text-base lg:text-lg mb-6 lg:mb-8 max-w-md relative z-10 font-display"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        如果你也有以下困扰，试试这个测评
      </motion.p>

      {/* Hook Cards */}
      <HookCards />

      {/* CTA */}
      <motion.div
        className="mt-8 lg:mt-10 text-center relative z-10"
        style={{ opacity: 0, transform: "translateY(20px)" }}
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
        <p className="text-sm text-muted-foreground mt-3 font-mono">
          25 道题 · 约 4–5 分钟 · 完全匿名
        </p>
      </motion.div>

      {/* Visit counter */}
      {visitCount !== null && (
        <motion.p
          className="mt-8 text-xs text-muted-foreground/70 text-center font-mono relative z-10 bg-background/60 backdrop-blur-sm px-4 py-1.5 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          已有 {visitCount.toLocaleString()} 人访问
        </motion.p>
      )}

      {/* Bottom spacer */}
      <div className="flex-[1]" />
    </div>
  );
}
