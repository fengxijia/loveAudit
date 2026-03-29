"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tips = [
  { title: "认知行为疗法 (CBT)", content: "你的想法不等于事实。学会质疑消极的自动化思维，是走出焦虑的第一步。" },
  { title: "你值得被好好对待", content: "健康的关系应该让你感到安全和被尊重，而不是小心翼翼。" },
  { title: "关于「配得感」", content: "你不需要变得完美才值得被爱。接纳真实的自己，是建立健康关系的基础。" },
  { title: "分清责任边界", content: "对方的情绪不是你的责任，你的幸福也不该完全依赖对方。" },
  { title: "识别情绪操控", content: "如果对方经常让你觉得「一切都是你的错」，这可能是情绪操控的信号。" },
  { title: "关于「沉没成本」", content: "已经投入的时间不是继续一段不健康关系的理由。你的未来比过去更重要。" },
];

export default function CbtTips() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-32 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="text-center px-6 absolute"
        >
          <p className="text-xs font-mono text-neon/70 mb-2">
            {tips[current].title}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {tips[current].content}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
