"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { questions } from "@/data/questions";
import { useAppStore } from "@/store/store";
import QuestionCard from "@/components/assessment/QuestionCard";
import ChapterIntro from "@/components/assessment/ChapterIntro";
import ProgressBar from "@/components/assessment/ProgressBar";
import { PersonalityType } from "@/types";

export default function AssessmentPage() {
  const router = useRouter();
  const {
    currentIndex,
    setCurrentIndex,
    answers,
    addAnswer,
    setUserPersonality,
    setPartnerPersonality,
    setFreeformText,
  } = useAppStore();

  const [showChapterIntro, setShowChapterIntro] = useState(true);
  const [lastChapter, setLastChapter] = useState(1);

  const currentQuestion = questions[currentIndex];
  const currentChapter = currentQuestion?.chapter ?? 1;

  // Check if we need to show a chapter intro
  const needsChapterIntro = currentChapter !== lastChapter;

  const selectedAnswer = useMemo(
    () => answers.find((a) => a.questionId === currentQuestion?.id),
    [answers, currentQuestion?.id]
  );

  const handleAnswer = useCallback(
    (value: string, tags: Record<string, number>) => {
      if (!currentQuestion) return;

      // Record personality types
      if (currentQuestion.id === 1) {
        setUserPersonality(value as PersonalityType);
      } else if (currentQuestion.id === 2) {
        setPartnerPersonality(value as PersonalityType);
      }

      // Record freeform text
      if (currentQuestion.type === "text") {
        setFreeformText(value);
      }

      addAnswer({ questionId: currentQuestion.id, value, tags });

      // Auto advance after short delay
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          const nextIndex = currentIndex + 1;
          const nextChapter = questions[nextIndex].chapter;
          if (nextChapter !== currentChapter) {
            setShowChapterIntro(true);
            setLastChapter(currentChapter);
          }
          setCurrentIndex(nextIndex);
        } else {
          // Assessment complete - go to analyzing
          router.push("/analyzing");
        }
      }, 300);
    },
    [
      currentQuestion,
      currentIndex,
      currentChapter,
      addAnswer,
      setCurrentIndex,
      setUserPersonality,
      setPartnerPersonality,
      setFreeformText,
      router,
    ]
  );

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowChapterIntro(false);
    }
  };

  if (!currentQuestion) return null;

  // Show chapter intro
  if (showChapterIntro || needsChapterIntro) {
    return (
      <ChapterIntro
        chapterId={currentChapter}
        onContinue={() => {
          setShowChapterIntro(false);
          setLastChapter(currentChapter);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
      {/* Progress */}
      <ProgressBar
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        currentChapter={currentChapter}
      />

      {/* Question */}
      <div className="flex-1 flex items-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <QuestionCard
              question={currentQuestion}
              onAnswer={handleAnswer}
              selectedValue={selectedAnswer?.value}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center py-4">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors font-mono cursor-pointer disabled:cursor-not-allowed"
        >
          ← 上一题
        </button>
        <span className="text-xs text-muted-foreground/50 font-mono">
          Ch.{currentChapter}
        </span>
      </div>
    </div>
  );
}
