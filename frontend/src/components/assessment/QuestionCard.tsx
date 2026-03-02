"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: string, tags: Record<string, number>) => void;
  selectedValue?: string;
}

export default function QuestionCard({ question, onAnswer, selectedValue }: QuestionCardProps) {
  const [textValue, setTextValue] = useState("");

  if (question.type === "text") {
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-medium leading-relaxed">{question.question}</h3>
        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="在这里输入（可跳过）..."
          className="w-full h-32 bg-secondary/50 border border-purple-500/20 rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-400/50 resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={() => onAnswer("", {})}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            跳过 →
          </button>
          {textValue.trim() && (
            <button
              onClick={() => onAnswer(textValue, {})}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
            >
              提交 →
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-medium leading-relaxed">{question.question}</h3>
      {question.description && (
        <p className="text-sm text-muted-foreground">{question.description}</p>
      )}
      <div className="space-y-3 mt-6">
        {question.choices?.map((choice, i) => {
          const isSelected = selectedValue === choice.value;
          return (
            <motion.button
              key={choice.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => onAnswer(choice.value, choice.tags)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                  : "border-purple-500/15 bg-secondary/30 hover:border-purple-500/40 hover:bg-secondary/60"
              }`}
            >
              <span className="text-sm">{choice.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
