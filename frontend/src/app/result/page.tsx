"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore, useHydrated } from "@/store/store";
import Verdict from "@/components/result/Verdict";
import MentalHealth from "@/components/result/MentalHealth";
import MythBuster from "@/components/result/MythBuster";
import PersonaTag from "@/components/result/PersonaTag";
import Tips from "@/components/result/Tips";
import { Button } from "@/components/ui/button";
import type { AnalysisResult, VerdictLevel } from "@/types";

// Fallback when SSE returns streaming text instead of structured JSON
function parseStreamingText(text: string): AnalysisResult {
  // Try to extract JSON from streaming text
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fall through to default
  }

  return {
    verdict: "observe" as VerdictLevel,
    verdictTitle: "继续观察",
    verdictDescription: text.slice(0, 200) || "分析完成，请查看详细内容。",
    mentalHealth: {
      user: "建议关注自身情绪状态，适时寻求专业帮助。",
      partner: "需要更多信息来评估伴侣的心理状态。",
    },
    mythBusters: [
      {
        buzzword: "NPD",
        realMeaning: "关系中的强势方",
        analysis: "不一定是人格障碍，可能只是沟通方式强势。真正的NPD需要专业诊断。",
      },
      {
        buzzword: "血包",
        realMeaning: "关系中的弱势方",
        analysis: "善良不是弱点，但过度让步会让对方得寸进尺。学会设立健康的边界。",
      },
    ],
    personaTags: ["需要更多了解", "观察期"],
    tips: [
      "多关注自己的感受，你的情绪是重要的信号",
      "尝试和伴侣进行一次坦诚的深度对话",
      "如果感到焦虑或抑郁，建议咨询专业心理咨询师",
    ],
  };
}

export default function ResultPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { analysisResult, streamingText, answers } = useAppStore();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (answers.length === 0) {
      router.push("/");
      return;
    }

    if (analysisResult) {
      setResult(analysisResult);
    } else if (streamingText) {
      setResult(parseStreamingText(streamingText));
    }
  }, [hydrated, analysisResult, streamingText, answers, router]);

  const verdictDisplay = useMemo(() => {
    if (!result) return null;
    const map: Record<VerdictLevel, string> = {
      angel: "神仙伴侣",
      observe: "继续观察",
      run: "建议远离",
    };
    return map[result.verdict] || result.verdictTitle;
  }, [result]);

  if (!result) {
    const hasData = analysisResult || streamingText;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        {answers.length > 0 && !hasData ? (
          <>
            <p className="text-red-400 font-mono text-sm">分析结果获取失败</p>
            <p className="text-muted-foreground text-xs">可能是网络问题或服务暂时不可用</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  useAppStore.getState().setIsAnalyzing(true);
                  router.push("/analyzing");
                }}
              >
                重新分析
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  useAppStore.getState().reset();
                  router.push("/");
                }}
              >
                重新测评
              </Button>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground font-mono text-sm">加载中...</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <motion.div
        className="text-center mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-xs font-mono text-cyan-400/60 tracking-widest">
          ANALYSIS COMPLETE
        </p>
      </motion.div>

      {/* Verdict */}
      <Verdict
        level={result.verdict}
        title={result.verdictTitle}
        description={result.verdictDescription}
      />

      {/* Mental Health */}
      <MentalHealth
        user={result.mentalHealth.user}
        partner={result.mentalHealth.partner}
      />

      {/* Myth Busters */}
      <MythBuster myths={result.mythBusters} />

      {/* Persona Tags */}
      <PersonaTag
        tags={result.personaTags}
        verdict={verdictDisplay || result.verdictTitle}
      />

      {/* Tips */}
      <Tips tips={result.tips} />

      {/* Actions */}
      <motion.div
        className="space-y-3 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            useAppStore.getState().reset();
            router.push("/");
          }}
        >
          重新测评
        </Button>
        <p className="text-xs text-center text-muted-foreground/50 font-mono">
          想要更深入的分析？进阶版测评即将上线
        </p>
      </motion.div>

      {/* Footer */}
      <div className="text-center pt-6 pb-4">
        <p className="text-[10px] text-muted-foreground/30 font-mono">
          LoveAudit · AI驱动 · 基于循证心理学 · 仅供参考
        </p>
      </div>
    </div>
  );
}
