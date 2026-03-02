"use client";

import { Progress } from "@/components/ui/progress";
import { chapters } from "@/data/questions";

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  currentChapter: number;
}

export default function ProgressBar({ currentIndex, totalQuestions, currentChapter }: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const chapter = chapters.find((c) => c.id === currentChapter);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-purple-400/80">
          {chapter?.icon} {chapter?.title}
        </span>
        <span className="text-muted-foreground">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
