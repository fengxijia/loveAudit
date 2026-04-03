import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { Answer, AnalysisResult, AssessmentMode, PersonalityType } from "@/types";

interface AppState {
  // Assessment
  assessmentMode: AssessmentMode;
  currentIndex: number;
  answers: Answer[];
  userPersonality: PersonalityType | null;
  partnerPersonality: PersonalityType | null;
  freeformText: string;

  // Analysis result
  analysisResult: AnalysisResult | null;
  streamingText: string;
  isAnalyzing: boolean;

  // Actions
  setAssessmentMode: (mode: AssessmentMode) => void;
  setCurrentIndex: (index: number) => void;
  addAnswer: (answer: Answer) => void;
  setUserPersonality: (type: PersonalityType) => void;
  setPartnerPersonality: (type: PersonalityType) => void;
  setFreeformText: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  appendStreamingText: (text: string) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  resetStreamingText: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      assessmentMode: "core25",
      currentIndex: 0,
      answers: [],
      userPersonality: null,
      partnerPersonality: null,
      freeformText: "",
      analysisResult: null,
      streamingText: "",
      isAnalyzing: false,

      setAssessmentMode: (mode) =>
        set({
          assessmentMode: mode,
          currentIndex: 0,
          answers: [],
          userPersonality: null,
          partnerPersonality: null,
          freeformText: "",
          analysisResult: null,
          streamingText: "",
          isAnalyzing: false,
        }),
      setCurrentIndex: (index) => set({ currentIndex: index }),
      addAnswer: (answer) =>
        set((state) => ({
          answers: [
            ...state.answers.filter((a) => a.questionId !== answer.questionId),
            answer,
          ],
        })),
      setUserPersonality: (type) => set({ userPersonality: type }),
      setPartnerPersonality: (type) => set({ partnerPersonality: type }),
      setFreeformText: (text) => set({ freeformText: text }),
      setAnalysisResult: (result) => set({ analysisResult: result }),
      appendStreamingText: (text) =>
        set((state) => ({ streamingText: state.streamingText + text })),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      resetStreamingText: () => set({ streamingText: "" }),
      reset: () =>
        set({
          assessmentMode: "core25",
          currentIndex: 0,
          answers: [],
          userPersonality: null,
          partnerPersonality: null,
          freeformText: "",
          analysisResult: null,
          streamingText: "",
          isAnalyzing: false,
        }),
    }),
    {
      name: "loveaudit-store",
      // Only persist assessment progress and results — skip transient streaming state
      partialize: (state) => ({
        assessmentMode: state.assessmentMode,
        currentIndex: state.currentIndex,
        answers: state.answers,
        userPersonality: state.userPersonality,
        partnerPersonality: state.partnerPersonality,
        freeformText: state.freeformText,
        analysisResult: state.analysisResult,
      }),
    }
  )
);

/**
 * Returns true once the Zustand persist store has finished rehydrating from
 * localStorage. Use this in pages that redirect based on store state
 * (analyzing, result) to avoid a flash-redirect before cached data loads.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Zustand persist v5: onFinishHydration fires after rehydration
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated (e.g. client-side navigation), set immediately
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}
