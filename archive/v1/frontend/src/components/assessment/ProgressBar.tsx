"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
}

export function ProgressBar({
  progress,
  currentQuestion,
  totalQuestions,
}: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>已完成 {Math.round(progress)}%</span>
        <span>
          {currentQuestion + 1} / {totalQuestions}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
