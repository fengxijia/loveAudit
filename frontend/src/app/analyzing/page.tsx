"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CbtTips from "@/components/analyzing/CbtTips";
import { useAppStore, useHydrated } from "@/store/store";
import { useSSE } from "@/hooks/useSSE";
import { Button } from "@/components/ui/button";
import { getQuestionsForMode } from "@/data/questions";
import type { AnalysisResult } from "@/types";

export default function AnalyzingPage() {
  const router = useRouter();
  const {
    assessmentMode,
    answers,
    userPersonality,
    partnerPersonality,
    freeformText,
    setAnalysisResult,
    appendStreamingText,
    resetStreamingText,
    setIsAnalyzing,
  } = useAppStore();

  const questions = useMemo(
    () => getQuestionsForMode(assessmentMode),
    [assessmentMode]
  );
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

    // Build payload — tags are looked up server-side, not sent from frontend
    const payload = {
      assessmentMode,
      answers: Object.fromEntries(
        answers.map((a) => {
          const q = questions.find((qq) => qq.id === a.questionId);
          const selectedChoice = q?.choices?.find((c) => c.value === a.value);
          return [
            String(a.questionId),
            {
              value: a.value,
              order: questions.findIndex((qq) => qq.id === a.questionId),
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
  }, [
    assessmentMode,
    answers,
    questions,
    userPersonality,
    partnerPersonality,
    freeformText,
    connect,
    resetStreamingText,
    setIsAnalyzing,
    router,
  ]);

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
    <div className="min-h-screen flex flex-col items-center justify-center relative px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,102,130,0.24),transparent_30%),linear-gradient(180deg,#e3eaef,#eff3f6)]" />

      <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-primary/10 bg-card/92 px-6 py-10 text-center shadow-[0_30px_90px_rgba(28,36,50,0.08)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <motion.div
              className="w-20 h-20 mx-auto rounded-full border-2 border-primary/20 flex items-center justify-center bg-secondary/50"
              animate={{ boxShadow: ["0 0 20px rgba(49,86,111,0.08)", "0 0 42px rgba(49,86,111,0.18)", "0 0 20px rgba(49,86,111,0.08)"] }}
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
              <p className="mb-2 text-xs tracking-[0.22em] text-primary/70">
                正在生成关系分析
              </p>
              <h2 className="text-3xl font-display font-semibold mb-3">
                正在整理你的测评结果
              </h2>
              <p className="text-sm text-muted-foreground mb-2 leading-6">
                系统会先整理风险信号、互动模式和长期适配线索，再生成完整报告。
              </p>

              <div className="flex justify-center gap-1.5 mb-10">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/40"
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
