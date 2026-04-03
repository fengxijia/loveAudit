import type {
  AssessmentMode,
  AssessmentModeMeta,
  Chapter,
  Choice,
  Question,
} from "@/types";

const makeScaleChoices = (
  labels: [string, string, string, string, string]
): Choice[] =>
  labels.map((label, index) => ({
    label,
    value: String(index + 1),
  }));

const agreementChoices = makeScaleChoices([
  "完全不符合",
  "较不符合",
  "一般",
  "较符合",
  "非常符合",
]);

const frequencyChoices = makeScaleChoices([
  "几乎从不",
  "偶尔",
  "有时",
  "经常",
  "几乎总是",
]);

const qualityChoices = makeScaleChoices([
  "很差",
  "较差",
  "一般",
  "较好",
  "很好",
]);

const supportChoices = makeScaleChoices([
  "完全接不住",
  "大多接不住",
  "一般",
  "大多接得住",
  "稳定接得住",
]);

const standardChapters: Chapter[] = [
  { id: 1, title: "安全与底线", subtitle: "先看关系里安不安全", icon: "01" },
  { id: 2, title: "互动与情绪", subtitle: "冲突方式比甜蜜更说明问题", icon: "02" },
  { id: 3, title: "价值观与现实", subtitle: "长期关系要看能不能一起过日子", icon: "03" },
  { id: 4, title: "家庭边界", subtitle: "婚前冲突常常不只发生在你们两个人之间", icon: "04" },
  { id: 5, title: "主观体感", subtitle: "你的身体和情绪已经在告诉你答案", icon: "05" },
];

const deepChapters: Chapter[] = [
  { id: 1, title: "安全与边界", subtitle: "筛出不该被浪漫叙事掩盖的风险", icon: "01" },
  { id: 2, title: "冲突与修复", subtitle: "看你们怎么吵，也看吵完以后怎么收", icon: "02" },
  { id: 3, title: "信任与承诺", subtitle: "稳定感不是承诺一句话，而是可验证的连续行为", icon: "03" },
  { id: 4, title: "价值观与现实协作", subtitle: "婚前适配更多体现在日常协同，而不是口头喜欢", icon: "04" },
  { id: 5, title: "依恋与情绪调节", subtitle: "你们如何安抚彼此，也如何不把彼此耗空", icon: "05" },
  { id: 6, title: "家庭系统与长期边界", subtitle: "两个人能不能结婚，往往也取决于两个系统能否分清边界", icon: "06" },
  { id: 7, title: "关系体感与未来预判", subtitle: "把隐隐觉得不对劲的地方说清楚", icon: "07" },
];

const modeMeta: AssessmentModeMeta[] = [
  {
    id: "core25",
    title: "基础版 25 题",
    shortTitle: "25 题",
    subtitle: "适合快速完成一次关系梳理",
    description: "保留核心题目，优先判断安全、适配和修复能力。",
    questionCount: 25,
    estimate: "约 4 分钟",
    badge: "基础版",
  },
  {
    id: "mirror50",
    title: "对照版 50 题",
    shortTitle: "50 题",
    subtitle: "加入对伴侣视角的判断题",
    description: "在核心题目外增加对照题，便于观察双方认知落差。",
    questionCount: 50,
    estimate: "约 7 分钟",
    badge: "对照版",
  },
  {
    id: "deep99",
    title: "完整版 99 题",
    shortTitle: "99 题",
    subtitle: "覆盖边界、修复、承诺与家庭系统",
    description: "适合需要更完整信息的人群，用于更细的关系判断和复盘。",
    questionCount: 99,
    estimate: "约 12 分钟",
    badge: "完整版",
  },
];

const makeSingle = (
  id: number,
  chapter: number,
  question: string,
  dimension: string,
  choices: Choice[],
  description?: string
): Question => ({
  id,
  chapter,
  question,
  description,
  type: "single",
  dimension,
  choices,
  perspective: "self",
});

const makeScale = (
  id: number,
  chapter: number,
  question: string,
  dimension: string,
  choices: Choice[],
  description?: string
): Question => ({
  id,
  chapter,
  question,
  description,
  type: "scale",
  dimension,
  choices,
  perspective: "self",
});

const makeMulti = (
  id: number,
  chapter: number,
  question: string,
  dimension: string,
  choices: Choice[],
  maxSelections: number,
  description?: string
): Question => ({
  id,
  chapter,
  question,
  description,
  type: "multi",
  maxSelections,
  dimension,
  choices,
  perspective: "self",
});

const makeText = (
  id: number,
  chapter: number,
  question: string,
  dimension: string,
  description?: string
): Question => ({
  id,
  chapter,
  question,
  description,
  type: "text",
  dimension,
  perspective: "self",
});

const standardQuestions: Question[] = [
  makeSingle(1, 1, "在边界和忠诚上，伴侣更接近：", "loyalty", [
    { label: "边界清楚，我很安心", value: "A" },
    { label: "偶尔让我不舒服，但能沟通", value: "B" },
    { label: "经常越界，还说我想太多", value: "C" },
    { label: "有隐瞒暧昧、背叛或反复欺骗", value: "D" },
  ]),
  makeSingle(2, 1, "在诚实和透明度上，伴侣更接近：", "trust", [
    { label: "基本透明坦诚", value: "A" },
    { label: "有过隐瞒，但沟通后愿意坦诚", value: "B" },
    { label: "重要事情常靠我发现", value: "C" },
    { label: "经常撒谎或有重大隐瞒", value: "D" },
  ]),
  makeSingle(3, 1, "在查手机、社交对象这些事上，对方通常：", "safety", [
    { label: "尊重边界，不过度查问", value: "A" },
    { label: "偶尔在意，但讲得通", value: "B" },
    { label: "常查问、试探、要求解释", value: "C" },
    { label: "会监控、检查或限制我", value: "D" },
  ]),
  makeSingle(4, 1, "在钱和财务边界上，伴侣更接近：", "money", [
    { label: "对钱坦诚，会主动商量", value: "A" },
    { label: "偶尔保留，但不伤信任", value: "B" },
    { label: "会隐瞒消费、债务或借贷", value: "C" },
    { label: "会控制我用钱或逼我承担", value: "D" },
  ]),
  makeSingle(5, 1, "在身体边界上，对方通常：", "safety", [
    { label: "尊重我的意愿和节奏", value: "A" },
    { label: "偶有落差，但能沟通调整", value: "B" },
    { label: "会施压，让我有负担", value: "C" },
    { label: "有过强迫、羞辱或明显越界", value: "D" },
  ]),
  makeSingle(6, 1, "你是否曾因害怕对方而不敢表达？", "safety", [
    { label: "从未，能安心表达", value: "A" },
    { label: "会斟酌语气，怕对方不高兴", value: "B" },
    { label: "经常不敢说，怕被冷落、责怪或威胁", value: "C" },
    { label: "基本不敢说，担心被羞辱、报复或伤害", value: "D" },
  ]),
  makeSingle(7, 2, "发生矛盾时，你通常先：", "conflict", [
    { label: "积极沟通，想解决办法", value: "A" },
    { label: "沉默、回避或消失，希望问题自动解决", value: "B" },
    { label: "情绪失控，需要被安抚和理解", value: "C" },
    { label: "防御辩解，指责对方错得更多", value: "D" },
  ]),
  makeSingle(8, 2, "发生矛盾时，伴侣通常先：", "conflict", [
    { label: "积极沟通，想解决办法", value: "A" },
    { label: "沉默、回避或消失，希望问题自动解决", value: "B" },
    { label: "情绪失控，需要被安抚和理解", value: "C" },
    { label: "防御辩解，指责你错得更多", value: "D" },
  ]),
  makeSingle(9, 2, "矛盾发生后，你们最常见的处理是：", "conflict", [
    { label: "能很快沟通修复矛盾", value: "A" },
    { label: "过一阵能修复", value: "B" },
    { label: "一直冷战或拖着不谈", value: "C" },
    { label: "翻旧账、反复爆发或拉黑", value: "D" },
  ]),
  makeSingle(10, 2, "当你表达不满或边界时，对方通常：", "communication", [
    { label: "认真听并调整", value: "A" },
    { label: "当下防御，之后会改", value: "B" },
    { label: "常把问题推回给我", value: "C" },
    { label: "用失联、分手、自伤或情绪失控逼我让步", value: "D" },
  ]),
  makeSingle(11, 3, "在花钱和财务协作上，你们更接近：", "money", [
    { label: "观念接近，会商量", value: "A" },
    { label: "有差异，但能尊重", value: "B" },
    { label: "没规则，常有摩擦", value: "C" },
    { label: "经常因为钱吵架", value: "D" },
  ]),
  makeSingle(12, 3, "在未来规划上，你们更接近：", "values", [
    { label: "基本都吻合", value: "A" },
    { label: "大方向一致，细节在磨合", value: "B" },
    { label: "还没认真谈过", value: "C" },
    { label: "分歧大，或对方一直回避", value: "D" },
  ]),
  makeSingle(13, 3, "对婚姻的理解，你们更接近：", "values", [
    { label: "对未来方向和节奏都有共识", value: "A" },
    { label: "大方向一致，但一些现实安排还在磨合", value: "B" },
    { label: "还没认真谈过未来规划", value: "C" },
    { label: "分歧明显，或对方常回避相关讨论", value: "D" },
  ]),
  makeSingle(14, 3, "对结婚这件事，伴侣目前更接近：", "values", [
    { label: "有明确结婚意愿，也愿意推进现实规划", value: "A" },
    { label: "有结婚意愿，但还没准备好进入具体规划", value: "B" },
    { label: "态度不明确，常回避或拖延讨论", value: "C" },
    { label: "明确表示目前不考虑结婚", value: "D" },
  ]),
  makeSingle(15, 3, "对你追求兴趣、事业和成长，伴侣更接近：", "respect", [
    { label: "支持并鼓励", value: "A" },
    { label: "尊重，不太干涉", value: "B" },
    { label: "嘴上支持，实际常泼冷水", value: "C" },
    { label: "会贬低、阻拦或控制", value: "D" },
  ]),
  makeSingle(16, 3, "在责任分配上，你们更接近：", "responsibility", [
    { label: "分工大致均衡，彼此都认可", value: "A" },
    { label: "偶有偏多偏少，但整体还能协调", value: "B" },
    { label: "长期主要由我承担，我常觉得失衡", value: "C" },
    { label: "基本由对方承担", value: "D" },
  ]),
  makeSingle(17, 4, "伴侣原生家庭的互动模式更接近：", "family", [
    { label: "和谐稳定，互相尊重", value: "A" },
    { label: "有冲突，但能修复", value: "B" },
    { label: "冷漠、压抑或回避", value: "C" },
    { label: "强行控制，暴力或其他严重问题", value: "D" },
  ]),
  makeSingle(18, 4, "在对父母的边界感上，伴侣更接近：", "family_boundary", [
    { label: "有边界，有独立的思考", value: "A" },
    { label: "会受父母影响，但会和我商量", value: "B" },
    { label: "明显更站父母那边", value: "C" },
    { label: "父母说了算", value: "D" },
  ]),
  makeSingle(19, 5, "用一句话形容这段关系，你更接近：", "core_wish", [
    { label: "安稳踏实自在，能坚定往前走", value: "A" },
    { label: "有爱也有矛盾，能在磨合中前进", value: "B" },
    { label: "好的时候很好，坏的时候很伤", value: "C" },
    { label: "常在这段关系里失去自我", value: "D" },
  ]),
  makeMulti(
    20,
    5,
    "这段关系里，最让你感到消耗的是？",
    "core_wish",
    [
      { label: "常感到不被理解或不被回应", value: "A" },
      { label: "缺乏稳定感与安全感", value: "B" },
      { label: "冲突反复，难以真正修复", value: "C" },
      { label: "现实压力长期压在关系上", value: "D" },
      { label: "边界不被尊重，常需要委屈自己", value: "E" },
      { label: "基本没有明显消耗", value: "F" },
    ],
    2,
    "可选 1–2 项"
  ),
  makeScale(21, 5, "你有多喜欢对方？请真诚回答", "affection", [
    { label: "很不喜欢", value: "1" },
    { label: "不太喜欢", value: "2" },
    { label: "一般", value: "3" },
    { label: "比较喜欢", value: "4" },
    { label: "非常喜欢", value: "5" },
  ]),
  makeScale(22, 5, "你觉得对方有多喜欢你？请真诚回答", "affection", [
    { label: "很不喜欢我", value: "1" },
    { label: "不太喜欢我", value: "2" },
    { label: "一般", value: "3" },
    { label: "比较喜欢我", value: "4" },
    { label: "非常喜欢我", value: "5" },
  ]),
  makeScale(23, 5, "你愿意包容对方的缺点吗？", "tolerance", [
    { label: "完全不愿意", value: "1" },
    { label: "不太愿意", value: "2" },
    { label: "一般", value: "3" },
    { label: "比较愿意", value: "4" },
    { label: "非常愿意", value: "5" },
  ]),
  makeScale(24, 5, "对方愿意包容你的缺点吗？", "tolerance", [
    { label: "完全不愿意", value: "1" },
    { label: "不太愿意", value: "2" },
    { label: "一般", value: "3" },
    { label: "比较愿意", value: "4" },
    { label: "非常愿意", value: "5" },
  ]),
  makeText(
    25,
    5,
    "还有什么想补充的吗？",
    "freeform",
    "只写一个最能代表这段关系的瞬间即可，比如最近一次让你怀疑“对方是否适合进入婚姻”的事。"
  ),
];

const createMirrorPrompt = (question: Question) => {
  if (question.type === "text") {
    return "如果让对方来写一句补充，对方最可能会怎么描述这段关系？";
  }
  return `${question.question.replace(/：$/, "")}（如果把这题直接问给对方本人，你觉得对方会怎么答？）`;
};

const createMirrorDescription = (question: Question) => {
  const base = question.description ? `${question.description} · ` : "";
  return `${base}请按你的观察，代入对方视角作答。`;
};

const mirrorQuestions: Question[] = standardQuestions.flatMap((question) => {
  const mirrorQuestion: Question = {
    ...question,
    id: question.id + 100,
    question: createMirrorPrompt(question),
    description: createMirrorDescription(question),
    perspective: "partner_projection",
  };
  return [question, mirrorQuestion];
});

const deepQuestions: Question[] = [
  makeScale(201, 1, "我能在这段关系里保有自己的空间。", "safety", agreementChoices),
  makeScale(202, 1, "对方尊重我和朋友、家人的正常联系。", "family_boundary", agreementChoices),
  makeScale(203, 1, "对方情绪上来时，会让我觉得害怕。", "safety", agreementChoices),
  makeScale(204, 1, "当我明确说“不想”或“不要”时，对方会尊重。", "safety", agreementChoices),
  makeScale(205, 1, "对方会翻看我的设备、账号或隐私信息。", "safety", frequencyChoices),
  makeScale(206, 1, "我表达不同意见后，关系依然是安全的。", "safety", agreementChoices),
  makeScale(207, 1, "对方会用冷战、冷脸或阴阳怪气逼我妥协。", "communication", frequencyChoices),
  makeScale(208, 1, "对方要求我秒回、随时在线。", "safety", frequencyChoices),
  makeScale(209, 1, "对方对异性边界是清楚的。", "loyalty", agreementChoices),
  makeScale(210, 1, "对方在钱和消费上尊重我的决定。", "money", agreementChoices),
  makeScale(211, 1, "我可以自由安排休息、工作和社交。", "safety", agreementChoices),
  makeScale(212, 1, "我需要不断解释自己的行踪。", "safety", frequencyChoices),
  makeScale(213, 1, "对方会把自己的失控归咎到我头上。", "communication", agreementChoices),
  makeScale(214, 1, "这段关系整体让我更安心，而不是更紧绷。", "core_wish", agreementChoices),
  makeSingle(215, 1, "如果我拒绝一件事，对方通常：", "safety", [
    { label: "会尊重我的边界", value: "A" },
    { label: "会失落，但能接受", value: "B" },
    { label: "会持续施压，希望我改口", value: "C" },
    { label: "会翻脸、羞辱或惩罚我", value: "D" },
  ]),
  makeSingle(216, 1, "在隐私边界上，对方更接近：", "safety", [
    { label: "尊重隐私，不过度追问", value: "A" },
    { label: "偶尔想知道，但讲得通", value: "B" },
    { label: "经常查证、试探或套话", value: "C" },
    { label: "会监控、检查或限制", value: "D" },
  ]),
  makeSingle(217, 1, "你因为怕对方不高兴而隐瞒真实想法的频率更接近：", "safety", [
    { label: "几乎不会", value: "A" },
    { label: "偶尔", value: "B" },
    { label: "经常", value: "C" },
    { label: "几乎总是", value: "D" },
  ]),
  makeSingle(218, 1, "当你和朋友、家人相处时，对方更接近：", "family_boundary", [
    { label: "支持我有自己的关系网络", value: "A" },
    { label: "会在意，但能沟通", value: "B" },
    { label: "常会阴阳怪气或表达不满", value: "C" },
    { label: "会阻拦、孤立或逼我选边站", value: "D" },
  ]),

  makeSingle(219, 2, "发生矛盾时，你通常先：", "conflict", [
    { label: "积极沟通，想解决办法", value: "A" },
    { label: "沉默、回避或消失，希望问题自己过去", value: "B" },
    { label: "情绪很大，需要先被安抚", value: "C" },
    { label: "防御、辩解或把矛头打回去", value: "D" },
  ]),
  makeSingle(220, 2, "发生矛盾时，对方通常先：", "conflict", [
    { label: "积极沟通，想解决办法", value: "A" },
    { label: "沉默、回避或消失，希望问题自己过去", value: "B" },
    { label: "情绪很大，需要先被安抚", value: "C" },
    { label: "防御、辩解或把矛头打回给你", value: "D" },
  ]),
  makeSingle(221, 2, "矛盾发生后，你们最常见的修复方式是：", "conflict", [
    { label: "会把问题谈完并修复", value: "A" },
    { label: "需要一点时间，但还能修复", value: "B" },
    { label: "常拖着不谈，靠时间掩过去", value: "C" },
    { label: "反复爆发、拉黑、翻旧账", value: "D" },
  ]),
  makeSingle(222, 2, "当你表达不满或边界时，对方通常：", "communication", [
    { label: "认真听，并愿意调整", value: "A" },
    { label: "当下防御，但后续会改", value: "B" },
    { label: "常把问题推回给你", value: "C" },
    { label: "会失联、提分手或情绪失控逼你让步", value: "D" },
  ]),
  makeScale(223, 2, "你们能把一个矛盾谈完，而不是越谈越乱。", "conflict", agreementChoices),
  makeScale(224, 2, "冷战、失联在你们关系里出现得有多频繁。", "conflict", frequencyChoices),
  makeScale(225, 2, "对方道歉以后，通常真的会调整行为。", "communication", agreementChoices),
  makeScale(226, 2, "你需要先认错，关系才能恢复平静。", "communication", agreementChoices),
  makeScale(227, 2, "吵架时，你们会攻击事情本身，而不是攻击人格。", "conflict", agreementChoices),
  makeScale(228, 2, "你们可以约定暂停时间，再回来继续谈。", "conflict", agreementChoices),
  makeScale(229, 2, "对方能准确复述你的重点，而不是只听自己的情绪。", "communication", agreementChoices),
  makeScale(230, 2, "冲突过后，你们有稳定的修复动作。", "communication", agreementChoices),
  makeSingle(231, 2, "最常见的争吵收尾方式更接近：", "conflict", [
    { label: "互相理解，重新有秩序", value: "A" },
    { label: "暂时放下，之后还能恢复", value: "B" },
    { label: "不了了之，问题继续在那", value: "C" },
    { label: "越收越烂，留下新的伤口", value: "D" },
  ]),
  makeSingle(232, 2, "当对方觉得被冒犯时，对方更接近：", "communication", [
    { label: "直接说明原因，愿意一起处理", value: "A" },
    { label: "会先冷一下，但还是会回来谈", value: "B" },
    { label: "反讽、阴阳怪气或故意让你难受", value: "C" },
    { label: "羞辱、威胁、摔东西或情绪爆炸", value: "D" },
  ]),
  makeScale(233, 2, "你在冲突里越来越像自己，而不是越来越小心翼翼。", "communication", agreementChoices),
  makeScale(234, 2, "你们会反复为同一件事争执。", "conflict", frequencyChoices),
  makeScale(235, 2, "对方愿意和你一起找具体解决办法。", "communication", agreementChoices),
  makeScale(236, 2, "你基本相信下一次争吵不会演变成失控。", "conflict", agreementChoices),

  makeSingle(237, 3, "在诚实和透明度上，对方更接近：", "trust", [
    { label: "基本透明坦诚", value: "A" },
    { label: "偶尔保留，但能解释清楚", value: "B" },
    { label: "重要事情常要靠我发现", value: "C" },
    { label: "经常隐瞒、撒谎或说一套做一套", value: "D" },
  ]),
  makeScale(238, 3, "对方承诺过的事，兑现程度如何。", "trust", qualityChoices),
  makeScale(239, 3, "对方愿意公开关系、把你介绍给重要的人。", "trust", agreementChoices),
  makeScale(240, 3, "谈到未来时，对方的说法和行动是一致的。", "trust", agreementChoices),
  makeSingle(241, 3, "在前任或暧昧对象的边界上，对方更接近：", "loyalty", [
    { label: "边界清楚，能让我安心", value: "A" },
    { label: "偶有模糊，但愿意调整", value: "B" },
    { label: "常让我不安，需要反复解释", value: "C" },
    { label: "明显纠缠、暧昧或持续越界", value: "D" },
  ]),
  makeScale(242, 3, "对方会主动解释失联、爽约或异常行为。", "trust", agreementChoices),
  makeScale(243, 3, "你对这段关系的排他性和确定性感受如何。", "loyalty", qualityChoices),
  makeScale(244, 3, "金钱、债务、消费这类信息在你们之间是透明的。", "money", agreementChoices),
  makeSingle(245, 3, "当你认真谈承诺时，对方通常：", "values", [
    { label: "正面回应，也愿意讨论现实安排", value: "A" },
    { label: "愿意聊，但推进比较慢", value: "B" },
    { label: "常岔开、拖延或模糊处理", value: "C" },
    { label: "明显抗拒、否认或嘲讽这个话题", value: "D" },
  ]),
  makeScale(246, 3, "对方在压力大时依然是可靠的。", "trust", agreementChoices),
  makeScale(247, 3, "你能把重要生活决定纳入对方一起规划。", "values", agreementChoices),
  makeScale(248, 3, "这段关系的承诺边界是清楚的。", "values", agreementChoices),
  makeSingle(249, 3, "如果关系进入下一阶段，对方目前更接近：", "values", [
    { label: "主动推进，也愿意承担现实责任", value: "A" },
    { label: "有意愿，但需要一点时间准备", value: "B" },
    { label: "态度模糊，经常回避推进", value: "C" },
    { label: "明确不愿承担下一阶段承诺", value: "D" },
  ]),
  makeScale(250, 3, "你相信对方说的“以后”，不是临时安抚。", "trust", agreementChoices),

  makeSingle(251, 4, "在花钱和财务协作上，你们更接近：", "money", [
    { label: "观念接近，会商量", value: "A" },
    { label: "有差异，但能尊重", value: "B" },
    { label: "没规则，常有摩擦", value: "C" },
    { label: "经常因为钱吵架", value: "D" },
  ]),
  makeSingle(252, 4, "在未来规划上，你们更接近：", "values", [
    { label: "大方向基本吻合", value: "A" },
    { label: "方向一致，细节还在磨合", value: "B" },
    { label: "还没认真谈过", value: "C" },
    { label: "分歧明显，或对方一直回避", value: "D" },
  ]),
  makeSingle(253, 4, "对婚姻这件事，你们的理解更接近：", "values", [
    { label: "有共识，也知道节奏", value: "A" },
    { label: "大方向一致，但现实安排还在磨合", value: "B" },
    { label: "还没真正谈到核心", value: "C" },
    { label: "分歧大，或对方总在回避", value: "D" },
  ]),
  makeSingle(254, 4, "对结婚或长期承诺，伴侣目前更接近：", "values", [
    { label: "愿意进入现实推进", value: "A" },
    { label: "有意愿，但还没准备好", value: "B" },
    { label: "态度模糊，经常拖延", value: "C" },
    { label: "明确表示目前不考虑", value: "D" },
  ]),
  makeSingle(255, 4, "对你追求事业、兴趣和成长，伴侣更接近：", "respect", [
    { label: "支持并鼓励", value: "A" },
    { label: "尊重，不太干涉", value: "B" },
    { label: "嘴上支持，实际常泼冷水", value: "C" },
    { label: "会贬低、阻拦或控制", value: "D" },
  ]),
  makeSingle(256, 4, "在责任分配上，你们更接近：", "responsibility", [
    { label: "分工大致均衡，彼此认可", value: "A" },
    { label: "偶有偏差，但能协调", value: "B" },
    { label: "长期主要由我承担", value: "C" },
    { label: "完全失衡，常引发怨气", value: "D" },
  ]),
  makeScale(257, 4, "在生活节奏上，你们的步调是匹配的。", "values", agreementChoices),
  makeScale(258, 4, "在消费习惯上，你们能找到双方都舒服的规则。", "money", agreementChoices),
  makeScale(259, 4, "在是否要孩子、何时要孩子这类议题上，你们有可讨论的共识。", "values", agreementChoices),
  makeScale(260, 4, "在居住城市、职业选择等现实方向上，你们是一队的。", "values", agreementChoices),
  makeScale(261, 4, "在家务与照顾责任上，你们的期待接近。", "responsibility", agreementChoices),
  makeScale(262, 4, "你们对社交、休闲和独处时间的理解相容。", "values", agreementChoices),
  makeScale(263, 4, "对亲密关系中的忠诚和自由，你们定义接近。", "loyalty", agreementChoices),
  makeScale(264, 4, "现实压力来时，你们更像队友，而不是互相指责。", "values", agreementChoices),
  makeScale(265, 4, "这段关系让你的长期规划更清晰。", "core_wish", agreementChoices),
  makeSingle(266, 4, "当现实条件和感情拉扯时，你们更接近：", "values", [
    { label: "一起算方案，边谈边做决定", value: "A" },
    { label: "能谈，但速度比较慢", value: "B" },
    { label: "各想各的，难形成真正协同", value: "C" },
    { label: "一谈现实就互怪、互躲或互相推责", value: "D" },
  ]),

  makeScale(267, 5, "当对方回复慢时，我能稳定自己。", "affection", agreementChoices),
  makeScale(268, 5, "当我需要安慰时，对方通常接得住。", "affection", supportChoices),
  makeScale(269, 5, "对方在情绪上忽冷忽热的程度。", "affection", frequencyChoices),
  makeScale(270, 5, "我在这段关系里越来越自信。", "core_wish", agreementChoices),
  makeScale(271, 5, "我常需要通过证明自己来换安全感。", "affection", frequencyChoices),
  makeScale(272, 5, "对方能说清自己的需求，而不是让我猜。", "communication", agreementChoices),
  makeScale(273, 5, "我们能区分“情绪来了”和“关系真的有问题”。", "communication", agreementChoices),
  makeScale(274, 5, "对方能够自己调节情绪，不把我当唯一出口。", "communication", agreementChoices),
  makeScale(275, 5, "嫉妒、不安和占有欲在你们关系里被成熟处理。", "affection", agreementChoices),
  makeScale(276, 5, "我在这段关系里会过度自责。", "core_wish", frequencyChoices),
  makeSingle(277, 5, "当你脆弱时，对方更接近：", "affection", [
    { label: "稳定陪伴，让我感到被接住", value: "A" },
    { label: "有点笨拙，但愿意学着接住我", value: "B" },
    { label: "不耐烦，或让我自己消化", value: "C" },
    { label: "会反过来指责、贬低或让我更难受", value: "D" },
  ]),
  makeScale(278, 5, "这段关系允许我做真实的自己。", "core_wish", agreementChoices),

  makeSingle(279, 6, "伴侣原生家庭的互动模式更接近：", "family", [
    { label: "和谐稳定，互相尊重", value: "A" },
    { label: "有冲突，但能修复", value: "B" },
    { label: "冷漠、压抑或回避", value: "C" },
    { label: "强控制、暴力或其他严重问题", value: "D" },
  ]),
  makeSingle(280, 6, "在对父母的边界感上，伴侣更接近：", "family_boundary", [
    { label: "有边界，有独立思考", value: "A" },
    { label: "会受影响，但会和我商量", value: "B" },
    { label: "明显更站父母那边", value: "C" },
    { label: "父母说了算", value: "D" },
  ]),
  makeScale(281, 6, "伴侣能在父母和伴侣之间保持清楚边界。", "family_boundary", agreementChoices),
  makeScale(282, 6, "重大决定里，父母对伴侣的影响程度很高。", "family_boundary", agreementChoices),
  makeScale(283, 6, "伴侣敢于不同意父母。", "family_boundary", agreementChoices),
  makeScale(284, 6, "双方家庭对你们关系的干扰程度很高。", "family_boundary", agreementChoices),
  makeScale(285, 6, "你能想象婚后你们会成为一个独立的小家庭。", "family", agreementChoices),
  makeScale(286, 6, "家庭金钱、住房、养老等议题讨论得足够现实。", "family", agreementChoices),
  makeSingle(287, 6, "当你和伴侣父母意见冲突时，伴侣更接近：", "family_boundary", [
    { label: "先理解你，再去协调双方", value: "A" },
    { label: "会努力平衡，不让我孤立无援", value: "B" },
    { label: "明显更偏父母那边", value: "C" },
    { label: "直接让你退让或闭嘴", value: "D" },
  ]),
  makeScale(288, 6, "伴侣会复制原生家庭里的控制、回避或压抑模式。", "family", agreementChoices),
  makeScale(289, 6, "节假日、探亲、照护责任这些安排能被公平讨论。", "family", agreementChoices),
  makeScale(290, 6, "我在对方的家庭系统里感到被尊重。", "family", agreementChoices),

  makeSingle(291, 7, "用一句话形容这段关系，你更接近：", "core_wish", [
    { label: "安稳、踏实、自在，能坚定往前走", value: "A" },
    { label: "有爱也有问题，但还愿意一起修", value: "B" },
    { label: "好的时候很好，坏的时候很伤", value: "C" },
    { label: "我常在这段关系里失去自我", value: "D" },
  ]),
  makeMulti(
    292,
    7,
    "这段关系里，最让你感到消耗的是？",
    "core_wish",
    [
      { label: "不被理解或不被回应", value: "A" },
      { label: "缺乏稳定感和安全感", value: "B" },
      { label: "冲突反复，难以真正修复", value: "C" },
      { label: "现实压力长期压在关系上", value: "D" },
      { label: "边界不被尊重，经常需要委屈自己", value: "E" },
      { label: "关系让我越来越不信任自己", value: "G" },
      { label: "基本没有明显消耗", value: "F" },
    ],
    3,
    "可选 1–3 项"
  ),
  makeScale(293, 7, "你有多喜欢对方？", "affection", [
    { label: "很不喜欢", value: "1" },
    { label: "不太喜欢", value: "2" },
    { label: "一般", value: "3" },
    { label: "比较喜欢", value: "4" },
    { label: "非常喜欢", value: "5" },
  ]),
  makeScale(294, 7, "你觉得对方有多喜欢你？", "affection", [
    { label: "很不喜欢我", value: "1" },
    { label: "不太喜欢我", value: "2" },
    { label: "一般", value: "3" },
    { label: "比较喜欢我", value: "4" },
    { label: "非常喜欢我", value: "5" },
  ]),
  makeScale(295, 7, "你们是在一起成长，而不是互相修理。", "core_wish", agreementChoices),
  makeScale(296, 7, "这段关系让我更相信自己的判断。", "core_wish", agreementChoices),
  makeSingle(297, 7, "如果一年后这段关系完全没变，你更接近：", "core_wish", [
    { label: "我依然愿意放心往前走", value: "A" },
    { label: "需要一些调整，但仍值得继续", value: "B" },
    { label: "我大概率会更痛苦", value: "C" },
    { label: "我应该优先离开，而不是再赌一次", value: "D" },
  ]),
  makeSingle(298, 7, "如果你最好的朋友处在完全同样的关系里，你会建议：", "core_wish", [
    { label: "放心推进，这段关系有基础", value: "A" },
    { label: "先继续观察，边走边修", value: "B" },
    { label: "设好边界，再决定要不要继续", value: "C" },
    { label: "先保护自己，不要再合理化风险", value: "D" },
  ]),
  makeText(
    299,
    7,
    "如果你只能补充一个细节，最想让系统知道什么？",
    "freeform",
    "写最近一次让你意识到“这段关系可能不是普通磨合”的瞬间即可。"
  ),
];

export const assessmentModes = modeMeta;

export const chaptersByMode: Record<AssessmentMode, Chapter[]> = {
  core25: standardChapters,
  mirror50: standardChapters,
  deep99: deepChapters,
};

export const questionBanks: Record<AssessmentMode, Question[]> = {
  core25: standardQuestions,
  mirror50: mirrorQuestions,
  deep99: deepQuestions,
};

export const chapters = standardChapters;
export const questions = standardQuestions;

export function getQuestionsForMode(mode: AssessmentMode): Question[] {
  return questionBanks[mode] ?? standardQuestions;
}

export function getChaptersForMode(mode: AssessmentMode): Chapter[] {
  return chaptersByMode[mode] ?? standardChapters;
}

export function getQuestionById(mode: AssessmentMode, questionId: number): Question | undefined {
  return getQuestionsForMode(mode).find((question) => question.id === questionId);
}

export function getAssessmentModeMeta(mode: AssessmentMode): AssessmentModeMeta {
  return (
    assessmentModes.find((item) => item.id === mode) ??
    assessmentModes[0]
  );
}
