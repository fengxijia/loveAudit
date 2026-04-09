import { Chapter, Question } from "@/types";

export const chaptersEn: Chapter[] = [
  { id: 1, title: "Safety & Boundaries", subtitle: "The foundation for a lasting relationship", icon: "◇" },
  { id: 2, title: "Interaction & Emotions", subtitle: "Have you noticed your emotional interaction patterns?", icon: "◈" },
  { id: 3, title: "Values & Life Planning", subtitle: "Are your values and plans aligned?", icon: "△" },
  { id: 4, title: "Family Boundaries", subtitle: "Tracing the influence of family of origin", icon: "▽" },
  { id: 5, title: "How You Feel", subtitle: "Your feelings matter", icon: "○" },
];

export const questionsEn: Question[] = [
  // ─── Chapter 1: Safety & Boundaries (Q1–Q6) ───
  {
    id: 1, chapter: 1,
    question: "When it comes to boundaries and loyalty, your partner is closer to:",
    type: "single", dimension: "loyalty",
    choices: [
      { label: "Clear boundaries — I feel secure", value: "A" },
      { label: "Occasionally uncomfortable, but we can talk it through", value: "B" },
      { label: "Frequently crosses lines, says I'm overthinking", value: "C" },
      { label: "Has hidden affairs, betrayals, or repeated deception", value: "D" },
    ],
  },
  {
    id: 2, chapter: 1,
    question: "When it comes to honesty and transparency, your partner is closer to:",
    type: "single", dimension: "trust",
    choices: [
      { label: "Generally open and honest", value: "A" },
      { label: "Has hidden things, but willing to be honest after communication", value: "B" },
      { label: "I often have to discover important things on my own", value: "C" },
      { label: "Frequently lies or has major secrets", value: "D" },
    ],
  },
  {
    id: 3, chapter: 1,
    question: "When it comes to checking phones or social contacts, your partner usually:",
    type: "single", dimension: "safety",
    choices: [
      { label: "Respects boundaries, doesn't over-question", value: "A" },
      { label: "Occasionally concerned, but reasonable", value: "B" },
      { label: "Frequently checks, tests, or demands explanations", value: "C" },
      { label: "Monitors, inspects, or restricts me", value: "D" },
    ],
  },
  {
    id: 4, chapter: 1,
    question: "When it comes to money and financial boundaries, your partner is closer to:",
    type: "single", dimension: "money",
    choices: [
      { label: "Honest about money, proactively discusses finances", value: "A" },
      { label: "Occasionally reserved, but doesn't break trust", value: "B" },
      { label: "Hides spending, debts, or borrowing", value: "C" },
      { label: "Controls my spending or pressures me to pay", value: "D" },
    ],
  },
  {
    id: 5, chapter: 1,
    question: "When it comes to physical boundaries, your partner usually:",
    type: "single", dimension: "safety",
    choices: [
      { label: "Respects my wishes and pace", value: "A" },
      { label: "Occasional mismatch, but can communicate and adjust", value: "B" },
      { label: "Pressures me, makes me feel burdened", value: "C" },
      { label: "Has forced, humiliated, or clearly violated boundaries", value: "D" },
    ],
  },
  {
    id: 6, chapter: 1,
    question: "Have you ever been afraid to express yourself because of your partner?",
    type: "single", dimension: "safety",
    choices: [
      { label: "Never — I can express myself freely", value: "A" },
      { label: "I choose my words carefully, worried they'll be upset", value: "B" },
      { label: "I often don't dare speak, fearing coldness, blame, or threats", value: "C" },
      { label: "I almost never speak up, afraid of humiliation, retaliation, or harm", value: "D" },
    ],
  },

  // ─── Chapter 2: Interaction & Emotion Patterns (Q7–Q10) ───
  {
    id: 7, chapter: 2,
    question: "When conflict arises, you usually first:",
    type: "single", dimension: "conflict",
    choices: [
      { label: "Communicate actively, look for solutions", value: "A" },
      { label: "Go silent, avoid, or withdraw, hoping it resolves itself", value: "B" },
      { label: "Lose control emotionally, need to be comforted", value: "C" },
      { label: "Get defensive, blame the other for being more wrong", value: "D" },
    ],
  },
  {
    id: 8, chapter: 2,
    question: "When conflict arises, your partner usually first:",
    type: "single", dimension: "conflict",
    choices: [
      { label: "Communicates actively, looks for solutions", value: "A" },
      { label: "Goes silent, avoids, or withdraws", value: "B" },
      { label: "Loses control emotionally, needs to be comforted", value: "C" },
      { label: "Gets defensive, blames you for being more wrong", value: "D" },
    ],
  },
  {
    id: 9, chapter: 2,
    question: "After conflicts, your most common resolution is:",
    type: "single", dimension: "conflict",
    choices: [
      { label: "We can communicate and repair quickly", value: "A" },
      { label: "We can repair after a while", value: "B" },
      { label: "Silent treatment or just avoiding the topic", value: "C" },
      { label: "Bringing up old issues, repeated blowups, or blocking", value: "D" },
    ],
  },
  {
    id: 10, chapter: 2,
    question: "When you express dissatisfaction or set a boundary, your partner usually:",
    type: "single", dimension: "communication",
    choices: [
      { label: "Listens carefully and adjusts", value: "A" },
      { label: "Gets defensive at first, but changes later", value: "B" },
      { label: "Often turns the issue back on me", value: "C" },
      { label: "Uses disappearing, breakup threats, self-harm, or emotional outbursts to force me to back down", value: "D" },
    ],
  },

  // ─── Chapter 3: Values & Life Planning (Q11–Q16) ───
  {
    id: 11, chapter: 3,
    question: "When it comes to spending and financial collaboration, you're closer to:",
    type: "single", dimension: "money",
    choices: [
      { label: "Similar views, we discuss things", value: "A" },
      { label: "Some differences, but we respect each other", value: "B" },
      { label: "No rules, frequent friction", value: "C" },
      { label: "We often fight about money", value: "D" },
    ],
  },
  {
    id: 12, chapter: 3,
    question: "When it comes to future planning, you're closer to:",
    type: "single", dimension: "values",
    choices: [
      { label: "Mostly aligned", value: "A" },
      { label: "Same big picture, details still being worked out", value: "B" },
      { label: "Haven't seriously discussed it", value: "C" },
      { label: "Major disagreements, or partner keeps avoiding it", value: "D" },
    ],
  },
  {
    id: 13, chapter: 3,
    question: "Your understanding of marriage is closer to:",
    type: "single", dimension: "values",
    choices: [
      { label: "We agree on direction and pace", value: "A" },
      { label: "Same direction, but still working out practical arrangements", value: "B" },
      { label: "Haven't seriously discussed future plans", value: "C" },
      { label: "Clear disagreements, or partner often avoids the topic", value: "D" },
    ],
  },
  {
    id: 14, chapter: 3,
    question: "Regarding marriage, your partner currently is closer to:",
    type: "single", dimension: "values",
    choices: [
      { label: "Has clear intention to marry and willing to make practical plans", value: "A" },
      { label: "Wants to marry but not ready for concrete planning", value: "B" },
      { label: "Unclear attitude, often avoids or delays discussion", value: "C" },
      { label: "Explicitly says not considering marriage now", value: "D" },
    ],
  },
  {
    id: 15, chapter: 3,
    question: "When it comes to your interests, career, and growth, your partner is closer to:",
    type: "single", dimension: "respect",
    choices: [
      { label: "Supportive and encouraging", value: "A" },
      { label: "Respects it, doesn't interfere much", value: "B" },
      { label: "Says they support it, but actually discourages me", value: "C" },
      { label: "Belittles, blocks, or controls me", value: "D" },
    ],
  },
  {
    id: 16, chapter: 3,
    question: "When it comes to sharing responsibilities, you're closer to:",
    type: "single", dimension: "responsibility",
    choices: [
      { label: "Roughly balanced, both satisfied", value: "A" },
      { label: "Occasionally uneven, but manageable overall", value: "B" },
      { label: "I carry most of the load and often feel it's unfair", value: "C" },
      { label: "My partner carries most of it", value: "D" },
    ],
  },

  // ─── Chapter 4: Family Boundaries (Q17–Q18) ───
  {
    id: 17, chapter: 4,
    question: "Your partner's family of origin interaction pattern is closer to:",
    type: "single", dimension: "family",
    choices: [
      { label: "Harmonious and stable, mutual respect", value: "A" },
      { label: "Some conflict, but can be repaired", value: "B" },
      { label: "Cold, repressed, or avoidant", value: "C" },
      { label: "Controlling, violent, or has other serious issues", value: "D" },
    ],
  },
  {
    id: 18, chapter: 4,
    question: "When it comes to boundaries with parents, your partner is closer to:",
    type: "single", dimension: "family_boundary",
    choices: [
      { label: "Has boundaries, thinks independently", value: "A" },
      { label: "Influenced by parents, but discusses with me", value: "B" },
      { label: "Clearly sides more with parents", value: "C" },
      { label: "Parents have the final say", value: "D" },
    ],
  },

  // ─── Chapter 5: How You Feel (Q19–Q25) ───
  {
    id: 19, chapter: 5,
    question: "In one sentence, this relationship feels more like:",
    type: "single", dimension: "core_wish",
    choices: [
      { label: "Stable, comfortable, and moving forward together", value: "A" },
      { label: "Love and friction coexist, but we're growing through it", value: "B" },
      { label: "Amazing highs, devastating lows", value: "C" },
      { label: "I often lose myself in this relationship", value: "D" },
    ],
  },
  {
    id: 20, chapter: 5,
    question: "What drains you the most in this relationship?",
    description: "Select 1–2",
    type: "multi", maxSelections: 2, dimension: "core_wish",
    choices: [
      { label: "Often feeling unheard or unresponded to", value: "A" },
      { label: "Lacking stability and security", value: "B" },
      { label: "Recurring conflicts that never truly resolve", value: "C" },
      { label: "Real-life pressures constantly weighing on the relationship", value: "D" },
      { label: "Boundaries not respected, often having to compromise myself", value: "E" },
      { label: "Nothing particularly draining", value: "F" },
    ],
  },
  {
    id: 21, chapter: 5,
    question: "How much do you like your partner? Please be honest.",
    type: "scale", dimension: "affection",
    choices: [
      { label: "Not at all", value: "1" },
      { label: "Not much", value: "2" },
      { label: "Neutral", value: "3" },
      { label: "Quite a lot", value: "4" },
      { label: "Very much", value: "5" },
    ],
  },
  {
    id: 22, chapter: 5,
    question: "How much do you think they like you? Please be honest.",
    type: "scale", dimension: "affection",
    choices: [
      { label: "Not at all", value: "1" },
      { label: "Not much", value: "2" },
      { label: "Neutral", value: "3" },
      { label: "Quite a lot", value: "4" },
      { label: "Very much", value: "5" },
    ],
  },
  {
    id: 23, chapter: 5,
    question: "Are you willing to accept their flaws?",
    type: "scale", dimension: "tolerance",
    choices: [
      { label: "Not at all", value: "1" },
      { label: "Not really", value: "2" },
      { label: "Neutral", value: "3" },
      { label: "Mostly yes", value: "4" },
      { label: "Absolutely", value: "5" },
    ],
  },
  {
    id: 24, chapter: 5,
    question: "Are they willing to accept your flaws?",
    type: "scale", dimension: "tolerance",
    choices: [
      { label: "Not at all", value: "1" },
      { label: "Not really", value: "2" },
      { label: "Neutral", value: "3" },
      { label: "Mostly yes", value: "4" },
      { label: "Absolutely", value: "5" },
    ],
  },
  {
    id: 25, chapter: 5,
    question: "Anything else you'd like to add?",
    description: "Just write one moment that best represents this relationship. For example: the last time you doubted whether they were marriage material.",
    type: "text", dimension: "freeform",
  },
];
