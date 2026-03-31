"use client";

import { motion } from "framer-motion";

const hooks = [
  {
    question: "你是否会因伴侣提起前任而难过？",
    subtext: "你的不安并非小题大做",
  },
  {
    question: "你是否被伴侣与异性的交往边界困扰？",
    subtext: "边界模糊是关系最大的隐患之一",
  },
  {
    question: "你是否处在一段将就的关系中？",
    subtext: "沉没成本正在消耗你的生命",
  },
  {
    question: "你是否被NPD、三角测量等概念越搞越焦虑？",
    subtext: "网红名词可能正在误导你",
  },
];

// Desktop: staircase indent; Mobile: all left-aligned
const indents = ["sm:ml-0", "sm:ml-10", "sm:ml-20", "sm:ml-30"];

export default function HookCards() {
  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto relative z-10 pl-10 pr-4 sm:pl-28 sm:pr-0">
      {hooks.map((hook, i) => (
        <motion.div
          key={i}
          className={`flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 ${indents[i]}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.2, duration: 0.5 }}
        >
          <p className="text-base sm:text-lg lg:text-xl text-foreground/80 font-display whitespace-nowrap">
            {hook.question}
          </p>
          <span className="text-sm sm:text-base lg:text-lg text-neon/50 font-display whitespace-nowrap">
            —— {hook.subtext}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
