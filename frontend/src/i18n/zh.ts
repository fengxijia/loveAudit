const zh = {
  // Landing page
  landing: {
    title: "终身伴侣适配度评估",
    subtitle: "TA真的适合和你携手一生吗？",
    hookIntro: "如果你也有以下困扰，试试这个测评",
    cta: "[ 开始深度扫描 ]",
    ctaSubtext: "25 道题 · 约 4–5 分钟 · 完全匿名",
    visitCount: (count: number) => `已有 ${count.toLocaleString()} 次访问`,
  },

  // Hook cards
  hooks: [
    { question: "你是否会因伴侣提起前任而难过？", subtext: "你的不安并非小题大做" },
    { question: "你是否被伴侣与异性的交往边界困扰？", subtext: "边界模糊是关系最大的隐患之一" },
    { question: "你是否处在一段将就的关系中？", subtext: "沉没成本正在消耗你的生命" },
    { question: "你是否被NPD、三角测量等概念越搞越焦虑？", subtext: "网红名词可能正在误导你" },
  ],

  // Assessment
  assessment: {
    prevQuestion: "← 上一题",
    chapterLabel: (id: number) => `CHAPTER ${id} / 5`,
    continueBtn: "点击继续 →",
    textPlaceholder: "在这里输入（可跳过）...",
    skip: "跳过 →",
    submit: "提交 →",
    confirmMulti: (count: number) => `确认选择 (${count}) →`,
    skipQuestion: "不确定 / 跳过本题",
  },

  // Analyzing
  analyzing: {
    failed: "分析失败",
    retry: "重新分析",
    title: "AI 深度分析中...",
    subtitle: "正在交叉比对你的回答，识别关系模式",
  },

  // CBT Tips
  cbtTips: [
    { title: "认知行为疗法 (CBT)", content: "你的想法不等于事实。学会质疑消极的自动化思维，是走出焦虑的第一步。" },
    { title: "你值得被好好对待", content: "健康的关系应该让你感到安全和被尊重，而不是小心翼翼。" },
    { title: "关于「配得感」", content: "你不需要变得完美才值得被爱。接纳真实的自己，是建立健康关系的基础。" },
    { title: "分清责任边界", content: "对方的情绪不是你的责任，你的幸福也不该完全依赖对方。" },
    { title: "识别情绪操控", content: "如果对方经常让你觉得「一切都是你的错」，这可能是情绪操控的信号。" },
    { title: "关于「沉没成本」", content: "已经投入的时间不是继续一段不健康关系的理由。你的未来比过去更重要。" },
  ],

  // Result page
  result: {
    fetchFailed: "分析结果获取失败",
    fetchFailedSub: "可能是网络问题或服务暂时不可用",
    reanalyze: "重新分析",
    restart: "重新测评",
    loading: "加载中...",
    saving: "生成中...",
    saveShare: "保存/分享完整报告",
    disclaimer: "LoveAudit · 本测评不构成医学或心理诊断，仅供参考",
    starPrompt: "如果你觉得有用，请Star可爱作者的",
    starSuffix: " 叭～",
    shareTitle: "LoveAudit 测评结果",
    imageFailed: "图片生成失败，请重试",
  },

  // Result components
  resultHero: {
    label: "你的关系更像",
  },
  scoreBars: {
    safety: "安全指数",
    compatibility: "适配指数",
    repair: "修复指数",
  },
  warningBlock: {
    title: "安全提示",
  },
  insightCards: {
    title: "系统识别到",
  },
  reframeBlock: {
    myth: "你可能以为",
    truth: "更接近的真相",
  },
  tips: {
    title: "相处建议",
  },
  personaTag: {
    title: "你的关系情况",
  },
  mythBuster: {
    title: "💥 网红名词真相解构",
    subtitle: "那些让你越想越害怕的名词，真相是什么？",
  },
  mentalHealth: {
    title: "🧠 精神状态分析",
    userLabel: "[ 你的状态 ]",
    partnerLabel: "[ 伴侣状态 ]",
  },

  // Language toggle
  langToggle: "EN",
};

export type Translations = {
  landing: {
    title: string;
    subtitle: string;
    hookIntro: string;
    cta: string;
    ctaSubtext: string;
    visitCount: (count: number) => string;
  };
  hooks: Array<{ question: string; subtext: string }>;
  assessment: {
    prevQuestion: string;
    chapterLabel: (id: number) => string;
    continueBtn: string;
    textPlaceholder: string;
    skip: string;
    submit: string;
    confirmMulti: (count: number) => string;
    skipQuestion: string;
  };
  analyzing: {
    failed: string;
    retry: string;
    title: string;
    subtitle: string;
  };
  cbtTips: Array<{ title: string; content: string }>;
  result: {
    fetchFailed: string;
    fetchFailedSub: string;
    reanalyze: string;
    restart: string;
    loading: string;
    saving: string;
    saveShare: string;
    disclaimer: string;
    starPrompt: string;
    starSuffix: string;
    shareTitle: string;
    imageFailed: string;
  };
  resultHero: { label: string };
  scoreBars: { safety: string; compatibility: string; repair: string };
  warningBlock: { title: string };
  insightCards: { title: string };
  reframeBlock: { myth: string; truth: string };
  tips: { title: string };
  personaTag: { title: string };
  mythBuster: { title: string; subtitle: string };
  mentalHealth: { title: string; userLabel: string; partnerLabel: string };
  langToggle: string;
};

export default zh as Translations;
