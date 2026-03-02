export interface QuestionOption {
  value: string;
  label: string;
}

export interface FollowUp {
  condition: string;
  question: string;
  placeholder?: string;
}

export interface ScaleLabels {
  left: string;
  center: string;
  right: string;
}

export interface Question {
  id: number;
  dimension: string;
  type: "text" | "choice" | "multiChoice" | "scale";
  question: string;
  placeholder?: string;
  hint?: string;
  required: boolean;
  minLength?: number;
  options?: QuestionOption[];
  followUp?: FollowUp;
  scaleLabels?: ScaleLabels;
  scaleRange?: [number, number];
  maxSelections?: number;
}

export interface Dimension {
  id: string;
  name: string;
  name_en: string;
  description: string;
  weight: number;
}

export interface Phase {
  name: string;
  questions: number[];
  title: string;
}

export interface Metadata {
  totalQuestions: number;
  estimatedTime: string;
  phases: Phase[];
}

export interface QuestionsData {
  dimensions: Record<string, Dimension>;
  questions: Question[];
  metadata: Metadata;
}

export interface AnswerValue {
  value: string | number | string[];
  followUp?: string;
}

export interface DimensionScore {
  dimension_id: string;
  name: string;
  name_en: string;
  score: number;
  weight: number;
  insight?: string;
}

export interface AssessmentResult {
  id: string;
  total_score: number;
  dimension_scores: DimensionScore[];
  overall_assessment: string;
  strengths: string[];
  areas_of_attention: string[];
  recommendations: string[];
  closing_message: string;
  completion_rate: number;
}

export type AssessmentStage = "welcome" | "questions" | "analyzing" | "result";
