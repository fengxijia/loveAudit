"use client";

import { Progress } from "@/components/ui/progress";
import { getChaptersForMode } from "@/data/questions";
import type { AssessmentMode, AssessmentModeMeta } from "@/types";

interface ProgressBarProps {
  assessmentMode: AssessmentMode;
  modeMeta: AssessmentModeMeta;
  currentIndex: number;
  totalQuestions: number;
  currentChapter: number;
}

export default function ProgressBar({
  assessmentMode,
  modeMeta,
  currentIndex,
  totalQuestions,
  currentChapter,
}: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const chapters = getChaptersForMode(assessmentMode);
  const chapter = chapters.find((c) => c.id === currentChapter);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
        <span className="rounded-full border border-primary/18 bg-white/70 px-3 py-1 text-primary">
          {modeMeta.badge}
        </span>
        <span className="text-muted-foreground font-medium">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-foreground font-medium">
          <span className="text-primary/50 mr-2">{chapter?.icon}</span>
          {chapter?.title}
        </span>
        <span className="text-muted-foreground text-xs">{modeMeta.shortTitle}</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
