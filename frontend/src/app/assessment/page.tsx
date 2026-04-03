"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAssessmentModeMeta,
  getQuestionsForMode,
} from "@/data/questions";
import { useAppStore, useHydrated } from "@/store/store";
import QuestionCard from "@/components/assessment/QuestionCard";
import ChapterIntro from "@/components/assessment/ChapterIntro";
import ProgressBar from "@/components/assessment/ProgressBar";

export default function AssessmentPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const {
    assessmentMode,
    currentIndex,
    setCurrentIndex,
    answers,
    addAnswer,
    setFreeformText,
  } = useAppStore();

  const questions = useMemo(
    () => getQuestionsForMode(assessmentMode),
    [assessmentMode]
  );
  const modeMeta = useMemo(
    () => getAssessmentModeMeta(assessmentMode),
    [assessmentMode]
  );
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
    (value: string) => {
      if (!currentQuestion) return;

      // Record freeform text
      if (currentQuestion.type === "text") {
        setFreeformText(value);
      }

      addAnswer({ questionId: currentQuestion.id, value });

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

  // Still loading persisted state
  if (!hydrated) return null;

  // currentIndex out of bounds → previous session completed all questions
  if (!currentQuestion) {
    if (answers.length > 0) {
      router.replace("/analyzing");
    } else {
      // No answers either — corrupt state, go home
      router.replace("/");
    }
    return null;
  }

  // Show chapter intro
  if (showChapterIntro || needsChapterIntro) {
    return (
      <ChapterIntro
        assessmentMode={assessmentMode}
        chapterId={currentChapter}
        onContinue={() => {
          setShowChapterIntro(false);
          setLastChapter(currentChapter);
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,102,130,0.24),transparent_30%),linear-gradient(180deg,#e3eaef,#eff3f6)]" />
      <div className="absolute inset-x-0 top-0 h-[22rem] bg-[linear-gradient(180deg,rgba(29,44,60,0.12),transparent)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-6">
        <div className="rounded-[2rem] border border-primary/12 bg-white/78 px-5 py-5 shadow-[0_30px_90px_rgba(28,36,50,0.08)] backdrop-blur-md">
          <ProgressBar
            assessmentMode={assessmentMode}
            modeMeta={modeMeta}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            currentChapter={currentChapter}
          />
        </div>

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

        <div className="flex justify-between items-center py-4 px-2">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            ← 上一题
          </button>
          <span className="text-xs text-muted-foreground/70 tracking-[0.2em]">
            第 {currentChapter} 章
          </span>
        </div>
      </div>
    </div>
  );
}
