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
        className="space-y-5 rounded-[2rem] border border-primary/12 bg-[rgba(40,55,72,0.94)] p-6 text-white shadow-[0_30px_80px_rgba(28,36,50,0.18)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-display text-2xl font-semibold leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-white/68 mt-1 leading-6">{question.description}</p>
        )}
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="在这里输入（可跳过）..."
          className="w-full h-32 bg-white/7 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onAnswer("")}
            className="text-sm text-white/58 hover:text-white transition-colors cursor-pointer"
          >
            跳过 →
          </button>
          {textValue.trim() && (
            <button
              onClick={() => onAnswer(textValue)}
              className="text-sm text-[#ffd39e] hover:text-[#ffe4be] transition-colors cursor-pointer"
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
        className="space-y-5 rounded-[2rem] border border-primary/12 bg-[rgba(40,55,72,0.94)] p-6 text-white shadow-[0_30px_80px_rgba(28,36,50,0.18)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-display text-2xl font-semibold leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-white/68 mt-1 leading-6">{question.description}</p>
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
                className={`w-full text-left py-4.5 px-5 rounded-[1.25rem] border transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-[#ffd39e]/60 bg-[#ffd39e]/14 shadow-[0_14px_40px_rgba(20,26,35,0.28)]"
                    : "border-white/10 bg-white/6 hover:border-white/18 hover:bg-white/10"
                }`}
              >
                <span className="text-sm flex items-center gap-3 text-white/92">
                  <span
                    className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-xs ${
                      isSelected
                        ? "border-[#ffd39e] bg-[#ffd39e]/16 text-[#ffd39e]"
                        : "border-white/28 text-transparent"
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
              className="text-sm text-[#ffd39e] hover:text-[#ffe4be] transition-colors cursor-pointer"
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
        className="space-y-6 rounded-[2rem] border border-primary/12 bg-[rgba(40,55,72,0.94)] p-6 text-white shadow-[0_30px_80px_rgba(28,36,50,0.18)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-display text-2xl font-semibold leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-white/68 leading-6">{question.description}</p>
        )}
        <div className="pt-4">
          {/* Dots row with connecting line */}
          <div className="relative flex items-start justify-between px-2">
            {/* Connecting line behind dots */}
            <div className="absolute top-5 left-7 right-7 h-px bg-white/14" />
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
                        ? "border-[#ffd39e] bg-[#ffd39e]/14 shadow-[0_12px_30px_rgba(15,21,28,0.3)]"
                        : "border-white/24 bg-white/8 group-hover:border-white/40 group-hover:bg-white/12"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-[#ffd39e]"
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs transition-colors whitespace-nowrap hidden sm:block ${
                      isSelected ? "text-[#ffe4be] font-medium" : "text-white/48"
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
            <span className="text-xs text-white/44">{scaleChoices[0]?.label}</span>
            <span className="text-xs text-white/44">{scaleChoices[scaleChoices.length - 1]?.label}</span>
          </div>
        </div>
        {/* Skip */}
        <div className="pt-1">
          <button
            onClick={() => onAnswer("skip")}
            className="text-xs text-white/52 hover:text-white/78 transition-colors cursor-pointer"
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
      className="space-y-4 rounded-[2rem] border border-primary/12 bg-[rgba(40,55,72,0.94)] p-6 text-white shadow-[0_30px_80px_rgba(28,36,50,0.18)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display text-2xl font-semibold leading-relaxed">{question.question}</h3>
      {question.description && (
        <p className="text-sm text-white/68 mt-1 leading-6">{question.description}</p>
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
              className={`w-full text-left py-4.5 px-5 rounded-[1.25rem] border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-[#ffd39e]/60 bg-[#ffd39e]/14 shadow-[0_14px_40px_rgba(20,26,35,0.28)]"
                  : "border-white/10 bg-white/6 hover:border-white/18 hover:bg-white/10"
              }`}
            >
              <span className="text-sm leading-relaxed text-white/92">{choice.label}</span>
            </motion.button>
          );
        })}
      </div>
      {/* Secondary skip action */}
      <div className="pt-1">
        <button
          onClick={() => onAnswer("skip")}
          className="text-xs text-white/52 hover:text-white/78 transition-colors cursor-pointer"
        >
          不确定 / 跳过本题
        </button>
      </div>
    </motion.div>
  );
}
