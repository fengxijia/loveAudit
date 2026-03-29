"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MatrixRain from "@/components/analyzing/MatrixRain";
import CbtTips from "@/components/analyzing/CbtTips";
import { useAppStore, useHydrated } from "@/store/store";
import { useSSE } from "@/hooks/useSSE";
import { Button } from "@/components/ui/button";
import { questions } from "@/data/questions";
import type { AnalysisResult } from "@/types";

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

  const hydrated = useHydrated();
  const hasStarted = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sseOptions = useMemo(
    () => ({
      timeoutMs: 90000,
      onMessage: (data: unknown) => {
        const d = data as { content?: string };
        if (d.content) appendStreamingText(d.content);
      },
      onComplete: (result: unknown) => {
        const r = result as { result?: AnalysisResult; text?: string };
        if (r.result) {
          setAnalysisResult(r.result);
        } else if (r.text) {
          appendStreamingText(r.text);
        }
        setIsAnalyzing(false);
        setTimeout(() => router.push("/result"), 500);
      },
      onError: (err: Error) => {
        setIsAnalyzing(false);
        setErrorMsg(err.message || "分析失败，请重试");
      },
    }),
    [appendStreamingText, setAnalysisResult, setIsAnalyzing, router]
  );

  const { connect, disconnect } = useSSE("/api/v1/analysis/stream", sseOptions);

  const startAnalysis = useCallback(() => {
    if (answers.length === 0) {
      router.push("/");
      return;
    }

    setErrorMsg(null);
    resetStreamingText();
    setIsAnalyzing(true);

    // Build payload with full question text + selected label for LLM context
    const payload = {
      answers: Object.fromEntries(
        answers.map((a) => {
          const q = questions.find((qq) => qq.id === a.questionId);
          const selectedChoice = q?.choices?.find((c) => c.value === a.value);
          return [
            String(a.questionId),
            {
              value: a.value,
              tags: a.tags,
              questionText: q?.question || "",
              selectedLabel: selectedChoice?.label || a.value,
            },
          ];
        })
      ),
      userPersonality,
      partnerPersonality,
      freeformText,
    };

    connect(payload);
  }, [answers, userPersonality, partnerPersonality, freeformText, connect, resetStreamingText, setIsAnalyzing, router]);

  useEffect(() => {
    if (!hydrated || hasStarted.current) return;
    hasStarted.current = true;
    startAnalysis();
  }, [hydrated, startAnalysis]);

  const handleRetry = () => {
    disconnect();
    startAnalysis();
  };

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
              className="w-20 h-20 mx-auto rounded-full border-2 border-neon/30 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 20px rgba(212,116,138,0.1)", "0 0 40px rgba(212,116,138,0.3)", "0 0 20px rgba(212,116,138,0.1)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-12 h-12 rounded-full border border-primary/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          {errorMsg ? (
            <>
              <h2 className="text-xl font-bold text-red-400 mb-2 font-mono">
                分析失败
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {errorMsg}
              </p>
              <Button
                variant="outline"
                onClick={handleRetry}
                className="mb-4"
              >
                重新分析
              </Button>
            </>
          ) : (
            <>
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
                    className="w-1.5 h-1.5 rounded-full bg-neon/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* CBT Tips during wait */}
        {!errorMsg && <CbtTips />}
      </div>
    </div>
  );
}
