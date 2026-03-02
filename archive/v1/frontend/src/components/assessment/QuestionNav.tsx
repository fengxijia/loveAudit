"use client";

import type { Question, AnswerValue } from "@/types/assessment";

interface QuestionNavProps {
  questions: Question[];
  answers: Record<number, AnswerValue>;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function QuestionNav({
  questions,
  answers,
  currentIndex,
  onNavigate,
}: QuestionNavProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((question, index) => {
          const isAnswered = !!answers[question.id];
          const isCurrent = index === currentIndex;

          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isAnswered
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }
              `}
              title={`问题 ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
