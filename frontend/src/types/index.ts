export interface Choice {
  label: string;
  value: string;
  /** Hidden psychological tags mapped to this choice */
  tags: Record<string, number>;
}

export interface Question {
  id: number;
  chapter: number;
  question: string;
  description?: string;
  type: "single" | "text";
  choices?: Choice[];
  /** Whether this question adapts based on personality type */
  adaptive?: boolean;
  /** Hidden psych dimension this question maps to */
  dimension: string;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

export interface Answer {
  questionId: number;
  value: string;
  tags: Record<string, number>;
}

export type PersonalityType = "rational" | "emotional" | "balanced";

export interface AssessmentState {
  currentIndex: number;
  answers: Answer[];
  userPersonality: PersonalityType | null;
  partnerPersonality: PersonalityType | null;
  isComplete: boolean;
}

export type VerdictLevel = "angel" | "observe" | "run";

export interface AnalysisResult {
  verdict: VerdictLevel;
  verdictTitle: string;
  verdictDescription: string;
  mentalHealth: {
    user: string;
    partner: string;
  };
  mythBusters: Array<{
    buzzword: string;
    realMeaning: string;
    analysis: string;
  }>;
  personaTags: string[];
  tips: string[];
}
