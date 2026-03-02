"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MatrixRain from "@/components/analyzing/MatrixRain";
import CbtTips from "@/components/analyzing/CbtTips";
import { useAppStore } from "@/store/store";
import { useSSE } from "@/hooks/useSSE";

export default function AnalyzingPage() {
  const router = useRouter();
  const {
    answers,
    userPersonality,
    partnerPersonality,
    freeformText,
    setAnalysisResult,
    appendStreamingText,
    resetStreamingText,
    setIsAnalyzing,
  } = useAppStore();

  const hasStarted = useRef(false);

  const sseOptions = useMemo(
    () => ({
      onMessage: (data: unknown) => {
        const d = data as { content?: string };
        if (d.content) appendStreamingText(d.content);
      },
      onComplete: (result: unknown) => {
        const r = result as { result?: unknown };
        if (r.result) {
          setAnalysisResult(r.result as ReturnType<typeof useAppStore.getState>["analysisResult"] & object);
        }
        setIsAnalyzing(false);
        setTimeout(() => router.push("/result"), 500);
      },
      onError: () => {
        setIsAnalyzing(false);
        setTimeout(() => router.push("/result"), 500);
      },
    }),
    [appendStreamingText, setAnalysisResult, setIsAnalyzing, router]
  );

  const { connect } = useSSE("/api/v1/analysis/stream", sseOptions);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    if (answers.length === 0) {
      router.push("/");
      return;
    }

    resetStreamingText();
    setIsAnalyzing(true);

    const payload = {
      answers: Object.fromEntries(
        answers.map((a) => [
          String(a.questionId),
          { value: a.value, tags: a.tags },
        ])
      ),
      userPersonality,
      partnerPersonality,
      freeformText,
    };

    connect(payload);
  }, [answers, userPersonality, partnerPersonality, freeformText, connect, resetStreamingText, setIsAnalyzing, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      <MatrixRain />

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Scanning animation */}
          <div className="mb-8">
            <motion.div
              className="w-20 h-20 mx-auto rounded-full border-2 border-cyan-400/30 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 20px rgba(34,211,238,0.1)", "0 0 40px rgba(34,211,238,0.3)", "0 0 20px rgba(34,211,238,0.1)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-12 h-12 rounded-full border border-purple-500/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-glow mb-2 font-mono">
            AI 深度分析中...
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            正在交叉比对你的回答，识别关系模式
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mb-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>

        {/* CBT Tips during wait */}
        <CbtTips />
      </div>
    </div>
  );
}
