"use client";

import { motion } from "framer-motion";
import { getAssessmentModeMeta, getChaptersForMode } from "@/data/questions";
import type { AssessmentMode } from "@/types";

interface ChapterIntroProps {
  assessmentMode: AssessmentMode;
  chapterId: number;
  onContinue: () => void;
}

export default function ChapterIntro({
  assessmentMode,
  chapterId,
  onContinue,
}: ChapterIntroProps) {
  const chapters = getChaptersForMode(assessmentMode);
  const chapter = chapters.find((c) => c.id === chapterId);
  const modeMeta = getAssessmentModeMeta(assessmentMode);
  if (!chapter) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,102,130,0.24),transparent_30%),linear-gradient(180deg,#e3eaef,#eff3f6)]" />
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="rounded-[2.25rem] border border-primary/12 bg-[rgba(40,55,72,0.94)] px-8 py-10 text-white shadow-[0_30px_90px_rgba(28,36,50,0.18)]">
          <motion.span
            className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm tracking-[0.2em] text-[#ffe4be]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {chapter.icon}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-xs tracking-[0.24em] text-white/58 mb-4">
              {modeMeta.shortTitle} / 第 {chapter.id} 章
            </p>
            <h2 className="text-3xl font-bold font-display text-white mb-3">
              {chapter.title}
            </h2>
            <p className="text-sm text-white/72 max-w-md leading-relaxed">
              {chapter.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-white/28 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />

          <motion.button
            className="mt-8 rounded-full bg-[#ffd39e] px-6 py-3 text-sm text-[#203243] shadow-lg shadow-black/15 transition-transform hover:-translate-y-0.5 cursor-pointer"
            onClick={onContinue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            进入这一章
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
