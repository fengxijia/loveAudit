export interface Choice {
  label: string;
  value: string;
}

export type AssessmentMode = "core25" | "mirror50" | "deep99";

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
  /** Useful for mirrored / generated banks */
  perspective?: "self" | "partner_projection";
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

export interface AssessmentModeMeta {
  id: AssessmentMode;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  questionCount: number;
  estimate: string;
  badge: string;
}

export interface Answer {
  questionId: number;
  value: string;
}

export type PersonalityType = "rational" | "emotional" | "balanced";

export interface AssessmentState {
  assessmentMode: AssessmentMode;
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
