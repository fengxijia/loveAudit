import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnswerValue,
  AssessmentResult,
  AssessmentStage,
  Question,
  QuestionsData,
} from "@/types/assessment";

interface AssessmentState {
  // Data
  questionsData: QuestionsData | null;
  answers: Record<number, AnswerValue>;
  result: AssessmentResult | null;

  // UI State
  stage: AssessmentStage;
  currentQuestionIndex: number;
  isLoading: boolean;
  error: string | null;

  // Streaming state
  streamingText: string;
  isStreaming: boolean;

  // Actions
  setQuestionsData: (data: QuestionsData) => void;
  setAnswer: (questionId: number, answer: AnswerValue) => void;
  removeAnswer: (questionId: number) => void;
  setStage: (stage: AssessmentStage) => void;
  setCurrentQuestionIndex: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setResult: (result: AssessmentResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStreamingText: (text: string) => void;
  appendStreamingText: (text: string) => void;
  setIsStreaming: (streaming: boolean) => void;
  reset: () => void;

  // Computed
  getCurrentQuestion: () => Question | null;
  getProgress: () => number;
  canSubmit: () => boolean;
}

const initialState = {
  questionsData: null,
  answers: {},
  result: null,
  stage: "welcome" as AssessmentStage,
  currentQuestionIndex: 0,
  isLoading: false,
  error: null,
  streamingText: "",
  isStreaming: false,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setQuestionsData: (data) => set({ questionsData: data }),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),

      removeAnswer: (questionId) =>
        set((state) => {
          const { [questionId]: _, ...rest } = state.answers;
          return { answers: rest };
        }),

      setStage: (stage) => set({ stage }),

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      goToNextQuestion: () =>
        set((state) => {
          const questions = state.questionsData?.questions || [];
          const nextIndex = Math.min(
            state.currentQuestionIndex + 1,
            questions.length - 1
          );
          return { currentQuestionIndex: nextIndex };
        }),

      goToPreviousQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        })),

      setResult: (result) => set({ result, stage: "result" }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setStreamingText: (streamingText) => set({ streamingText }),

      appendStreamingText: (text) =>
        set((state) => ({ streamingText: state.streamingText + text })),

      setIsStreaming: (isStreaming) => set({ isStreaming }),

      reset: () =>
        set({
          ...initialState,
          questionsData: get().questionsData, // Keep questions data
        }),

      getCurrentQuestion: () => {
        const state = get();
        if (!state.questionsData) return null;
        return state.questionsData.questions[state.currentQuestionIndex] || null;
      },

      getProgress: () => {
        const state = get();
        if (!state.questionsData) return 0;
        const totalQuestions = state.questionsData.questions.length;
        const answeredCount = Object.keys(state.answers).length;
        return (answeredCount / totalQuestions) * 100;
      },

      canSubmit: () => {
        const state = get();
        if (!state.questionsData) return false;
        const requiredQuestions = state.questionsData.questions.filter(
          (q) => q.required
        );
        const answeredRequired = requiredQuestions.filter(
          (q) => state.answers[q.id]
        );
        return answeredRequired.length >= requiredQuestions.length * 0.7;
      },
    }),
    {
      name: "marriage-assessment",
      partialize: (state) => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        stage: state.stage === "result" ? "result" : state.stage,
        result: state.result,
      }),
    }
  )
);
