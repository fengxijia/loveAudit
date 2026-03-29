"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore, useHydrated } from "@/store/store";
import ResultHero from "@/components/result/ResultHero";
import ScoreBars from "@/components/result/ScoreBars";
import WarningBlock from "@/components/result/WarningBlock";
import InsightCards from "@/components/result/InsightCards";
import ReframeBlock from "@/components/result/ReframeBlock";
import PersonaTag from "@/components/result/PersonaTag";
import Tips from "@/components/result/Tips";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/types";

/** Fallback: try to extract a usable result from streaming text or old-format data */
function normalizeResult(raw: unknown): AnalysisResult | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  // Already v2 format
  if (r.scores && r.resultType) return r as unknown as AnalysisResult;

  // Old v1 format — best-effort migration
  if (r.verdict || r.verdictTitle) {
    const oldVerdict = (r.verdict as string) || "observe";
    const typeMap: Record<string, string> = {
      angel: "angel_couple",
      observe: "grinding_growth",
      run: "high_risk",
    };
    return {
      scores: { safety: 50, compatibility: 50, repair: 50 },
      resultType: (typeMap[oldVerdict] || "grinding_growth") as AnalysisResult["resultType"],
      resultLabel: (r.verdictTitle as string) || "评估完成",
      riskTier: oldVerdict === "run" ? "high" : "low",
      warnings: [],
      summaryLine: (r.verdictDescription as string) || "",
      insights: [],
      reframe: [],
      advice: (r.tips as string[]) || [],
      personaTags: (r.personaTags as string[]) || [],
      warningBlock: null,
    };
  }

  return null;
}

function parseStreamingText(text: string): AnalysisResult | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return normalizeResult(parsed);
    }
  } catch {
    // ignore
  }
  return null;
}

export default function ResultPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { analysisResult, streamingText, answers } = useAppStore();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (answers.length === 0) {
      router.push("/");
      return;
    }

    if (analysisResult) {
      const normalized = normalizeResult(analysisResult);
      if (normalized) {
        setResult(normalized);
        return;
      }
    }

    if (streamingText) {
      const parsed = parseStreamingText(streamingText);
      if (parsed) {
        setResult(parsed);
        return;
      }
    }
  }, [hydrated, analysisResult, streamingText, answers, router]);

  const handleSaveImage = useCallback(async () => {
    if (!captureRef.current || saving) return;
    setSaving(true);

    try {
      const { toBlob } = await import("html-to-image");

      const blob = await toBlob(captureRef.current, {
        backgroundColor: "#0a0608",
        pixelRatio: 2,
        style: {
          // Ensure animations don't affect the screenshot
          transform: "none",
          opacity: "1",
        },
      });

      if (!blob) {
        alert("图片生成失败，请重试");
        return;
      }

      if (navigator.share && navigator.canShare?.({ files: [new File([], "")] })) {
        const file = new File([blob], "love-audit-result.png", { type: "image/png" });
        try {
          await navigator.share({ files: [file], title: "LoveAudit 测评结果" });
          return;
        } catch {
          // fall through to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "love-audit-result.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Save image error:", e);
      alert("图片生成失败，请重试");
    } finally {
      setSaving(false);
    }
  }, [saving]);

  if (!result) {
    const hasData = analysisResult || streamingText;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        {answers.length > 0 && !hasData ? (
          <>
            <p className="text-red-400 font-mono text-sm">分析结果获取失败</p>
            <p className="text-muted-foreground text-xs">可能是网络问题或服务暂时不可用</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { useAppStore.getState().setIsAnalyzing(true); router.push("/analyzing"); }}>
                重新分析
              </Button>
              <Button variant="outline" onClick={() => { useAppStore.getState().reset(); router.push("/"); }}>
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
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* ── Capturable area ── */}
      <div
        ref={captureRef}
        data-capture
        style={{ backgroundColor: "#0a0608", padding: "1.5rem 0" }}
        className="space-y-5"
      >
        {/* Header */}
        <motion.div className="text-center mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(212, 116, 138, 0.6)", letterSpacing: "0.1em" }}>
            ANALYSIS COMPLETE
          </p>
        </motion.div>

        {/* Result Type Hero */}
        <ResultHero
          resultType={result.resultType}
          resultLabel={result.resultLabel}
          summaryLine={result.summaryLine}
        />

        {/* Score Bars */}
        <ScoreBars scores={result.scores} />

        {/* Warning Block (high risk only) */}
        <WarningBlock warningBlock={result.warningBlock} />

        {/* Insights */}
        <InsightCards insights={result.insights} />

        {/* Reframe: "你可能以为" vs "更接近的真相" */}
        <ReframeBlock reframes={result.reframe} />

        {/* Advice */}
        {result.advice && result.advice.length > 0 && (
          <Tips tips={result.advice} />
        )}

        {/* Persona Tags */}
        {result.personaTags && result.personaTags.length > 0 && (
          <PersonaTag
            tags={result.personaTags}
            verdict={result.resultLabel}
          />
        )}
      </div>

      {/* ── Actions (outside capture area) ── */}
      <motion.div
        className="space-y-3 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Button variant="neon" className="w-full" onClick={handleSaveImage} disabled={saving}>
          {saving ? "生成中..." : "保存/分享完整报告"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => { useAppStore.getState().reset(); router.push("/"); }}
        >
          重新测评
        </Button>
        <p className="text-xs text-center text-muted-foreground/50 font-mono">
          LoveAudit · 本测评不构成医学、心理或法律诊断，仅供参考
        </p>
        <p className="text-xs text-center text-muted-foreground/50 font-mono">
          如果你觉得有用，请进可爱作者的{" "}
          <a
            href="https://github.com/fengxijia/loveAudit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon/80 hover:text-neon underline underline-offset-2 transition-colors"
          >
            GitHub
          </a>{" "}
          为她点个Star叭～
        </p>
      </motion.div>
    </div>
  );
}
