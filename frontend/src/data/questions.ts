import { Chapter, Question } from "@/types";

export const chapters: Chapter[] = [
  { id: 1, title: "双方性格", subtitle: "了解你们的互动模式", icon: "🎭" },
  { id: 2, title: "基础安全", subtitle: "底线与忠诚度扫描", icon: "🛡️" },
  { id: 3, title: "三观金钱", subtitle: "价值观深层解码", icon: "⚖️" },
  { id: 4, title: "矛盾处理", subtitle: "冲突应对模式分析", icon: "🌪️" },
  { id: 5, title: "原生家庭", subtitle: "家庭系统溯源", icon: "🧬" },
];

export const questions: Question[] = [
  // Chapter 1: 双方性格 (3题)
  {
    id: 1,
    chapter: 1,
    question: "你在面对感情问题时，通常更倾向于？",
    type: "single",
    dimension: "personality",
    choices: [
      { label: "冷静分析，找出问题根源", value: "rational", tags: { rational: 2 } },
      { label: "先处理情绪，再解决问题", value: "emotional", tags: { emotional: 2 } },
      { label: "看情况，有时理性有时感性", value: "balanced", tags: { balanced: 2 } },
    ],
  },
  {
    id: 2,
    chapter: 1,
    question: "你的伴侣在面对感情问题时，通常更倾向于？",
    type: "single",
    dimension: "personality",
    choices: [
      { label: "冷静分析，就事论事", value: "rational", tags: { partner_rational: 2 } },
      { label: "情绪先行，需要被安抚", value: "emotional", tags: { partner_emotional: 2 } },
      { label: "不太确定，时而理性时而感性", value: "balanced", tags: { partner_balanced: 2 } },
    ],
  },
  {
    id: 3,
    chapter: 1,
    question: "你们在一起时，你通常感觉？",
    type: "single",
    dimension: "attachment",
    choices: [
      { label: "放松自在，可以做真实的自己", value: "secure", tags: { secure: 3, mental_healthy: 1 } },
      { label: "开心但偶尔紧张，怕说错话做错事", value: "anxious", tags: { anxious: 2, mental_anxious: 1 } },
      { label: "有时想亲近，有时想逃开", value: "avoidant", tags: { avoidant: 2, mental_confused: 1 } },
      { label: "小心翼翼，总在揣测对方心情", value: "fearful", tags: { anxious: 3, mental_depressed: 1, controlled: 1 } },
    ],
  },

  // Chapter 2: 基础安全 (4题)
  {
    id: 4,
    chapter: 2,
    question: "你的伴侣是否有以下行为？（选最接近的）",
    type: "single",
    dimension: "safety",
    choices: [
      { label: "没有不良嗜好，生活习惯健康", value: "clean", tags: { safe: 3 } },
      { label: "偶尔小赌/偶尔喝多，但不影响生活", value: "minor", tags: { safe: 1, risk: 1 } },
      { label: "有明显的不良习惯且拒绝改变", value: "risky", tags: { risk: 3, stubborn: 2 } },
      { label: "有严重问题（赌博/酗酒/暴力倾向）", value: "danger", tags: { risk: 5, danger: 3 } },
    ],
  },
  {
    id: 5,
    chapter: 2,
    question: "关于忠诚，以下哪个最符合你的伴侣？",
    type: "single",
    dimension: "loyalty",
    choices: [
      { label: "异性社交有分寸，主动给我安全感", value: "loyal", tags: { safe: 3, loyal: 3 } },
      { label: "偶尔让我不舒服，但解释后能理解", value: "mostly_loyal", tags: { safe: 1, loyal: 1 } },
      { label: "经常和异性暧昧，觉得我小题大做", value: "ambiguous", tags: { risk: 2, dismissive: 2, selfish: 1 } },
      { label: "有过出轨或疑似出轨的行为", value: "disloyal", tags: { risk: 5, danger: 3, selfish: 3 } },
    ],
  },
  {
    id: 6,
    chapter: 2,
    question: "你是否曾在这段关系中感到害怕或被威胁？",
    type: "single",
    dimension: "safety",
    choices: [
      { label: "从未，ta 让我很有安全感", value: "safe", tags: { safe: 3, mental_healthy: 1 } },
      { label: "偶尔，ta 生气时说话很重", value: "sometimes", tags: { risk: 1, verbal_abuse: 1, mental_anxious: 1 } },
      { label: "经常，ta 会用冷暴力/语言暴力", value: "often", tags: { risk: 3, verbal_abuse: 3, controlled: 2, mental_depressed: 2 } },
      { label: "有过肢体冲突或威胁行为", value: "physical", tags: { danger: 5, risk: 5, mental_depressed: 3 } },
    ],
  },
  {
    id: 7,
    chapter: 2,
    question: "你的伴侣是否对你隐瞒过重要事情？（如债务、前任、家庭情况）",
    type: "single",
    dimension: "trust",
    choices: [
      { label: "没有，ta 对我很坦诚", value: "honest", tags: { safe: 2, loyal: 2 } },
      { label: "有小事隐瞒，但没有原则性问题", value: "minor_hide", tags: { safe: 1 } },
      { label: "隐瞒过重要信息，事后被我发现", value: "major_hide", tags: { risk: 3, selfish: 2 } },
      { label: "经常撒谎，很难完全信任", value: "liar", tags: { risk: 4, danger: 2, selfish: 3 } },
    ],
  },

  // Chapter 3: 三观金钱 (4题)
  {
    id: 8,
    chapter: 3,
    question: "关于钱，你们的态度是？",
    type: "single",
    dimension: "money",
    choices: [
      { label: "消费观相近，大额支出会商量", value: "aligned", tags: { compatible: 3 } },
      { label: "有分歧但能互相尊重，各管各的", value: "respectful", tags: { compatible: 2 } },
      { label: "经常因为钱吵架，觉得对方不合理", value: "conflict", tags: { incompatible: 2, conflict: 1 } },
      { label: "一方控制财务，另一方没有话语权", value: "controlled", tags: { controlled: 3, incompatible: 3, selfish: 2 } },
    ],
  },
  {
    id: 9,
    chapter: 3,
    question: "关于未来规划（买房、生育、定居城市），你们的共识是？",
    type: "single",
    dimension: "values",
    choices: [
      { label: "方向一致，经常一起讨论规划", value: "aligned", tags: { compatible: 3, mature: 2 } },
      { label: "大方向一致，细节可以慢慢磨合", value: "mostly_aligned", tags: { compatible: 2, mature: 1 } },
      { label: "有明显分歧，但谁也不肯让步", value: "conflict", tags: { incompatible: 2, stubborn: 2 } },
      { label: "对方回避讨论这些「太现实」的话题", value: "avoidant", tags: { avoidant: 2, immature: 2, incompatible: 1 } },
    ],
  },
  {
    id: 10,
    chapter: 3,
    question: "你觉得你们对婚姻的理解是？",
    type: "single",
    dimension: "values",
    choices: [
      { label: "都认为是平等合作的伙伴关系", value: "equal", tags: { compatible: 3, mature: 2 } },
      { label: "有些差异但核心认知相同", value: "similar", tags: { compatible: 2 } },
      { label: "一方觉得是灵魂伴侣，另一方觉得是搭伙", value: "mismatch", tags: { incompatible: 2 } },
      { label: "从没认真讨论过这个问题", value: "never_discussed", tags: { avoidant: 1, immature: 1 } },
    ],
  },
  {
    id: 11,
    chapter: 3,
    question: "对方对你追求自己兴趣/事业的态度是？",
    type: "single",
    dimension: "respect",
    choices: [
      { label: "支持鼓励，甚至一起参与", value: "supportive", tags: { safe: 2, mature: 2, compatible: 1 } },
      { label: "不干涉，各自有各自的空间", value: "neutral", tags: { safe: 1, compatible: 1 } },
      { label: "偶尔嫌我浪费时间/钱", value: "dismissive", tags: { dismissive: 1, controlled: 1 } },
      { label: "反对控制，觉得我该把精力放在 ta 身上", value: "controlling", tags: { controlled: 3, selfish: 2, incompatible: 2 } },
    ],
  },

  // Chapter 4: 矛盾处理 (4题)
  {
    id: 12,
    chapter: 4,
    question: "你们吵架后，通常的模式是？",
    type: "single",
    dimension: "conflict",
    choices: [
      { label: "冷静后主动沟通复盘，不翻旧账", value: "healthy", tags: { mature: 3, safe: 2 } },
      { label: "一方先道歉，不管谁对谁错", value: "unbalanced", tags: { unbalanced: 2, mental_anxious: 1 } },
      { label: "冷战/冷暴力，等时间淡化", value: "cold_war", tags: { avoidant: 3, verbal_abuse: 1, mental_depressed: 1 } },
      { label: "升级成人身攻击/翻旧账/拉黑", value: "toxic", tags: { danger: 2, risk: 3, verbal_abuse: 3, mental_depressed: 2 } },
    ],
  },
  {
    id: 13,
    chapter: 4,
    question: "当你表达不满或诉求时，对方的反应通常是？",
    type: "single",
    dimension: "communication",
    choices: [
      { label: "认真倾听，愿意调整", value: "receptive", tags: { mature: 3, safe: 2 } },
      { label: "虽不开心但会思考，过后有改善", value: "slow_learner", tags: { mature: 1, safe: 1 } },
      { label: "反过来指责我，变成我的问题", value: "deflect", tags: { selfish: 3, dismissive: 2, gaslighting: 2 } },
      { label: "情绪崩溃/威胁分手/自我伤害", value: "manipulate", tags: { danger: 3, controlled: 2, mental_unstable: 3 } },
    ],
  },
  {
    id: 14,
    chapter: 4,
    question: "在这段关系中，你觉得「责任」的分配是？",
    type: "single",
    dimension: "responsibility",
    choices: [
      { label: "大致均衡，遇事共同承担", value: "balanced", tags: { mature: 3, compatible: 2 } },
      { label: "我承担多一些，但对方也在努力", value: "slightly_unbalanced", tags: { mature: 1, unbalanced: 1 } },
      { label: "几乎都是我在付出和妥协", value: "one_sided", tags: { unbalanced: 3, selfish: 2, mental_depressed: 2 } },
      { label: "对方什么都不管，像个甩手掌柜", value: "irresponsible", tags: { immature: 3, selfish: 3, incompatible: 2 } },
    ],
  },
  {
    id: 15,
    chapter: 4,
    question: "你有没有为了维持关系而改变过自己？",
    description: "这道题帮助我们了解你在关系中的真实状态",
    type: "single",
    dimension: "self_worth",
    choices: [
      { label: "互相磨合成长，我觉得是好的改变", value: "positive_growth", tags: { mental_healthy: 2, compatible: 2 } },
      { label: "改变了一些，但核心自我没变", value: "minor_change", tags: { mental_healthy: 1 } },
      { label: "改变了很多，有时不认识自己了", value: "lost_self", tags: { mental_depressed: 3, controlled: 2, anxious: 2 } },
      { label: "一直在伪装讨好，不敢做真实的自己", value: "people_pleasing", tags: { mental_depressed: 3, anxious: 3, controlled: 3 } },
    ],
  },

  // Chapter 5: 原生家庭 (3题 + 1个可选文字题)
  {
    id: 16,
    chapter: 5,
    question: "你伴侣的父母关系如何？",
    type: "single",
    dimension: "family",
    choices: [
      { label: "和谐稳定，互相尊重", value: "harmonious", tags: { family_healthy: 3, safe: 1 } },
      { label: "偶有矛盾但整体还好", value: "okay", tags: { family_healthy: 1 } },
      { label: "关系紧张/已离异，对 ta 影响较大", value: "troubled", tags: { family_risk: 2 } },
      { label: "存在家暴/出轨/严重问题", value: "toxic", tags: { family_risk: 3, danger: 1 } },
    ],
  },
  {
    id: 17,
    chapter: 5,
    question: "你伴侣对父母的态度是？",
    type: "single",
    dimension: "family_boundary",
    choices: [
      { label: "孝顺但有边界，不会让父母干涉我们", value: "healthy_boundary", tags: { mature: 3, family_healthy: 2 } },
      { label: "很听父母话，但涉及我们的事会和我商量", value: "filial_but_fair", tags: { mature: 1, family_healthy: 1 } },
      { label: "妈宝/爸宝，父母说什么就是什么", value: "enmeshed", tags: { immature: 3, family_risk: 3, incompatible: 2 } },
      { label: "和父母关系很差，几乎不来往", value: "estranged", tags: { family_risk: 2 } },
    ],
  },
  {
    id: 18,
    chapter: 5,
    question: "你最希望在这段关系中改变什么？（选择最核心的一个）",
    type: "single",
    dimension: "core_wish",
    choices: [
      { label: "我很满意现状，希望一直这样", value: "satisfied", tags: { compatible: 3, mental_healthy: 2, safe: 2 } },
      { label: "希望对方能多理解我的感受", value: "understanding", tags: { unbalanced: 1, anxious: 1 } },
      { label: "希望对方少一些控制，多一些尊重", value: "freedom", tags: { controlled: 3, mental_depressed: 2 } },
      { label: "希望自己能不再那么害怕和焦虑", value: "peace", tags: { mental_depressed: 3, anxious: 3, controlled: 2 } },
    ],
  },
  {
    id: 19,
    chapter: 5,
    question: "还有什么想补充的？（可跳过）",
    description: "比如你们之间的具体矛盾，或者你现在的感受",
    type: "text",
    dimension: "freeform",
  },
];
