"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tips = [
  { title: "结果说明", content: "系统会优先整理风险信号、冲突方式和长期协作能力，再生成文字报告。" },
  { title: "关于风险", content: "安全感、边界和尊重通常比短期情绪更能说明关系质量。" },
  { title: "关于沟通", content: "如果多道题都让你长期感到犹豫或压抑，这本身就是值得讨论的信息。" },
  { title: "关于适配", content: "长期关系的适配不仅是喜欢，还包括现实协作、承诺和修复能力。" },
  { title: "关于判断", content: "这份结果更适合作为沟通和观察的参考，而不是替你做最终决定。" },
  { title: "关于复盘", content: "如果你们正处在冲突期，间隔一段时间再次作答，往往更容易看出模式。" },
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
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
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
