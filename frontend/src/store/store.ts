import { create } from "zustand";
import { Answer, AnalysisResult, PersonalityType } from "@/types";

interface AppState {
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

export const useAppStore = create<AppState>((set) => ({
  currentIndex: 0,
  answers: [],
  userPersonality: null,
  partnerPersonality: null,
  freeformText: "",
  analysisResult: null,
  streamingText: "",
  isAnalyzing: false,

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
      currentIndex: 0,
      answers: [],
      userPersonality: null,
      partnerPersonality: null,
      freeformText: "",
      analysisResult: null,
      streamingText: "",
      isAnalyzing: false,
    }),
}));
