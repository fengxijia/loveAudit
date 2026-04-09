"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import HookCards from "@/components/landing/HookCards";
import FloralBg from "@/components/landing/FloralBg";
import { useT } from "@/i18n";
import { useAppStore } from "@/store/store";

export default function LandingPage() {
  const router = useRouter();
  const t = useT();
  const { locale, setLocale } = useAppStore();
  const isEn = locale === "en";
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

      {/* Language toggle */}
      <button
        onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
        className="fixed top-5 right-12 z-50 w-14 h-14 rounded-full border-2 border-neon/60 bg-card backdrop-blur-sm text-base font-bold font-mono text-neon shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:bg-neon/10 hover:border-neon hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer flex items-center justify-center"
      >
        {t.langToggle}
      </button>

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
          <span className={`text-glow-red block sm:inline ${isEn ? "text-2xl sm:text-4xl lg:text-5xl" : "text-3xl sm:text-5xl lg:text-6xl"}`}>LoveAudit: </span>
          <span className={`text-glow-red block sm:inline mt-3 sm:mt-0 ${isEn ? "text-2xl sm:text-4xl lg:text-5xl" : "text-4xl sm:text-5xl lg:text-6xl"}`}>{t.landing.title}</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl font-display text-neon tracking-widest mt-6 sm:mt-8">
          {t.landing.subtitle}
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
        {t.landing.hookIntro}
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
            {t.landing.cta}
          </span>
          <div className="absolute inset-0 rounded-lg bg-neon/5 group-hover:bg-neon/10 transition-colors" />
        </Button>
        <p className="text-sm text-muted-foreground mt-3 font-mono">
          {t.landing.ctaSubtext}
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
          {t.landing.visitCount(visitCount)}
        </motion.p>
      )}

      {/* Bottom spacer */}
      <div className="flex-[1]" />
    </div>
  );
}
