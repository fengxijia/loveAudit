"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAssessment } from "@/hooks/useAssessment";

const dimensions = [
  { name: "爱慕程度", weight: "20%", desc: "双方情感投入与表达" },
  { name: "基础条件", weight: "20%", desc: "三观、习惯、生活目标" },
  { name: "矛盾处理", weight: "25%", desc: "沟通能力与冲突解决" },
  { name: "个人能力", weight: "20%", desc: "独立性与人生规划" },
  { name: "背景因素", weight: "15%", desc: "原生家庭与成长环境" },
];

export default function Home() {
  const router = useRouter();
  const { startAssessment, questionsData, result, stage } = useAssessment();

  const hasExistingResult = !!result;

  useEffect(() => {
    if (stage === "questions") {
      router.push("/assessment");
    }
  }, [stage, result, router]);

  const handleStart = () => {
    startAssessment();
    router.push("/assessment");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <section className="container max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            结婚对象评估
          </h1>
          <p className="text-lg text-muted-foreground">
            用科学的方式，帮你看清这段感情
          </p>
        </div>

        {/* Five Dimensions */}
        <div className="space-y-2">
          {dimensions.map((dim) => (
            <div
              key={dim.name}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50"
            >
              <span className="text-sm font-bold text-primary w-10 text-center shrink-0">
                {dim.weight}
              </span>
              <span className="font-medium w-20 shrink-0">{dim.name}</span>
              <span className="text-sm text-muted-foreground">{dim.desc}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={handleStart}>
              开始评估
            </Button>
            {hasExistingResult && (
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => router.push("/result")}
              >
                查看上次结果
              </Button>
            )}
          </div>
          {questionsData && (
            <p className="text-sm text-muted-foreground">
              {questionsData.metadata.totalQuestions} 道选择题 ·{" "}
              {questionsData.metadata.estimatedTime}
            </p>
          )}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-bold">
              1
            </div>
            <p className="font-medium">回答问题</p>
            <p className="text-muted-foreground text-xs">18道选择题，5-8分钟</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-bold">
              2
            </div>
            <p className="font-medium">AI 分析</p>
            <p className="text-muted-foreground text-xs">多维度深入分析</p>
          </div>
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-bold">
              3
            </div>
            <p className="font-medium">获取洞察</p>
            <p className="text-muted-foreground text-xs">个性化评估报告</p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          本评估仅供参考，不构成任何专业建议 · 数据仅存于本地
        </p>
      </section>
    </main>
  );
}
