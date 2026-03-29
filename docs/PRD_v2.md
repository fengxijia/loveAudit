# LoveAudit PRD

Version: v1 MVP  
Owner: Product / Design / Engineering  
Audience: Claude Code / Frontend / Backend / Design  
Status: Ready for implementation

---

## 1. Product Overview

### 1.1 Product name
- Public title: **TA 适合结婚吗？**
- Brand / internal name: **LoveAudit**
- Subtitle: **婚前关系风险与适配评估**

### 1.2 Product goal
Build a mobile-first web app that helps users assess whether a romantic partner is suitable for marriage by evaluating:
- relationship safety
- long-term compatibility
- conflict repair capacity
- boundaries and family influence
- the user's own felt experience in the relationship

The product must balance two goals:
1. **Virality**: strong hook, memorable design, screenshot-worthy results
2. **Credibility**: structured questionnaire, risk logic, non-gimmicky analysis

### 1.3 Core value proposition
In 3–5 minutes, help users distinguish between:
- ordinary relationship磨合
- medium-risk incompatibility
- high-risk / unsafe relationship patterns

This is **not** a psychiatric diagnosis tool. It is a **relationship risk + compatibility assessment**.

### 1.4 Non-goals
Do **not** build the following into v1:
- clinical mental health diagnosis
- formal legal advice
- live chat with counselors
- user accounts / login
- payment wall
- complex adaptive AI branching across the full quiz
- uploading chat logs or private documents

---

## 2. Product Principles

### 2.1 Tone and positioning
The experience should feel:
- dark, elegant, slightly ritualistic
- emotionally intense but not trashy
- sharp and validating, not hysterical
- psychologically insightful without pretending to diagnose disorders

### 2.2 What the product should say
Allowed framing:
- 关系风险
- 边界问题
- 冲突修复能力
- 高消耗模式
- 控制—让步失衡
- 安全感不足
- 婚前适配度

### 2.3 What the product should avoid
Avoid direct psychiatric or personality-disorder diagnosis such as:
- “TA 是 NPD”
- “你被精神控制了”
- “TA 有反社会人格”
- “你有抑郁症/焦虑症”

Instead, translate these into relationship-language, e.g.:
- “关系中存在高控制倾向”
- “你在关系里有明显的自我压缩”
- “存在长期失衡的互动模式”

---

## 3. Target Users

### 3.1 Primary users
- 18–35 岁，有恋爱对象或处于暧昧/磨合/婚前阶段的用户
- 尤其是对以下问题焦虑的人：
  - 对方边界是否有问题
  - 常吵架、冷暴力、失联
  - 看不到未来但又舍不得分手
  - 不确定这段关系是磨合还是危险信号

### 3.2 User motivations
Users are not here “just for fun.” They want:
- emotional confirmation
- a structured second opinion
- language for what they are already feeling
- a shareable result that feels “被看穿”

### 3.3 User constraints
- low patience on mobile
- high privacy sensitivity
- dislike long text entry
- emotionally vulnerable in some cases

---

## 4. Success Metrics

### 4.1 Product metrics
- landing page → start quiz conversion
- quiz start → quiz completion rate
- completion → result share rate
- result page CTR to second test / related test

### 4.2 Quality metrics
- low bounce from overly long questionnaire
- low user confusion on answer options
- strong mobile completion with short stems and 4-option singles
- qualitative user feedback like “很准 / 被说中了 / 想发给朋友”

### 4.3 MVP target benchmarks (initial, adjustable)
- start conversion > 20%
- completion rate > 65%
- share rate > 12%
- related-test CTR > 8%

---

## 5. Information Architecture

Pages:
1. Landing Page
2. Intro / Disclaimer Modal
3. Quiz Page
4. Processing Page
5. Result Page
6. Share Card View / Generate Share Image
7. Related Test CTA / Exit Funnel

---

## 6. User Flow

### 6.1 Main flow
1. User lands on homepage
2. Sees hook copy + trust / intrigue + CTA
3. Opens intro modal or starts immediately
4. Completes quiz in chapters
5. Sees processing animation / staged analysis text
6. Lands on result page with:
   - overall relationship type
   - 3 core indices
   - key findings
   - concise next-step advice
   - share card CTA
   - related test CTA

### 6.2 Safety flow
If the user hits strong red-flag conditions, result page should:
- still render full report
- but place a **high-risk warning block** near the top
- avoid gamified tone in that block
- display a safety-oriented disclaimer

### 6.3 Abandonment considerations
- autosave answers in localStorage
- restore progress if the user refreshes or reopens
- allow back navigation between questions

---

## 7. Content Strategy

### 7.1 Landing page hook examples
Use emotionally charged but precise prompts such as:
- 你是不是也在想：这到底是磨合，还是危险信号？
- 你会因为伴侣和前任、异性边界不清而反复内耗吗？
- 你明明不快乐，却又说不清问题到底出在哪里？
- 你刷过 NPD、血包、三角测量，却越看越怕，关系反而更乱？

### 7.2 Core promise
“用 3–5 分钟，看清这段关系的问题，到底是普通磨合，还是长期风险。”

### 7.3 Style guidance
Design should feel like:
- relationship dossier
- ritualistic audit
- elegant judgment report

Copy should be:
- short enough to scan in under 2 seconds
- emotionally sharp but not verbose
- concrete, not essay-like

Avoid feeling like:
- astrology toy
- meme spam
- fake therapy chatbot

---

## 8. Quiz Design

### 8.1 Structure
The quiz is chapter-based and mobile-first.

Recommended structure:
1. 安全与底线筛查
2. 互动与情绪模式
3. 价值观与现实共识
4. 冲突与修复能力
5. 家庭边界与长期风险
6. 主观体感

### 8.2 Number of questions
- MVP base question count: **25**
- Free text: **1 optional**
- Total displayed items: 25 main + optional input
- Estimated completion time: **3–4 分钟**

### 8.3 Interaction rules
- Mostly single-choice
- Single-choice questions use **4 options only**
- A few multi-select items clearly marked
- At most one free-text field at the end
- Show chapter name and progress
- Show one question at a time on mobile
- Keep title + options within one mobile viewport when possible

### 8.4 Answer design rules
To keep completion friction low:
- do **not** add 5th/6th single-choice options for `不确定 / 不适用 / 不方便回答`
- instead render these as **secondary actions** below the answer list
- secondary actions should not compete visually with the 4 main options
- store them as `unknown` / `skip`, not as a scored answer

This preserves answer quality without making each question feel long.

---

## 9. Data Contract with `questions.md`

The repository should include a standalone `questions.md` and a code-usable structured representation (JSON / TS object).

### 9.1 Source of truth
- Human-readable spec: `questions.md`
- Code-ready source: `src/data/questions.ts` or `backend/app/data/questions.py`

### 9.2 Each question object should include
- `id`
- `chapter`
- `type` (`single`, `multi`, `text`)
- `title`
- `subtitle` (optional)
- `options`
- `tags` per option
- `weights` per option
- `redFlagLevel` per option (if applicable)
- `secondaryActions` (e.g. `unknown`, `skip`)
- `displayConditions` optional (for future expansion)

### 9.3 Option schema suggestion
```ts
{
  id: "q03",
  chapter: "safety",
  type: "single",
  title: "在这段关系里，你是否曾因对方而感到害怕、不敢表达，或担心自身安全？",
  options: [
    {
      key: "A",
      label: "从未",
      tags: ["safe"],
      weights: { safety: 2, compatibility: 1 },
      redFlagLevel: 0
    },
    {
      key: "D",
      label: "出现过摔东西、堵门、跟踪、限制社交/行动/用钱等行为",
      tags: ["coercive_control", "abuse_risk"],
      weights: { safety: -6 },
      redFlagLevel: 3
    }
  ]
}
```

---

## 10. Scoring Model

### 10.1 Output dimensions
The result engine should compute **three visible indices**:
1. **安全指数** (Safety)
2. **适配指数** (Compatibility)
3. **修复指数** (Repair)

And **one hidden dimension**:
4. **消耗指数** (Drain / Self-loss)

### 10.2 Why 3 visible + 1 hidden
Visible indices are simple and shareable. Hidden dimension improves report quality without overwhelming UI.

### 10.3 Dimension definitions
- **Safety**: violence, threat, control, betrayal, coercion, severe dishonesty
- **Compatibility**: future plans, marriage expectations, money, boundaries, growth support
- **Repair**: conflict recovery, listening, accountability, emotional regulation
- **Drain**: self-suppression, anxiety, shrinking self, chronic emotional exhaustion

### 10.4 Scoring mechanics
Each option contributes weighted points across one or more dimensions.

Recommended normalized range after final calculation:
- 0–100 per visible index

Implementation idea:
1. raw scores sum by dimension
2. min-max normalize into 0–100
3. apply penalties from red flags
4. clamp to [0, 100]

### 10.5 Red flag overrides
Red flags should not merely reduce scores. They should also trigger logic.

Suggested levels:
- `0`: none
- `1`: mild concern
- `2`: moderate pattern concern
- `3`: serious risk
- `4`: critical / unsafe

### 10.6 Hard-flag logic
Examples of severe triggers:
- physical violence
- coercive sexual boundary violations
- stalking / confinement / financial control
- explicit threats
- repeated severe deception + high fear markers

If triggered:
- set `riskTier = high_risk`
- inject risk warning block into result page
- result label should never be “神仙伴侣型” or equivalent

---

## 11. Result Type System

### 11.1 Goal
Produce memorable but credible relationship archetypes.

### 11.2 Recommended result types
1. **神仙伴侣型**
2. **磨合可成型**
3. **现实分歧型**
4. **高消耗拉扯型**
5. **边界失衡型**
6. **高风险关系型**

### 11.3 Suggested mapping logic
#### 神仙伴侣型
- high safety
- high compatibility
- high repair
- low drain
- no serious red flags

#### 磨合可成型
- medium-high safety
- medium compatibility
- medium-high repair
- low-medium drain

#### 现实分歧型
- safety acceptable
- compatibility low-medium
- repair medium
- drain medium

#### 高消耗拉扯型
- safety medium-low
- repair low
- drain high
- recurring conflict loops

#### 边界失衡型
- safety medium-low
- compatibility variable
- drain high
- boundary/control tags elevated

#### 高风险关系型
- severe red flags or very low safety

### 11.4 Result selection priority
Use the following priority order:
1. high-risk override
2. boundary / control override
3. high-drain + low-repair override
4. compatibility mismatch cluster
5. otherwise best-fit by highest scoring cluster

---

## 12. Result Page Content Requirements

### 12.1 Required sections
1. Hero label (result type)
2. Short summary sentence
3. Three visible indices
4. Key findings (3–5 bullets/cards)
5. “你可能以为…” vs “更接近的真相…” block
6. Action guidance
7. Share card CTA
8. Related test CTA
9. Disclaimer / safety note

### 12.2 Example top-of-page layout
- Result title: `你的关系更像：高消耗拉扯型`
- Subtitle: `有爱，但边界和修复力不足，长期相处会越来越累。`
- Indices:
  - 安全指数 42
  - 适配指数 58
  - 修复指数 31

### 12.3 Key findings examples
- 你在关系里承担了过多情绪成本
- 对方在压力下更容易回避或转向控制
- 你们的问题不只是吵架，而是吵完之后修不回来
- 现实议题上的模糊与拖延会放大你的不安

### 12.4 Advice tone
Advice should be:
- direct
- supportive
- specific
- not preachy

Examples:
- `这段关系不是不能继续，但不适合在核心问题没谈清前急着进入婚姻。`
- `你需要的不是更努力哄好这段关系，而是先确认边界和安全感能否被真正建立。`

---

## 13. Shareability Design

### 13.1 Share intent
The result must be screenshot-friendly.

### 13.2 Share card content
Suggested card fields:
- main label: `高消耗拉扯型`
- one-line verdict
- 1–2 signature traits
- brand footer: `LoveAudit`

### 13.3 Example viral labels
- 爱情里的责任兜底人
- 边界感守门员
- 高压关系幸存者
- 婚前高敏预警官
- 容易在爱里把自己缩小的人

These are auxiliary persona tags. Do not replace the core relationship type.

### 13.4 Technical suggestion
Generate share card as:
- an HTML view styled for portrait mobile screenshot
- optionally rendered to image using `html-to-image` on frontend

---

## 14. Safety and Risk Policy

### 14.1 Must-have disclaimer
The product is not a medical, legal, or psychiatric diagnostic tool.

### 14.2 If strong abuse markers exist
Show a dedicated block such as:

> 系统识别到这段关系中可能存在明显的安全风险。  
> 当恐惧、威胁、身体越界、财务控制或持续羞辱出现时，问题已经不只是“适不适合结婚”，而是“这段关系是否安全”。

### 14.3 Avoid harmful copy
Do not say:
- “你肯定遇到 NPD 了”
- “快逃” as the only advice
- “你就是受害者人格”

### 14.4 Better alternatives
Use:
- `你的不安并不只是想太多。`
- `这段关系可能已经超出普通磨合的范围。`
- `建议优先关注安全和边界，再决定是否继续推进亲密承诺。`

---

## 15. Frontend Requirements

### 15.1 Stack
- React
- TypeScript
- Vite or Next.js (Vite preferred for simple SPA MVP)
- shadcn/ui
- Tailwind CSS

### 15.2 Mobile-first layout
The app must be optimized for portrait mobile first.

### 15.3 Required screens/components
- `LandingPage`
- `IntroModal`
- `QuizLayout`
- `QuestionCard`
- `ProgressHeader`
- `ChapterTransition`
- `ProcessingScreen`
- `ResultHero`
- `ScoreBars`
- `InsightCards`
- `WarningBlock`
- `ShareCard`
- `RelatedTestCTA`

### 15.4 UI behavior
- one question per screen or card pane
- sticky progress / chapter indicator
- tap-friendly answer cards
- subtle motion, not noisy animation
- support returning to previous question
- auto-save to localStorage

### 15.5 Design direction
Colors:
- near-black background
- muted rose / crimson accent
- dusty pink highlights
- ivory/light gray text

Motifs:
- line art rose / mandala / dossier seals
- soft gradients
- elegant gothic serif for headings optional, readable sans-serif for body

Avoid:
- too much ornament
- illegible serif paragraph text
- horror gimmicks

---

## 16. Backend Requirements

### 16.1 Stack
- Python
- FastAPI

### 16.2 Why backend is needed in MVP
Possible reasons:
- central scoring logic
- future analytics
- prompt-based result narrative generation later
- A/B testing of result templates

### 16.3 MVP backend endpoints
#### `GET /api/health`
Returns service health

#### `GET /api/questions`
Returns structured questionnaire payload

#### `POST /api/evaluate`
Accepts answers and returns:
- normalized indices
- result type
- key findings
- warning flags
- share tags

### 16.4 Request example
```json
{
  "answers": {
    "q01": ["B", "D"],
    "q02": "C",
    "q03": "B"
  }
}
```

### 16.5 Response example
```json
{
  "resultType": "high_drain_push_pull",
  "resultLabel": "高消耗拉扯型",
  "scores": {
    "safety": 42,
    "compatibility": 58,
    "repair": 31
  },
  "riskTier": "medium",
  "warnings": [
    {
      "code": "boundary_instability",
      "message": "系统识别到关系中存在边界失衡和情绪消耗。"
    }
  ],
  "insights": [
    "你在关系里承担了过多情绪成本",
    "对方在压力下更容易回避或转向控制",
    "你们的问题不只是吵架，而是修复能力偏弱"
  ],
  "advice": [
    "先别急着推进婚姻承诺",
    "优先确认边界、透明度和冲突修复是否能持续改善"
  ],
  "shareTags": ["爱情里的责任兜底人", "边界感守门员"]
}
```

---

## 17. Data Persistence

### 17.1 MVP
- no required server-side user account storage
- answers persisted in browser localStorage
- backend processes evaluation statelessly

### 17.2 Optional analytics events
Track:
- landing viewed
- quiz started
- question answered
- quiz completed
- result viewed
- share clicked
- related-test clicked

No sensitive free-text analytics payload unless explicitly approved.

---

## 18. Light Branching Rules (Optional for MVP, recommended if easy)

Do not build a fully adaptive quiz engine in v1.

Allowed lightweight branching:
- If severe abuse/control answer selected, insert 1–2 clarifying questions
- If user selects “我不确定” on many critical questions, soften confidence language in result
- If user has no strong risk markers, skip extra safety follow-ups

If branching complicates delivery, ship without it first.

---

## 19. Result Narrative Templates

### 19.1 Narrative design rule
Results should feel insightful, not generic. Use templates composed from score bands + dominant tags.

### 19.2 Template pieces
Each result can be composed from:
- opening verdict
- index summary
- dominant dynamic
- hidden drain/self-loss observation
- concrete advice

### 19.3 Example template
```text
你的关系更像：{resultLabel}

{summarySentence}

系统识别到，这段关系目前最突出的主题是：{themeA}、{themeB}、{themeC}。

你可能以为：{misbelief}
更接近的真相是：{reframe}

建议你优先处理：{priority1}、{priority2}
```

---

## 20. Related Test Funnel

### 20.1 Rationale
Users who finish this test often want more precision.

### 20.2 Related test examples
- 你为什么总在关系里心软？
- 你吸引的是爱你的人，还是需要你的人？
- 你是在恋爱，还是在过度承担？
- 你的边界感，到底卡在哪里？

### 20.3 Placement
Place on result page below primary findings and share CTA.

---

## 21. Copywriting Rules for Implementation

### 21.1 Must be concise
Avoid giant text blocks on mobile.

### 21.2 Must feel validating
Use lines like:
- `你的不安，不一定是多想。`
- `有些问题，不是靠更努力就会消失。`

### 21.3 Must avoid overclaiming
Do not use absolute certainty.
Use phrases like:
- `更接近`
- `可能存在`
- `系统识别到`
- `目前看来`

---

## 22. Accessibility and UX Requirements

- readable contrast on dark UI
- tap targets large enough for thumbs
- loading and result text not too dense
- no flashing animation
- keyboard accessible where practical
- avoid requiring personal names or partner names

---

## 23. Suggested Project Structure

### Frontend
```text
src/
  components/
    landing/
    quiz/
    result/
    ui/
  data/
    questions.ts
    resultTemplates.ts
  lib/
    scoring.ts
    resultMapper.ts
    storage.ts
    analytics.ts
  pages/
    LandingPage.tsx
    QuizPage.tsx
    ResultPage.tsx
  types/
    quiz.ts
  App.tsx
```

### Backend
```text
backend/
  app/
    main.py
    schemas.py
    api/
      routes_questions.py
      routes_evaluate.py
    services/
      scoring.py
      result_mapper.py
    data/
      questions.py
      templates.py
```

---

## 24. Engineering Notes for Claude Code

### 24.1 Implementation priority
Priority order:
1. stable question rendering
2. answer persistence
3. scoring engine
4. result mapping
5. polished result page
6. share card
7. analytics

### 24.2 Build strategy
- Start with static question data
- Implement frontend-only scoring first for speed if useful
- Mirror same logic in backend or move logic server-side before production
- Keep scoring weights centralized and editable

### 24.3 Important warning
Do not hardcode result copy directly inside UI components. Put templates and question data in dedicated files.

---

## 25. Acceptance Criteria (MVP)

The MVP is acceptable when:
- users can complete the quiz on mobile without account creation
- answers persist locally during session interruption
- evaluation returns 3 visible indices + 1 result type + warnings + insights
- high-risk answers trigger safety-oriented result behavior
- result page is screenshot-shareable
- there is a related-test CTA slot
- all question content matches `questions.md`

---

## 26. Open Questions (Can be deferred)

- Should scoring run client-side only in v1 for simplicity?
- Should share cards be exported as PNG in v1 or only screenshot-optimized?
- Should there be anonymous aggregated analytics?
- Should light branching be included in MVP or v1.1?
- Should result copy be fully static templates or partially generated later?

---

## 27. Appendix: Implementation Summary

This product should be built as a **mobile-first relationship audit app** with:
- strong emotional landing page hooks
- a 25-question structured quiz
- a three-index result model
- serious red-flag handling
- shareable, archetype-based output
- a dark, elegant, ritualized interface

It must feel sharp and viral, while remaining responsible and non-diagnostic.
