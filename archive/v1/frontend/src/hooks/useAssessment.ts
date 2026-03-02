import { useCallback, useEffect } from "react";
import { useAssessmentStore } from "@/store/assessmentStore";
import type { AnswerValue, AssessmentResult, QuestionsData } from "@/types/assessment";

const API_BASE_URL = "";

export function useAssessment() {
  const store = useAssessmentStore();

  // Fetch questions on mount
  useEffect(() => {
    if (!store.questionsData) {
      fetchQuestions();
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/questions`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data: QuestionsData = await response.json();
      store.setQuestionsData(data);
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      store.setLoading(false);
    }
  }, []);

  const submitAssessment = useCallback(async (): Promise<boolean> => {
    store.setLoading(true);
    store.setError(null);
    store.setStage("analyzing");

    try {
      // Format answers for API
      const formattedAnswers: Record<string, AnswerValue> = {};
      for (const [key, value] of Object.entries(store.answers)) {
        formattedAnswers[key] = value;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/assessment/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (!response.ok) {
        let message = "提交失败，请重试";
        try {
          const errorData = await response.json();
          message = errorData.detail || message;
        } catch {
          const text = await response.text().catch(() => "");
          if (text) message = text;
        }
        throw new Error(message);
      }

      const result: AssessmentResult = await response.json();
      store.setResult(result);
      return true;
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Unknown error");
      store.setStage("questions");
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store.answers]);

  const streamAnalysis = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    store.setStage("analyzing");
    store.setIsStreaming(true);
    store.setStreamingText("");

    try {
      const formattedAnswers: Record<string, AnswerValue> = {};
      for (const [key, value] of Object.entries(store.answers)) {
        formattedAnswers[key] = value;
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/analysis/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (!response.ok) {
        throw new Error("Failed to start analysis");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = "";
        let currentData = "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEvent = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            currentData = line.slice(5).trim();
          } else if (line === "" && currentData) {
            try {
              const parsedData = JSON.parse(currentData);

              if (currentEvent === "chunk" && parsedData.content) {
                store.appendStreamingText(parsedData.content);
              } else if (currentEvent === "complete" && parsedData.result) {
                // Transform the result to match our expected format
                const result: AssessmentResult = {
                  id: crypto.randomUUID(),
                  total_score: parsedData.result.total_score || 0,
                  dimension_scores: Object.entries(
                    parsedData.result.scores || {}
                  ).map(([key, score]) => ({
                    dimension_id: key,
                    name: getDimensionName(key),
                    name_en: key,
                    score: score as number,
                    weight: getDimensionWeight(key),
                    insight: parsedData.result.dimension_insights?.[key],
                  })),
                  overall_assessment:
                    parsedData.result.overall_assessment || "",
                  strengths: parsedData.result.strengths || [],
                  areas_of_attention:
                    parsedData.result.areas_of_attention || [],
                  recommendations: parsedData.result.recommendations || [],
                  closing_message: parsedData.result.closing_message || "",
                  completion_rate: Object.keys(store.answers).length / 18,
                };
                store.setResult(result);
              } else if (currentEvent === "error") {
                throw new Error(parsedData.error || "Analysis failed");
              }
            } catch {
              // Continue on parse error
            }
            currentEvent = "";
            currentData = "";
          }
        }
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Unknown error");
      store.setStage("questions");
    } finally {
      store.setLoading(false);
      store.setIsStreaming(false);
    }
  }, [store.answers]);

  const startAssessment = useCallback(() => {
    store.setStage("questions");
    store.setCurrentQuestionIndex(0);
  }, []);

  const restartAssessment = useCallback(() => {
    store.reset();
    store.setStage("welcome");
  }, []);

  return {
    // State
    questionsData: store.questionsData,
    answers: store.answers,
    result: store.result,
    stage: store.stage,
    currentQuestionIndex: store.currentQuestionIndex,
    isLoading: store.isLoading,
    error: store.error,
    streamingText: store.streamingText,
    isStreaming: store.isStreaming,

    // Computed
    currentQuestion: store.getCurrentQuestion(),
    progress: store.getProgress(),
    canSubmit: store.canSubmit(),

    // Actions
    setAnswer: store.setAnswer,
    goToNextQuestion: store.goToNextQuestion,
    goToPreviousQuestion: store.goToPreviousQuestion,
    setCurrentQuestionIndex: store.setCurrentQuestionIndex,
    submitAssessment,
    streamAnalysis,
    startAssessment,
    restartAssessment,
    fetchQuestions,
  };
}

// Helper functions for dimension names
function getDimensionName(key: string): string {
  const names: Record<string, string> = {
    affection: "爱慕程度",
    foundation: "基础条件",
    conflict: "矛盾处理",
    capability: "个人能力",
    background: "背景因素",
  };
  return names[key] || key;
}

function getDimensionWeight(key: string): number {
  const weights: Record<string, number> = {
    affection: 20,
    foundation: 20,
    conflict: 25,
    capability: 20,
    background: 15,
  };
  return weights[key] || 0;
}
