"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string) => void;
  selectedValue?: string;
}

export default function QuestionCard({ question, onAnswer, selectedValue }: QuestionCardProps) {
  const [textValue, setTextValue] = useState("");
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set());

  const handleMultiToggle = useCallback(
    (value: string) => {
      setMultiSelected((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          // "F" = "基本没有明显消耗" is the positive/exclusive option
          if (value === "F") {
            return new Set(["F"]);
          }
          // If selecting something else, deselect "F"
          next.delete("F");
          // Enforce max selections
          if (question.maxSelections && next.size >= question.maxSelections) {
            return prev;
          }
          next.add(value);
        }
        return next;
      });
    },
    [question.maxSelections]
  );

  const handleMultiSubmit = useCallback(() => {
    if (multiSelected.size === 0) return;
    const mergedValue = Array.from(multiSelected).sort().join(",");
    onAnswer(mergedValue);
  }, [multiSelected, onAnswer]);

  if (question.type === "text") {
    return (
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-medium leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
        )}
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="在这里输入（可跳过）..."
          className="w-full h-32 bg-secondary/50 border border-rose-accent/20 rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/50 resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onAnswer("")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            跳过 →
          </button>
          {textValue.trim() && (
            <button
              onClick={() => onAnswer(textValue)}
              className="text-sm text-neon hover:text-mystic transition-colors font-mono cursor-pointer"
            >
              提交 →
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (question.type === "multi") {
    return (
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-medium leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
        )}
        <div className="space-y-3.5 mt-8">
          {question.choices?.map((choice, i) => {
            const isSelected = multiSelected.has(choice.value);
            const isDisabled =
              !isSelected &&
              !!question.maxSelections &&
              multiSelected.size >= question.maxSelections;
            return (
              <motion.button
                key={choice.value}
                initial={false}
                animate={false}
                onClick={() => handleMultiToggle(choice.value)}
                disabled={isDisabled}
                className={`w-full text-left py-4.5 px-5 rounded-lg border transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-neon/60 bg-neon/10 shadow-[0_0_15px_rgba(212,116,138,0.15)]"
                    : "border-primary/15 bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
                }`}
              >
                <span className="text-sm flex items-center gap-3">
                  <span
                    className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-xs ${
                      isSelected
                        ? "border-neon bg-neon/20 text-neon"
                        : "border-primary/30"
                    }`}
                  >
                    {isSelected && "✓"}
                  </span>
                  {choice.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {multiSelected.size > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2"
          >
            <button
              onClick={handleMultiSubmit}
              className="text-sm text-neon hover:text-mystic transition-colors font-mono cursor-pointer"
            >
              确认选择 ({multiSelected.size}) →
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Scale (5-point horizontal dots)
  if (question.type === "scale") {
    const scaleChoices = question.choices ?? [];
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-medium leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}
        <div className="pt-4">
          {/* Dots row with connecting line */}
          <div className="relative flex items-start justify-between px-2">
            {/* Connecting line behind dots */}
            <div className="absolute top-5 left-7 right-7 h-px bg-primary/15" />
            {scaleChoices.map((choice, i) => {
              const isSelected = selectedValue === choice.value;
              return (
                <button
                  key={choice.value}
                  onClick={() => onAnswer(choice.value)}
                  className="group relative z-10 flex flex-col items-center gap-2 cursor-pointer"
                >
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? "border-neon bg-neon/20 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                        : "border-primary/25 bg-secondary/40 group-hover:border-primary/50 group-hover:bg-secondary/70"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-neon"
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs transition-colors whitespace-nowrap hidden sm:block ${
                      isSelected ? "text-neon font-medium" : "text-muted-foreground/60"
                    }`}
                  >
                    {choice.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Mobile: show end labels */}
          <div className="flex justify-between px-2 mt-2 sm:hidden">
            <span className="text-xs text-muted-foreground/50">{scaleChoices[0]?.label}</span>
            <span className="text-xs text-muted-foreground/50">{scaleChoices[scaleChoices.length - 1]?.label}</span>
          </div>
        </div>
        {/* Skip */}
        <div className="pt-1">
          <button
            onClick={() => onAnswer("skip")}
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            不确定 / 跳过本题
          </button>
        </div>
      </motion.div>
    );
  }

  // Single select
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-medium leading-relaxed">{question.question}</h3>
      {question.description && (
        <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
      )}
      <div className="space-y-3.5 mt-8">
        {question.choices?.map((choice, i) => {
          const isSelected = selectedValue === choice.value;
          return (
            <motion.button
              key={choice.value}
              initial={false}
              animate={false}
              onClick={() => onAnswer(choice.value)}
              className={`w-full text-left py-4.5 px-5 rounded-lg border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-neon/60 bg-neon/10 shadow-[0_0_15px_rgba(212,116,138,0.15)]"
                  : "border-primary/15 bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
              }`}
            >
              <span className="text-sm leading-relaxed">{choice.label}</span>
            </motion.button>
          );
        })}
      </div>
      {/* Secondary skip action */}
      <div className="pt-1">
        <button
          onClick={() => onAnswer("skip")}
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
        >
          不确定 / 跳过本题
        </button>
      </div>
    </motion.div>
  );
}
