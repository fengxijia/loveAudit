"use client";

import { motion } from "framer-motion";
import { chapters } from "@/data/questions";

interface ChapterIntroProps {
  chapterId: number;
  onContinue: () => void;
}

export default function ChapterIntro({ chapterId, onContinue }: ChapterIntroProps) {
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.span
        className="text-5xl mb-6"
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
      >
        <p className="text-xs font-mono text-cyan-400/70 tracking-widest mb-2">
          CHAPTER {chapter.id} / 5
        </p>
        <h2 className="text-2xl font-bold text-glow-purple mb-2">{chapter.title}</h2>
        <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>
      </motion.div>

      <motion.div
        className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />

      <motion.button
        className="mt-8 text-sm font-mono text-cyan-400/80 hover:text-cyan-400 transition-colors cursor-pointer"
        onClick={onContinue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        点击继续 →
      </motion.button>
    </motion.div>
  );
}
