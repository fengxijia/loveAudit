"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { QuestionNav } from "@/components/assessment/QuestionNav";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/hooks/useAssessment";

export default function AssessmentPage() {
  const router = useRouter();
  const {
    questionsData,
    answers,
    currentQuestion,
    currentQuestionIndex,
    progress,
    isLoading,
    error,
    stage,
    canSubmit,
    setAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    setCurrentQuestionIndex,
    submitAssessment,
  } = useAssessment();

  // Redirect to home if not started
  useEffect(() => {
    if (stage === "welcome") {
      router.push("/");
    } else if (stage === "result") {
      router.push("/result");
    }
  }, [stage, router]);

  // Handle loading state
  if (isLoading && !questionsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">加载问题中...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.push("/")}>返回首页</Button>
        </div>
      </div>
    );
  }

  if (!questionsData || !currentQuestion) {
    return null;
  }

  const questions = questionsData.questions;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = async () => {
    if (isLastQuestion && canSubmit) {
      const success = await submitAssessment();
      if (success) router.push("/result");
    } else {
      goToNextQuestion();
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Progress */}
        <ProgressBar
          progress={progress}
          currentQuestion={currentQuestionIndex}
          totalQuestions={questions.length}
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswer={(answer) => setAnswer(currentQuestion.id, answer)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={isFirstQuestion}
          isLast={isLastQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Question Navigation */}
        <QuestionNav
          questions={questions}
          answers={answers}
          currentIndex={currentQuestionIndex}
          onNavigate={setCurrentQuestionIndex}
        />

        {/* Submit Button (shows when at least 70% complete) */}
        {canSubmit && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={async () => {
                const success = await submitAssessment();
                if (success) router.push("/result");
              }}
              disabled={isLoading}
            >
              {isLoading ? "分析中..." : "提交并查看结果"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              已完成 {Object.keys(answers).length} / {questions.length} 题
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
