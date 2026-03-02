"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart } from "@/components/result/RadarChart";
import { DimensionCard } from "@/components/result/DimensionCard";
import { InsightCard } from "@/components/result/InsightCard";
import { ScoreDisplay } from "@/components/result/ScoreDisplay";
import { useAssessment } from "@/hooks/useAssessment";

export default function ResultPage() {
  const router = useRouter();
  const { result, stage, isLoading, streamingText, isStreaming, restartAssessment } =
    useAssessment();

  // Redirect if no result
  useEffect(() => {
    if (!result && stage !== "analyzing" && !isLoading) {
      router.push("/");
    }
  }, [result, stage, isLoading, router]);

  // Show loading state during analysis
  if (stage === "analyzing" || isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
            <h1 className="text-2xl font-semibold">正在分析您的回答...</h1>
            <p className="text-muted-foreground">
              AI 正在综合分析您的回答，生成个性化评估报告
            </p>

            {/* Streaming text display */}
            {isStreaming && streamingText && (
              <Card className="text-left max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {streamingText}
                    <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!result) {
    return null;
  }

  const handleRestart = () => {
    restartAssessment();
    router.push("/");
  };

  const handleShare = () => {
    // Create shareable text
    const shareText = `我在「结婚对象评估」中获得了 ${result.total_score.toFixed(0)} 分！快来测测你的另一半吧！`;

    if (navigator.share) {
      navigator.share({
        title: "结婚对象评估结果",
        text: shareText,
        url: window.location.origin,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText + " " + window.location.origin);
      alert("已复制到剪贴板！");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">评估报告</h1>
          <p className="text-muted-foreground">
            基于您的回答，以下是 AI 的分析结果
          </p>
        </div>

        {/* Overall Score */}
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreDisplay score={result.total_score} label="综合评分" size="lg" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-xl font-semibold">总体评价</h2>
              <p className="text-muted-foreground leading-relaxed">
                {result.overall_assessment}
              </p>
            </div>
          </div>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>五维评分概览</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart scores={result.dimension_scores} />
          </CardContent>
        </Card>

        {/* Strengths & Areas of Attention */}
        <div className="grid md:grid-cols-2 gap-4">
          <InsightCard
            title="关系中的亮点"
            items={result.strengths}
            variant="positive"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />
          <InsightCard
            title="值得关注的方面"
            items={result.areas_of_attention}
            variant="attention"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />
        </div>

        {/* Dimension Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">各维度详细分析</h2>
          <div className="grid gap-4">
            {result.dimension_scores.map((score) => (
              <DimensionCard key={score.dimension_id} score={score} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <InsightCard
            title="改善建议"
            items={result.recommendations}
            variant="neutral"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
          />
        )}

        {/* Closing Message */}
        {result.closing_message && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-center text-lg leading-relaxed">
                {result.closing_message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={handleShare} variant="outline" size="lg">
            分享结果
          </Button>
          <Button onClick={handleRestart} size="lg">
            重新评估
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          本评估结果仅供参考，不构成任何专业建议。
          <br />
          每段感情都是独特的，最了解你们关系的人是你自己。
        </p>
      </div>
    </main>
  );
}
