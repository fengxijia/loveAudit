"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FloralBg from "@/components/landing/FloralBg";
import { assessmentModes } from "@/data/questions";
import { useAppStore } from "@/store/store";
import type { AssessmentMode } from "@/types";

const releaseQuestions = [
  ["你是否总会被伴侣提前任、暧昧对象或边界问题牵动？", "很多关系不是不爱，而是边界从未建立。"],
  ["你是否分不清这是正常磨合，还是已经进入长期失衡？", "真正消耗你的，常常不是冲突本身，而是反复无法修复。"],
  ["你是否总在替这段关系找理由，却越来越难安心？", "安全感、尊重和现实协作，往往比一句承诺更重要。"],
];

export default function LandingPage() {
  const router = useRouter();
  const setAssessmentMode = useAppStore((state) => state.setAssessmentMode);
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/v1/counter/visit", { method: "POST" })
      .then((response) => response.json())
      .then((data) => setVisitCount(data.count))
      .catch(() => {});
  }, []);

  const handleStart = (mode: AssessmentMode) => {
    setAssessmentMode(mode);
    router.push("/assessment");
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
      <FloralBg variant="hero" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-6 rounded-[2.25rem] border border-primary/12 bg-[rgba(255,250,243,0.96)] p-8 shadow-[0_30px_90px_rgba(28,36,50,0.08)] backdrop-blur-sm"
          >
            <div className="space-y-5 text-center">
              <h1 className="mx-auto max-w-5xl font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                HeartPath:
                <span className="text-primary"> 长期关系适配度评估</span>
              </h1>
              <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary/18 to-transparent" />
              <p className="text-lg leading-8 text-primary/78 sm:text-2xl">
                你们真的适合一起走下去吗？
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-primary/10 bg-white/86 p-6 shadow-[0_20px_60px_rgba(24,33,47,0.05)]">
              <p className="mb-5 text-center text-sm tracking-[0.2em] text-primary/68">
                如果你正在被这些问题困住
              </p>
              <div className="space-y-4">
                {releaseQuestions.map(([question, answer]) => (
                  <div
                    key={question}
                    className="grid gap-1 border-b border-primary/8 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[1.08fr_0.92fr] md:gap-5"
                  >
                    <p className="text-sm leading-7 text-foreground">{question}</p>
                    <p className="text-sm leading-7 text-muted-foreground">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-[2rem] border border-primary/12 bg-card/92 p-6 shadow-[0_28px_80px_rgba(24,33,47,0.09)] backdrop-blur-sm"
          >
            {visitCount !== null && visitCount >= 100 && (
              <div className="mb-5 flex justify-end">
                <span className="rounded-full bg-secondary px-4 py-2 text-xs text-muted-foreground">
                  累计 {visitCount.toLocaleString()} 次打开
                </span>
              </div>
            )}

            <div className="space-y-4">
              {assessmentModes.map((mode, index) => (
                <motion.button
                  key={mode.id}
                  type="button"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 + index * 0.08 }}
                  onClick={() => handleStart(mode.id)}
                  className="group w-full rounded-[1.5rem] border border-primary/12 bg-white/70 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary/70">
                        {mode.badge}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {mode.questionCount} 题
                      </span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground">
                      {mode.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex flex-col items-start gap-3">
                      <span className="rounded-full border border-primary/12 bg-card px-3 py-1 text-xs text-muted-foreground">
                        {mode.estimate}
                      </span>
                      <span className="text-foreground/85">{mode.subtitle}</span>
                    </div>
                    <span className="text-primary transition-transform duration-300 group-hover:translate-x-1">
                      进入
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
