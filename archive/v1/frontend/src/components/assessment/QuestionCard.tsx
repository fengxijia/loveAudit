"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { Question, AnswerValue } from "@/types/assessment";

interface QuestionCardProps {
  question: Question;
  answer?: AnswerValue;
  onAnswer: (answer: AnswerValue) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [localValue, setLocalValue] = useState<string | number | string[]>(
    answer?.value || ""
  );
  const [followUp, setFollowUp] = useState<string>(answer?.followUp || "");

  // Update local state when answer changes
  useEffect(() => {
    setLocalValue(answer?.value || "");
    setFollowUp(answer?.followUp || "");
  }, [answer, question.id]);

  const handleValueChange = (value: string | number | string[]) => {
    setLocalValue(value);
    onAnswer({ value, followUp: followUp || undefined });
  };

  const handleFollowUpChange = (value: string) => {
    setFollowUp(value);
    onAnswer({ value: localValue, followUp: value || undefined });
  };

  const isAnswerValid = () => {
    if (!question.required) return true;
    if (!localValue) return false;

    if (question.type === "text" && question.minLength) {
      return String(localValue).length >= question.minLength;
    }

    return true;
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case "text":
        const currentLength = String(localValue).length;
        const minLen = question.minLength || 0;
        const needsMore = minLen > 0 && currentLength < minLen;
        return (
          <div className="space-y-2">
            <Textarea
              value={String(localValue)}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder={question.placeholder}
              className="min-h-[120px] text-base"
            />
            {minLen > 0 && (
              <p className={`text-sm ${needsMore ? "text-muted-foreground" : "text-green-600"}`}>
                {currentLength}/{minLen} 字符 {needsMore ? `（还需 ${minLen - currentLength} 字）` : "✓"}
              </p>
            )}
          </div>
        );

      case "choice":
        return (
          <RadioGroup
            value={String(localValue)}
            onValueChange={handleValueChange}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer text-base"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiChoice":
        const selectedValues = Array.isArray(localValue) ? localValue : [];
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  onClick={() => {
                    let newValues: string[];
                    if (isSelected) {
                      newValues = selectedValues.filter(
                        (v) => v !== option.value
                      );
                    } else {
                      newValues = [...selectedValues, option.value];
                      if (
                        question.maxSelections &&
                        newValues.length > question.maxSelections
                      ) {
                        newValues = newValues.slice(1);
                      }
                    }
                    handleValueChange(newValues);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "hover:bg-accent"
                  }`}
                >
                  <span className="text-base">{option.label}</span>
                </div>
              );
            })}
            {question.maxSelections && (
              <p className="text-sm text-muted-foreground">
                最多选择 {question.maxSelections} 项
              </p>
            )}
          </div>
        );

      case "scale":
        const scaleValue =
          typeof localValue === "number"
            ? localValue
            : question.scaleRange?.[0] || 1;
        const [min, max] = question.scaleRange || [1, 5];
        return (
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.scaleLabels?.left}</span>
              <span>{question.scaleLabels?.center}</span>
              <span>{question.scaleLabels?.right}</span>
            </div>
            <Slider
              value={[scaleValue]}
              onValueChange={([val]) => handleValueChange(val)}
              min={min}
              max={max}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between">
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(
                (num) => (
                  <span
                    key={num}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                      num === scaleValue
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {num}
                  </span>
                )
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            问题 {questionNumber} / {totalQuestions}
          </span>
          <span className="px-2 py-1 bg-muted rounded-full text-xs">
            {getDimensionLabel(question.dimension)}
          </span>
        </div>
        <h2 className="text-xl font-medium leading-relaxed">
          {question.question}
        </h2>
        {question.hint && (
          <p className="text-sm text-muted-foreground">{question.hint}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {renderQuestionInput()}

        {/* Follow-up question */}
        {question.followUp && localValue && (
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-base">{question.followUp.question}</Label>
            <Textarea
              value={followUp}
              onChange={(e) => handleFollowUpChange(e.target.value)}
              placeholder={question.followUp.placeholder}
              className="min-h-[80px]"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
          >
            上一题
          </Button>
          <Button
            onClick={onNext}
            disabled={!isAnswerValid() && question.required}
          >
            {isLast ? "完成" : "下一题"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getDimensionLabel(dimension: string): string {
  const labels: Record<string, string> = {
    warmup: "热身",
    affection: "爱慕程度",
    foundation: "基础条件",
    conflict: "矛盾处理",
    capability: "个人能力",
    background: "背景因素",
  };
  return labels[dimension] || dimension;
}
