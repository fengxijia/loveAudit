"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { DimensionScore } from "@/types/assessment";

interface DimensionCardProps {
  score: DimensionScore;
}

export function DimensionCard({ score }: DimensionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 90) return "非常好";
    if (value >= 80) return "很好";
    if (value >= 70) return "良好";
    if (value >= 60) return "一般";
    if (value >= 50) return "需关注";
    return "需重视";
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{score.name}</CardTitle>
          <span className="text-sm text-muted-foreground">
            权重 {score.weight}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="flex items-center gap-4">
          <span className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
            {score.score.toFixed(0)}
          </span>
          <div className="flex-1">
            <Progress value={score.score} className="h-3" />
          </div>
          <span className={`text-sm ${getScoreColor(score.score)}`}>
            {getScoreLabel(score.score)}
          </span>
        </div>

        {/* Insight */}
        {score.insight && (
          <>
            <div
              className={`text-sm text-muted-foreground leading-relaxed ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {score.insight}
            </div>
            {score.insight.length > 100 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary"
              >
                {isExpanded ? "收起" : "展开更多"}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
