"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import HookCards from "@/components/landing/HookCards";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-glow-purple">LoveAudit</span>
        </h1>
        <p className="text-sm font-mono text-cyan-400/80 tracking-widest">
          亲密关系深度解码系统
        </p>
        <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-muted-foreground text-center text-sm mb-8 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        如果以下任何一条让你心里一紧——<br />
        你可能需要这次测评
      </motion.p>

      {/* Hook Cards */}
      <HookCards />

      {/* CTA */}
      <motion.div
        className="mt-10 text-center"
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
          <div className="absolute inset-0 rounded-lg bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors" />
        </Button>
        <p className="text-xs text-muted-foreground mt-3 font-mono">
          19 道选择题 · 约 3 分钟 · 完全匿名
        </p>
      </motion.div>

      {/* Footer hint */}
      <motion.p
        className="mt-16 text-xs text-muted-foreground/50 text-center font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        AI 驱动 · 基于循证心理学 · 非娱乐测试
      </motion.p>
    </div>
  );
}
