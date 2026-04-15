import type { Translations } from "./zh";

const en: Translations = {
  // Landing page
  landing: {
    title: "Lifetime Partner Compatibility Assessment",
    subtitle: "Is your partner truly the one to spend a lifetime with?",
    hookIntro: "If any of these sound familiar, try this assessment",
    cta: "[ START DEEP SCAN ]",
    ctaSubtext: "25 questions · ~5 min · fully anonymous",
    visitCount: (count: number) => `${count.toLocaleString()} visits so far`,
  },

  // Hook cards
  hooks: [
    { question: "Does it hurt when your partner brings up their ex?", subtext: "Your unease is not an overreaction" },
    { question: "Are you troubled by your partner's boundaries with others?", subtext: "Blurry boundaries are a top relationship risk" },
    { question: "Are you settling in a relationship out of inertia?", subtext: "Sunk cost is draining your life" },
    { question: "Are buzzwords like narcissism & triangulation making you more anxious?", subtext: "Pop-psychology labels may be misleading you" },
  ],

  // Assessment
  assessment: {
    prevQuestion: "← Previous",
    chapterLabel: (id: number) => `CHAPTER ${id} / 5`,
    continueBtn: "Continue →",
    textPlaceholder: "Type here (optional)...",
    skip: "Skip →",
    submit: "Submit →",
    confirmMulti: (count: number) => `Confirm (${count}) →`,
    skipQuestion: "Not sure / Skip",
  },

  // Analyzing
  analyzing: {
    failed: "Analysis Failed",
    retry: "Retry Analysis",
    title: "AI Deep Analysis...",
    subtitle: "Cross-referencing your answers to identify relationship patterns",
  },

  // CBT Tips
  cbtTips: [
    { title: "Cognitive Behavioral Therapy (CBT)", content: "Your thoughts are not facts. Learning to question automatic negative thinking is the first step out of anxiety." },
    { title: "You Deserve to Be Treated Well", content: "A healthy relationship should make you feel safe and respected, not walking on eggshells." },
    { title: "On Feeling \"Worthy\"", content: "You don't need to be perfect to deserve love. Accepting your true self is the foundation of a healthy relationship." },
    { title: "Know Your Boundaries", content: "Your partner's emotions are not your responsibility, and your happiness shouldn't depend entirely on them." },
    { title: "Recognizing Emotional Manipulation", content: "If your partner constantly makes you feel like everything is your fault, it may be a sign of emotional manipulation." },
    { title: "On \"Sunk Cost\"", content: "Time already invested is not a reason to stay in an unhealthy relationship. Your future matters more than your past." },
  ],

  // Result page
  result: {
    fetchFailed: "Failed to load analysis results",
    fetchFailedSub: "Possibly a network issue or temporary service outage",
    reanalyze: "Retry Analysis",
    restart: "Retake Assessment",
    loading: "Loading...",
    saving: "Generating...",
    saveShare: "Save / Share Full Report",
    disclaimer: "LoveAudit · This assessment does not constitute medical or psychological diagnosis. For reference only.",
    starPrompt: "If you found this helpful, please star the author's",
    starSuffix: " !",
    shareTitle: "LoveAudit Assessment Result",
    imageFailed: "Failed to generate image, please try again",
  },

  // Result components
  resultHero: {
    label: "Your relationship looks like",
  },
  scoreBars: {
    safety: "Safety Index",
    compatibility: "Compatibility Index",
    repair: "Repair Index",
  },
  warningBlock: {
    title: "Safety Alert",
  },
  insightCards: {
    title: "System detected",
  },
  reframeBlock: {
    myth: "You might think",
    truth: "Closer to the truth",
  },
  tips: {
    title: "Relationship Advice",
  },
  personaTag: {
    title: "Your Relationship Profile",
  },
  mythBuster: {
    title: "💥 Buzzword Myth Busters",
    subtitle: "What do those scary buzzwords really mean?",
  },
  mentalHealth: {
    title: "🧠 Mental State Analysis",
    userLabel: "[ Your State ]",
    partnerLabel: "[ Partner's State ]",
  },

  // Language toggle
  langToggle: "中",
};

export default en as Translations;
