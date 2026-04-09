import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { Answer, AnalysisResult, PersonalityType } from "@/types";
import type { Locale } from "@/i18n";

interface AppState {
  // Locale
  locale: Locale;

  // Assessment
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
  setLocale: (locale: Locale) => void;
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
      locale: "zh" as Locale,
      currentIndex: 0,
      answers: [],
      userPersonality: null,
      partnerPersonality: null,
      freeformText: "",
      analysisResult: null,
      streamingText: "",
      isAnalyzing: false,

      setLocale: (locale) => set({ locale }),
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
        set((state) => ({
          locale: state.locale,
          currentIndex: 0,
          answers: [],
          userPersonality: null,
          partnerPersonality: null,
          freeformText: "",
          analysisResult: null,
          streamingText: "",
          isAnalyzing: false,
        })),
    }),
    {
      name: "loveaudit-store",
      // Only persist assessment progress and results — skip transient streaming state
      partialize: (state) => ({
        locale: state.locale,
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
