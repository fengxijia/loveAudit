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
  type: "single" | "multi" | "scale" | "text";
  choices?: Choice[];
  /** Max selections for multi-select questions */
  maxSelections?: number;
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

// ── Result types (v2) ──

export type ResultType =
  | "angel_couple"
  | "grinding_growth"
  | "reality_gap"
  | "high_drain"
  | "boundary_imbalance"
  | "high_risk";

export type RiskTier = "low" | "medium" | "high";

export interface Scores {
  safety: number;
  compatibility: number;
  repair: number;
}

export interface Warning {
  code: string;
  message: string;
}

export interface Reframe {
  myth: string;
  truth: string;
}

export interface AnalysisResult {
  // Backend-computed
  scores: Scores;
  resultType: ResultType;
  resultLabel: string;
  riskTier: RiskTier;
  warnings: Warning[];

  // LLM-generated
  summaryLine: string;
  insights: string[];
  reframe: Reframe[];
  advice: string[];
  personaTags: string[];
  warningBlock?: string | null;
}
