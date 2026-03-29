import { Chapter, Question } from "@/types";

export const chapters: Chapter[] = [
  { id: 1, title: "安全与底线", subtitle: "建立长期关系的前提", icon: "🌿" },
  { id: 2, title: "互动与情绪", subtitle: "你注意过你们的情绪互动模式吗？", icon: "🧑‍🤝‍🧑" },
  { id: 3, title: "价值观与核心规划", subtitle: "你们的三观与规划契合吗？", icon: "🧩" },
  { id: 4, title: "家庭边界", subtitle: "追溯原生家庭的影响", icon: "🏠" },
  { id: 5, title: "主观体感", subtitle: "你的感受很重要", icon: "💗" },
];

export const questions: Question[] = [
  // ─── Chapter 1: 安全与底线 (Q1–Q6) ───

  {
    id: 1,
    chapter: 1,
    question: "在边界和忠诚上，伴侣更接近：",
    type: "single",
    dimension: "loyalty",
    choices: [
      { label: "边界清楚，我很安心", value: "A", tags: { safe: 3, loyal: 3 } },
      { label: "偶尔让我不舒服，但能沟通", value: "B", tags: { safe: 1, loyal: 1 } },
      { label: "经常越界，还说我想太多", value: "C", tags: { risk: 2, dismissive: 2, gaslighting: 1 } },
      { label: "有隐瞒暧昧、背叛或反复欺骗", value: "D", tags: { danger: 5, risk: 5, selfish: 3 } },
    ],
  },
  {
    id: 2,
    chapter: 1,
    question: "在诚实和透明度上，伴侣更接近：",
    type: "single",
    dimension: "trust",
    choices: [
      { label: "基本透明坦诚", value: "A", tags: { safe: 2, loyal: 2 } },
      { label: "有过隐瞒，但沟通后愿意坦诚", value: "B", tags: { safe: 1 } },
      { label: "重要事情常靠我发现", value: "C", tags: { risk: 3, selfish: 2 } },
      { label: "经常撒谎或有重大隐瞒", value: "D", tags: { danger: 4, risk: 4, selfish: 3, gaslighting: 2 } },
    ],
  },
  {
    id: 3,
    chapter: 1,
    question: "在查手机、社交对象这些事上，对方通常：",
    type: "single",
    dimension: "safety",
    choices: [
      { label: "尊重边界，不过度查问", value: "A", tags: { safe: 3, mature: 1 } },
      { label: "偶尔在意，但讲得通", value: "B", tags: { safe: 1 } },
      { label: "常查问、试探、要求解释", value: "C", tags: { risk: 2, controlled: 2 } },
      { label: "会监控、检查或限制我", value: "D", tags: { danger: 4, controlled: 4, risk: 4 } },
    ],
  },
  {
    id: 4,
    chapter: 1,
    question: "在钱和财务边界上，伴侣更接近：",
    type: "single",
    dimension: "money",
    choices: [
      { label: "对钱坦诚，会主动商量", value: "A", tags: { safe: 2, compatible: 2 } },
      { label: "偶尔保留，但不伤信任", value: "B", tags: { safe: 1, compatible: 1 } },
      { label: "会隐瞒消费、债务或借贷", value: "C", tags: { risk: 2, selfish: 1 } },
      { label: "会控制我用钱或逼我承担", value: "D", tags: { danger: 4, controlled: 3, risk: 3 } },
    ],
  },
  {
    id: 5,
    chapter: 1,
    question: "在身体边界上，对方通常：",
    type: "single",
    dimension: "safety",
    choices: [
      { label: "尊重我的意愿和节奏", value: "A", tags: { safe: 3, mature: 1 } },
      { label: "偶有落差，但能沟通调整", value: "B", tags: { safe: 1 } },
      { label: "会施压，让我有负担", value: "C", tags: { risk: 2, controlled: 2, mental_anxious: 1 } },
      { label: "有过强迫、羞辱或明显越界", value: "D", tags: { danger: 5, risk: 5, mental_depressed: 3 } },
    ],
  },
  {
    id: 6,
    chapter: 1,
    question: "你是否曾因对方感到害怕或不敢表达？",
    type: "single",
    dimension: "safety",
    choices: [
      { label: "从未，能安心表达", value: "A", tags: { safe: 3, mental_healthy: 1 } },
      { label: "有时会怕对方生气或冷暴力", value: "B", tags: { risk: 1, verbal_abuse: 1, mental_anxious: 1 } },
      { label: "会，经常被对方责骂、威胁", value: "C", tags: { risk: 3, verbal_abuse: 3, controlled: 2, mental_depressed: 2 } },
      { label: "非常，害怕被跟踪、侮辱或伤及人身安全", value: "D", tags: { danger: 5, risk: 5, controlled: 3, mental_depressed: 3 } },
    ],
  },

  // ─── Chapter 2: 互动与情绪模式 (Q7–Q10) ───

  {
    id: 7,
    chapter: 2,
    question: "发生矛盾时，你通常先：",
    type: "single",
    dimension: "conflict",
    choices: [
      { label: "积极沟通，想解决办法", value: "A", tags: { mature: 2 } },
      { label: "沉默、回避或消失，希望问题自动解决", value: "B", tags: { avoidant: 2 } },
      { label: "情绪失控，需要被安抚和理解", value: "C", tags: { mental_anxious: 1 } },
      { label: "防御辩解，指责对方错得更多", value: "D", tags: { selfish: 1, dismissive: 1 } },
    ],
  },
  {
    id: 8,
    chapter: 2,
    question: "发生矛盾时，伴侣通常先：",
    type: "single",
    dimension: "conflict",
    choices: [
      { label: "积极沟通，想解决办法", value: "A", tags: { mature: 2, safe: 1 } },
      { label: "沉默、回避或消失，希望问题自动解决", value: "B", tags: { avoidant: 2 } },
      { label: "情绪失控，需要被安抚和理解", value: "C", tags: { risk: 1, mental_unstable: 1 } },
      { label: "防御辩解，指责你错得更多", value: "D", tags: { risk: 2, selfish: 2, gaslighting: 1 } },
    ],
  },
  {
    id: 9,
    chapter: 2,
    question: "矛盾发生后，你们最常见的处理是：",
    type: "single",
    dimension: "conflict",
    choices: [
      { label: "能很快沟通修复矛盾", value: "A", tags: { mature: 3, safe: 2 } },
      { label: "过一阵能修复", value: "B", tags: { mature: 1, safe: 1 } },
      { label: "一直冷战或拖着不谈", value: "C", tags: { avoidant: 3, mental_depressed: 1 } },
      { label: "翻旧账、反复爆发或拉黑", value: "D", tags: { danger: 2, risk: 3, verbal_abuse: 3, mental_depressed: 2 } },
    ],
  },
  {
    id: 10,
    chapter: 2,
    question: "当你表达不满或边界时，对方通常：",
    type: "single",
    dimension: "communication",
    choices: [
      { label: "认真听并调整", value: "A", tags: { mature: 3, safe: 2 } },
      { label: "当下防御，之后会改", value: "B", tags: { mature: 1, safe: 1 } },
      { label: "常把问题推回给我", value: "C", tags: { selfish: 3, dismissive: 2, gaslighting: 2 } },
      { label: "用失联、分手、自伤或情绪失控逼我让步", value: "D", tags: { danger: 4, controlled: 3, mental_unstable: 3 } },
    ],
  },

  // ─── Chapter 3: 价值观与核心规划 (Q11–Q16) ───

  {
    id: 11,
    chapter: 3,
    question: "在花钱和财务协作上，你们更接近：",
    type: "single",
    dimension: "money",
    choices: [
      { label: "观念接近，会商量", value: "A", tags: { compatible: 3 } },
      { label: "有差异，但能尊重", value: "B", tags: { compatible: 2 } },
      { label: "没规则，常有摩擦", value: "C", tags: { incompatible: 1 } },
      { label: "经常因为钱吵架", value: "D", tags: { incompatible: 3, conflict: 1 } },
    ],
  },
  {
    id: 12,
    chapter: 3,
    question: "在未来规划上，你们更接近：",
    type: "single",
    dimension: "values",
    choices: [
      { label: "基本都吻合", value: "A", tags: { compatible: 3, mature: 2 } },
      { label: "大方向一致，细节在磨合", value: "B", tags: { compatible: 2, mature: 1 } },
      { label: "还没认真谈过", value: "C", tags: { immature: 1, avoidant: 1 } },
      { label: "分歧大，或对方一直回避", value: "D", tags: { incompatible: 3, stubborn: 2, avoidant: 2 } },
    ],
  },
  {
    id: 13,
    chapter: 3,
    question: "对婚姻的理解，你们更接近：",
    type: "single",
    dimension: "values",
    choices: [
      { label: "对未来方向和节奏都有共识", value: "A", tags: { compatible: 3, mature: 2 } },
      { label: "大方向一致，但一些现实安排还在磨合", value: "B", tags: { compatible: 2 } },
      { label: "还没认真谈过未来规划", value: "C", tags: { immature: 1, avoidant: 1 } },
      { label: "分歧明显，或对方常回避相关讨论", value: "D", tags: { incompatible: 3 } },
    ],
  },
  {
    id: 14,
    chapter: 3,
    question: "对结婚这件事，伴侣目前更接近：",
    type: "single",
    dimension: "values",
    choices: [
      { label: "有明确结婚意愿，也愿意推进现实规划", value: "A", tags: { mature: 3, compatible: 2 } },
      { label: "有结婚意愿，但还没准备好进入具体规划", value: "B", tags: { mature: 1, compatible: 1 } },
      { label: "态度不明确，常回避或拖延讨论", value: "C", tags: { avoidant: 2, immature: 2, incompatible: 1 } },
      { label: "明确表示目前不考虑结婚", value: "D", tags: { incompatible: 3, immature: 2 } },
    ],
  },
  {
    id: 15,
    chapter: 3,
    question: "对你追求兴趣、事业和成长，伴侣更接近：",
    type: "single",
    dimension: "respect",
    choices: [
      { label: "支持并鼓励", value: "A", tags: { safe: 2, mature: 2, compatible: 1 } },
      { label: "尊重，不太干涉", value: "B", tags: { safe: 1, compatible: 1 } },
      { label: "嘴上支持，实际常泼冷水", value: "C", tags: { dismissive: 1, controlled: 1 } },
      { label: "会贬低、阻拦或控制", value: "D", tags: { controlled: 3, selfish: 2, verbal_abuse: 1, incompatible: 2 } },
    ],
  },
  {
    id: 16,
    chapter: 3,
    question: "在责任分配上，你们更接近：",
    type: "single",
    dimension: "responsibility",
    choices: [
      { label: "分工大致均衡，彼此都认可", value: "A", tags: { mature: 3, compatible: 2 } },
      { label: "偶有偏多偏少，但整体还能协调", value: "B", tags: { mature: 1, compatible: 1 } },
      { label: "长期主要由我承担，我常觉得失衡", value: "C", tags: { unbalanced: 3, selfish: 2, mental_depressed: 2, drain: 2 } },
      { label: "基本由对方承担", value: "D", tags: { unbalanced: 2, immature: 1 } },
    ],
  },

  // ─── Chapter 4: 家庭边界 (Q17–Q18) ───

  {
    id: 17,
    chapter: 4,
    question: "伴侣原生家庭的互动模式更接近：",
    type: "single",
    dimension: "family",
    choices: [
      { label: "和谐稳定，互相尊重", value: "A", tags: { family_healthy: 3, safe: 1 } },
      { label: "有冲突，但能修复", value: "B", tags: { family_healthy: 1 } },
      { label: "冷漠、压抑或回避", value: "C", tags: { family_risk: 2 } },
      { label: "强行控制，暴力或其他严重问题", value: "D", tags: { family_risk: 4, danger: 2 } },
    ],
  },
  {
    id: 18,
    chapter: 4,
    question: "在对父母的边界感上，伴侣更接近：",
    type: "single",
    dimension: "family_boundary",
    choices: [
      { label: "有边界，有独立的思考", value: "A", tags: { mature: 3, family_healthy: 2 } },
      { label: "会受父母影响，但会和我商量", value: "B", tags: { mature: 1, family_healthy: 1 } },
      { label: "明显更站父母那边", value: "C", tags: { immature: 2, family_risk: 2, incompatible: 1 } },
      { label: "父母说了算", value: "D", tags: { immature: 3, family_risk: 3, incompatible: 2 } },
    ],
  },

  // ─── Chapter 5: 主观体感 (Q19–Q25) ───

  {
    id: 19,
    chapter: 5,
    question: "用一句话形容这段关系，你更接近：",
    type: "single",
    dimension: "core_wish",
    choices: [
      { label: "安稳踏实自在，能坚定往前走", value: "A", tags: { compatible: 3, safe: 2, mental_healthy: 2 } },
      { label: "有爱也有矛盾，能在磨合中前进", value: "B", tags: { compatible: 2, mental_healthy: 1 } },
      { label: "好的时候很好，坏的时候很伤", value: "C", tags: { mental_anxious: 2, drain: 2 } },
      { label: "常在这段关系里失去自我", value: "D", tags: { mental_depressed: 3, controlled: 2, drain: 4 } },
    ],
  },
  {
    id: 20,
    chapter: 5,
    question: "这段关系里，最让你感到消耗的是？",
    description: "可选 1–2 项",
    type: "multi",
    maxSelections: 2,
    dimension: "core_wish",
    choices: [
      { label: "常感到不被理解或不被回应", value: "A", tags: { unbalanced: 2, mental_depressed: 1, drain: 1 } },
      { label: "缺乏稳定感与安全感", value: "B", tags: { anxious: 3, mental_anxious: 2, drain: 2 } },
      { label: "冲突反复，难以真正修复", value: "C", tags: { avoidant: 2, mental_depressed: 2, drain: 2 } },
      { label: "现实压力长期压在关系上", value: "D", tags: { incompatible: 2, drain: 1 } },
      { label: "边界不被尊重，常需要委屈自己", value: "E", tags: { controlled: 3, mental_depressed: 2, drain: 3 } },
      { label: "基本没有明显消耗", value: "F", tags: { compatible: 2, mental_healthy: 1 } },
    ],
  },
  {
    id: 21,
    chapter: 5,
    question: "你有多喜欢对方？请真诚回答",
    type: "scale",
    dimension: "affection",
    choices: [
      { label: "很不喜欢", value: "1", tags: { incompatible: 5, drain: 4, mental_depressed: 2 } },
      { label: "不太喜欢", value: "2", tags: { incompatible: 3, drain: 2 } },
      { label: "一般", value: "3", tags: { incompatible: 1 } },
      { label: "比较喜欢", value: "4", tags: { compatible: 2, mental_healthy: 1 } },
      { label: "非常喜欢", value: "5", tags: { compatible: 4, mental_healthy: 2, safe: 1 } },
    ],
  },
  {
    id: 22,
    chapter: 5,
    question: "你觉得TA有多喜欢你？请真诚回答",
    type: "scale",
    dimension: "affection",
    choices: [
      { label: "很不喜欢我", value: "1", tags: { unbalanced: 5, mental_depressed: 3, drain: 4 } },
      { label: "不太喜欢我", value: "2", tags: { unbalanced: 3, mental_anxious: 2, drain: 2 } },
      { label: "一般", value: "3", tags: { unbalanced: 1 } },
      { label: "比较喜欢我", value: "4", tags: { safe: 2, loyal: 1 } },
      { label: "非常喜欢我", value: "5", tags: { safe: 3, loyal: 2, compatible: 2 } },
    ],
  },
  {
    id: 23,
    chapter: 5,
    question: "你愿意包容TA的缺点吗？",
    type: "scale",
    dimension: "tolerance",
    choices: [
      { label: "完全不愿意", value: "1", tags: { incompatible: 4, drain: 3 } },
      { label: "不太愿意", value: "2", tags: { incompatible: 2, drain: 1 } },
      { label: "一般", value: "3", tags: {} },
      { label: "比较愿意", value: "4", tags: { compatible: 2, mature: 1 } },
      { label: "非常愿意", value: "5", tags: { compatible: 3, mature: 2 } },
    ],
  },
  {
    id: 24,
    chapter: 5,
    question: "TA愿意包容你的缺点吗？",
    type: "scale",
    dimension: "tolerance",
    choices: [
      { label: "完全不愿意", value: "1", tags: { selfish: 4, dismissive: 3, drain: 4, controlled: 1 } },
      { label: "不太愿意", value: "2", tags: { selfish: 2, dismissive: 2, drain: 2 } },
      { label: "一般", value: "3", tags: {} },
      { label: "比较愿意", value: "4", tags: { safe: 2, mature: 1 } },
      { label: "非常愿意", value: "5", tags: { safe: 3, mature: 3, compatible: 2 } },
    ],
  },
  {
    id: 25,
    chapter: 5,
    question: "还有什么想补充的吗？",
    description: "只写一个最能代表这段关系的瞬间即可。比如：最近一次让你怀疑「TA 适不适合结婚」的事。",
    type: "text",
    dimension: "freeform",
  },
];
