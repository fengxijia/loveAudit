# LoveAudit 代码架构面试准备指南

> 写给对前后端零基础的你，用大白话讲清楚每一行代码在干什么。

---

## 一、先搞懂整体架构（最重要，老师一定会问）

### 1.1 这个项目是什么？

一个**AI 驱动的婚恋对象评估网站**。用户回答 21 道心理学问卷，系统通过**隐藏的心理标签**计算风险分数，然后调用**大语言模型（LLM）**生成一份个性化的关系分析报告。

### 1.2 前后端分离架构

```
用户浏览器
    │
    ▼
前端 (Next.js, 端口 8654)        ← 负责界面展示、用户交互
    │
    │  HTTP 请求 (/api/*)
    ▼
后端 (FastAPI, 端口 8147)        ← 负责计算分数、调用 AI
    │
    │  API 调用
    ▼
大语言模型 (如 GPT / Gemini)    ← 生成分析报告
```

**类比理解：**
- **前端** = 餐厅的前厅（菜单、点餐界面、上菜），用户能看到的一切
- **后端** = 餐厅的厨房（做菜的逻辑），用户看不到
- **LLM** = 大厨，根据食材（用户答案）做出菜品（分析报告）

### 1.3 为什么要前后端分离？

| 问题 | 回答 |
|------|------|
| 为什么不把所有代码写在一起？ | 前端跑在用户浏览器里，后端跑在服务器上。分开写方便各自开发、测试、部署 |
| 它们怎么通信？ | 前端通过 **HTTP 请求** 发数据给后端，后端返回结果 |
| 中间的 API 代理是什么？ | 前端代码里写 `/api/xxx`，Next.js 会自动转发到 `localhost:8147/api/xxx`，这样前端不用知道后端的真实地址 |

**API 代理配置**（`frontend/next.config.ts`）：
```typescript
// 所有 /api/* 的请求都转发给后端
async rewrites() {
  return [{ source: "/api/:path*", destination: "http://localhost:8147/api/:path*" }];
}
```

---

## 二、用户操作流程（端到端）

```
首页 (/)  →  评估页 (/assessment)  →  分析页 (/analyzing)  →  结果页 (/result)
  │              │                          │                       │
  │         用户答21题               发数据给后端              展示AI报告
  │         每题选一个选项            后端算分+调AI             判定+建议+标签
  │                                  AI边生成边传回来
  点击                  答完自动跳转          AI完成后自动跳转
"开始深度扫描"
```

---

## 三、前端代码详解

### 3.1 技术栈解释

| 技术 | 干什么的 | 类比 |
|------|---------|------|
| **Next.js** | React 的框架，帮你组织页面、路由、打包 | 房子的框架结构 |
| **React** | 写 UI 界面的库，用"组件"拼页面 | 乐高积木 |
| **TypeScript** | 带类型检查的 JavaScript，写代码时能提前发现错误 | 给 JS 加了语法检查 |
| **Zustand** | 状态管理库，在不同页面之间共享数据 | 一个全局的"记事本" |
| **Tailwind CSS** | 用 class 名写样式，不用单独写 CSS 文件 | 预制的样式积木 |
| **Framer Motion** | 做动画的库 | 给元素加特效 |

### 3.2 文件结构（每个文件是干什么的）

```
frontend/src/
├── app/                     ← 页面（URL 对应的页面）
│   ├── page.tsx             ← 首页 /
│   ├── assessment/page.tsx  ← 评估页 /assessment
│   ├── analyzing/page.tsx   ← 分析中 /analyzing
│   ├── result/page.tsx      ← 结果页 /result
│   ├── layout.tsx           ← 所有页面共用的外壳（字体、背景）
│   └── globals.css          ← 全局样式（颜色、动画）
│
├── components/              ← 可复用的 UI 组件（页面的零件）
│   ├── assessment/
│   │   ├── QuestionCard.tsx  ← 题目卡片（显示题目和选项）
│   │   ├── ChapterIntro.tsx  ← 章节过场动画
│   │   └── ProgressBar.tsx   ← 顶部进度条
│   ├── analyzing/
│   │   ├── MatrixRain.tsx    ← 字符雨背景动画
│   │   └── CbtTips.tsx       ← 等待时的心理学小知识
│   ├── landing/
│   │   └── HookCards.tsx     ← 首页的痛点卡片
│   └── result/
│       ├── Verdict.tsx       ← 判定结果（神仙伴侣/继续观察/建议远离）
│       ├── MentalHealth.tsx  ← 心理分析卡片
│       ├── MythBuster.tsx    ← 网红名词解构卡片
│       ├── PersonaTag.tsx    ← 人格标签（可截图分享）
│       └── Tips.tsx          ← 建议列表
│
├── store/
│   └── store.ts             ← Zustand 状态管理（全局数据仓库）
├── hooks/
│   └── useSSE.ts            ← SSE 流式通信 Hook
├── data/
│   └── questions.ts         ← 21 道题目的数据（含隐藏标签）
└── types/
    └── index.ts             ← TypeScript 类型定义
```

### 3.3 状态管理 —— Zustand Store（核心，老师一定会问）

**问题：** 用户在评估页答题，答案怎么传到分析页和结果页？

**答案：** 用 Zustand 创建一个**全局状态仓库**，所有页面都能读写。

```typescript
// store/store.ts — 你可以把它理解为一个全局的 "记事本"
{
  currentIndex: 0,              // 当前做到第几题（0 开始）
  answers: [],                  // 用户的所有答案
  userPersonality: null,        // 用户性格（理性/感性/均衡）
  partnerPersonality: null,     // 伴侣性格
  freeformText: "",             // 最后一题的自由文本
  analysisResult: null,         // AI 返回的分析结果
  streamingText: "",            // AI 正在生成的文本（边生成边显示）
  isAnalyzing: false,           // 是否正在分析中
}
```

**持久化（localStorage）：** 用了 Zustand 的 `persist` 中间件，把关键数据存到浏览器本地。效果是**刷新页面不丢数据**，用户关了浏览器再打开还能继续。

**面试可能问：为什么用 Zustand 而不是 React 自带的 useState？**
> 因为 useState 只在单个组件内有效。我们需要在**多个页面之间共享数据**（评估页存答案 → 分析页读答案发给后端 → 结果页读分析结果），所以需要全局状态管理。Zustand 比 Redux 轻量很多，API 简洁，适合这个项目的规模。

### 3.4 题目数据结构（隐藏标签系统）

```typescript
// data/questions.ts
{
  id: 1,
  chapter: 1,                           // 属于第几章
  question: "在边界和忠诚上，伴侣更接近：",  // 题目文字
  type: "single",                        // 单选题
  dimension: "loyalty",                  // 心理维度
  choices: [
    {
      label: "边界清楚，我很安心",         // 用户看到的文字
      value: "A",
      tags: { safe: 3, loyal: 3 }        // ← 隐藏标签！用户看不到
    },
    {
      label: "有隐瞒暧昧、背叛或反复欺骗",
      value: "D",
      tags: { danger: 5, risk: 5, selfish: 3 }  // 危险信号
    },
  ]
}
```

**关键设计：** 用户只看到选项文字，看不到 `tags`。每个选项背后藏着心理标签和分数，用户选完后这些标签被悄悄收集，最后后端汇总计算。

**面试可能问：为什么把标签藏在前端而不是后端？**
> 因为后端是无状态的（不存任何数据），所有题目数据都在前端。用户选完后，前端把选项值 **和** 对应的标签一起发给后端。后端只负责汇总和计算，不需要知道题库内容。这样题目的修改只需改前端代码。

### 3.5 评估页核心逻辑 (`assessment/page.tsx`)

```
用户进入 /assessment
  │
  ├─ 显示章节过场动画（ChapterIntro）
  │   用户点"继续" → 关闭过场
  │
  ├─ 显示当前题目（QuestionCard）
  │   用户选一个选项 → 触发 handleAnswer()
  │
  ├─ handleAnswer() 做了什么：
  │   1. 把答案存入 Zustand store
  │   2. 等 300ms（让用户看到选中效果）
  │   3. 自动跳到下一题
  │   4. 如果进入新章节 → 显示章节过场
  │   5. 如果是最后一题 → 跳转 /analyzing
  │
  └─ 特殊题目处理：
      - Q1 → 记录用户性格类型
      - Q2 → 记录伴侣性格类型
      - Q21（文本题）→ 记录自由文本
```

**三种题型：**
| 类型 | 说明 | 交互 |
|------|------|------|
| `single` | 单选题（4 个选项） | 点选项 → 自动下一题 |
| `multi` | 多选题（最多选 2 个） | 点选项打勾 → 点"确认选择" |
| `text` | 文本输入 | 输入文字 → 点"提交"，或"跳过" |

### 3.6 SSE 流式通信（难点，但老师大概率会问）

**问题：** AI 生成报告需要十几秒，用户不可能干等一个大 JSON 回来。怎么办？

**答案：** 用 **SSE（Server-Sent Events）** 技术，让后端**一边生成一边往前端推送**，像打字一样逐渐出现。

```
前端                              后端                         LLM (AI)
  │                                │                            │
  │── POST /api/v1/analysis/stream ──▶│                            │
  │                                │── 计算分数 ──▶               │
  │                                │── 发送答题数据 ──────────────▶│
  │◀── event: start (风险分数) ────│                            │
  │                                │◀── "这段关系" ──────────────│
  │◀── event: chunk ("这段关系") ──│                            │
  │                                │◀── "整体来看..." ───────────│
  │◀── event: chunk ("整体来看...")│                            │
  │          ... 重复多次 ...       │          ... 重复多次 ...    │
  │                                │◀── 生成完毕 ────────────────│
  │◀── event: complete (完整JSON) ─│                            │
  │                                │                            │
  │── 跳转到 /result ──▶           │                            │
```

**SSE 协议的 4 种事件：**

| 事件 | 含义 | 数据内容 |
|------|------|---------|
| `start` | 开始了 | `{ riskScore: 45.3, verdict: "observe" }` |
| `chunk` | AI 生成了一小段文字 | `{ content: "这段关系..." }` |
| `complete` | 全部完成 | `{ result: { verdict, tips, ... } }` 完整 JSON |
| `error` | 出错了 | `{ error: "错误信息" }` |

**useSSE Hook 的实现原理** (`hooks/useSSE.ts`)：
1. 用 `fetch()` 发 POST 请求
2. 拿到响应后，用 `ReadableStream` 逐块读取数据
3. 逐行解析 SSE 格式（`event: xxx` + `data: xxx` + 空行分隔）
4. 根据事件类型调用不同的回调函数
5. 设了 90 秒超时，超时自动断开

**面试可能问：为什么不用 WebSocket？**
> SSE 更简单，只需要后端往前端单向推送就够了（前端不需要在分析过程中往后端发消息）。WebSocket 是双向通信，对这个场景来说过重了。而且 SSE 基于普通 HTTP，不需要额外的协议升级。

### 3.7 结果页 (`result/page.tsx`)

从 Zustand store 读取 `analysisResult`，依次渲染 5 个组件：

```
┌─────────────────────────┐
│   ANALYSIS COMPLETE      │  ← 头部文字
├─────────────────────────┤
│ 🌹 神仙伴侣              │  ← Verdict 组件（判定结果）
│ "这段关系整体健康..."     │
├─────────────────────────┤
│ [你的状态]               │  ← MentalHealth 组件
│ "你在关系中表现出..."     │
│ [伴侣状态]               │
│ "伴侣在互动中..."        │
├─────────────────────────┤
│ ~~NPD~~ → 关系中强势方   │  ← MythBuster 组件（名词解构）
│ 针对你的分析...           │
├─────────────────────────┤
│ #安全感充足 #三观契合     │  ← PersonaTag 组件（可截图分享）
├─────────────────────────┤
│ 01. 建议1                │  ← Tips 组件
│ 02. 建议2                │
│ 03. 建议3                │
├─────────────────────────┤
│ [保存/分享完整报告]       │  ← html2canvas 截图功能
│ [重新测评]               │
└─────────────────────────┘
```

**截图分享功能：** 用 `html2canvas` 库把页面内容渲染成图片。移动端优先尝试系统原生分享（`navigator.share`），PC 端降级为下载 PNG。

---

## 四、后端代码详解

### 4.1 技术栈解释

| 技术 | 干什么的 |
|------|---------|
| **FastAPI** | Python 的 Web 框架，用来写 API 接口 |
| **Pydantic** | 数据验证，确保请求参数格式正确 |
| **OpenAI SDK** | 调用大语言模型的客户端库（兼容各种 AI 服务） |
| **SSE-Starlette** | FastAPI 的 SSE 插件，支持流式推送 |

### 4.2 文件结构

```
backend/app/
├── main.py                ← 入口文件，创建 FastAPI 应用
├── config.py              ← 配置管理（读 .env 文件）
├── api/v1/
│   ├── assessment.py      ← API: 提交评估（计算分数）
│   └── analysis.py        ← API: 流式分析（调用 AI）
├── services/
│   ├── scoring_service.py ← 评分逻辑（标签汇总、风险计算）
│   └── llm_service.py     ← LLM 服务（调用 AI 模型）
└── prompts/
    └── analysis_system.txt ← AI 的系统提示词（告诉 AI 怎么分析）
```

### 4.3 评分逻辑（`scoring_service.py`，核心算法）

**步骤 1：汇总标签** — `aggregate_tags()`

把所有答案的隐藏标签加在一起。

```
用户选了：
  Q1: A → { safe: 3, loyal: 3 }
  Q2: B → { safe: 1 }
  Q3: C → { risk: 2, controlled: 2 }

汇总结果：
  { safe: 4, loyal: 3, risk: 2, controlled: 2 }
```

**步骤 2：性格调整** — `get_personality_weight_adjustments()`

根据用户和伴侣的性格类型，对某些标签打折或加权。

```
如果用户是感性的(emotional)：
  → anxious 标签 × 0.7（感性用户容易过度报告焦虑，所以打个折）

如果用户是理性的(rational)：
  → controlled 标签 × 1.3（理性用户可能低估了控制行为，所以加权）
```

**面试可能问：为什么要做性格调整？**
> 因为不同性格的用户对同一件事的感知不同。感性的人可能把普通焦虑说得很严重（所以焦虑标签打折），理性的人可能忽略了对方的控制行为（所以控制标签加权）。这是一种**校准机制**。

**步骤 3：计算风险分数** — `compute_risk_score()`

```python
风险标签 = [risk, danger, controlled, selfish, verbal_abuse, gaslighting, ...]  # 12+个
安全标签 = [safe, mature, compatible, loyal, mental_healthy, ...]                # 7个

风险分数 = 风险标签总分 / (风险标签总分 + 安全标签总分) × 100
```

比如：风险总分 20，安全总分 30 → 风险分数 = 20/50×100 = **40 分**

**步骤 4：确定判定** — `determine_verdict()`

| 风险分数 | 判定 | 中文 |
|----------|------|------|
| ≤ 25 | `angel` | 神仙伴侣 |
| 26–55 | `observe` | 继续观察 |
| > 55 | `run` | 建议远离 |

### 4.4 LLM 服务（`llm_service.py`）

**做什么：** 把用户数据 + 系统提示词发给 AI，让 AI 生成分析报告。

```python
# 用 OpenAI 兼容的 SDK（支持 GPT、Gemini 等各种模型）
self.client = openai.OpenAI(
    api_key=API_KEY,          # API 密钥
    base_url=API_ENDPOINT,    # API 地址（可以指向任何兼容的服务）
)
```

**构建提示词**（`_build_prompt()`）— 发给 AI 的内容：

```
## 用户答题数据
题目1: 选择=A
题目2: 选择=B
...

## 性格类型
用户: rational
伴侣: emotional

## 用户补充说明
（用户自由输入的文字）

## 心理标签汇总
- safe: 15
- risk: 8
- controlled: 5
...

## 初步评估
风险分数: 40/100
初步判定: observe

请根据以上数据生成完整的分析报告。
```

**系统提示词**（`prompts/analysis_system.txt`）— 告诉 AI 的"角色设定"：
- 你是 LoveAudit 的分析引擎
- 以用户为中心，不替伴侣找借口
- 不贴极端标签（不直接说"NPD"、"渣男"）
- 解构网红名词（NPD 其实是强势方，血包其实是弱势方...）
- 必须以 JSON 格式输出（verdict、mentalHealth、mythBusters、tips 等）

**面试可能问：为什么用 OpenAI SDK 但不一定调用 OpenAI？**
> 因为 OpenAI 的 API 格式已经成了事实标准，很多其他 AI 服务（如 Gemini、Claude、国产模型）都兼容这个格式。用 OpenAI SDK + 自定义 `base_url` 就能接入任何兼容服务，不用为每个模型写不同的代码。

### 4.5 流式分析 API（`analysis.py`）

```python
@router.post("/analysis/stream")
async def stream_analysis(request):
    # 1. 从请求中拿到答案、性格类型
    # 2. 调用 analysis_event_generator() 生成 SSE 事件流
    # 3. 返回 EventSourceResponse（SSE 响应）
```

**事件生成器的流程：**
```
1. 计算分数（aggregate_tags → 性格调整 → compute_risk_score → determine_verdict）
2. 发送 start 事件（含风险分数）
3. 调用 LLM 流式生成
4. 每收到一小段文字 → 发送 chunk 事件，同时把文字存入 buffer
5. AI 生成完毕 → 尝试把 buffer 解析为 JSON
   - 解析成功 → 发送 complete 事件（含结构化的 JSON）
   - 解析失败 → 发送 complete 事件（含原始文本）
6. 超时（90秒）→ 发送 error 或把已有内容作为 complete 返回
```

### 4.6 配置管理（`config.py`）

用 Pydantic Settings 从 `.env` 文件读取配置：

```env
API_KEY=sk-xxx           # AI 服务的密钥
API_ENDPOINT=https://... # AI 服务的地址
MODEL=gemini-3-flash     # 用哪个模型
DEBUG=true               # 是否开启调试模式（开启后有 Swagger 文档）
```

**面试可能问：为什么用 .env 文件而不是写死在代码里？**
> 因为 API 密钥是敏感信息，不能提交到 Git 仓库。.env 文件在 .gitignore 里，不会被提交。而且不同环境（开发/生产）的配置不同，用 .env 文件可以灵活切换。

---

## 五、关键设计决策（老师可能问的"为什么"）

### Q1: 为什么不用数据库？

> 这是一个**无状态应用**——没有用户账号、没有历史记录、不需要登录。所有数据都存在用户的浏览器里（Zustand + localStorage）。用完就丢，下次重新来。这大大简化了部署和维护。

### Q2: 为什么标签放在前端而不是后端？

> 因为每道题的选项和标签是一对一绑定的，放在前端可以在用户选择时立即关联。后端只需要做汇总计算，不需要维护题库。如果要改题目或标签，只改前端一个文件就行。

### Q3: 风险分数的算法合理吗？

> 它用的是**风险占比**：风险标签总分 ÷ (风险+安全总分) × 100。好处是不受答题数量影响——答 10 题和答 20 题的分数可比。局限是所有风险标签权重相同（`danger:5` 和 `risk:1` 被同等对待），实际上不同风险信号的严重程度不同。未来可以加权重。

### Q4: 为什么用 SSE 而不是轮询或 WebSocket？

> **轮询**（每隔几秒问一次"好了没"）：浪费资源，延迟高。
> **WebSocket**：双向通信，但我们只需要后端→前端单向推送。
> **SSE**：基于普通 HTTP，后端单向推送，完美匹配"AI 边生成边推送"的场景。实现简单，兼容性好。

### Q5: 如果 AI 返回的不是合法 JSON 怎么办？

> 后端先尝试 `json.loads()` 解析 AI 的输出。如果 AI 用 markdown 包了代码块（\`\`\`json ... \`\`\`），会先去掉代码块再解析。如果还是失败，就把原始文本作为 `text` 字段返回。前端收到后也有降级逻辑——尝试从文本中提取 JSON，失败则用默认值兜底。**三层容错：后端去代码块 → 前端正则提取 → 默认值。**

### Q6: 项目怎么部署的？

> 用 **Docker Compose** 一键部署。两个容器：
> - frontend 容器跑 Next.js（对外端口 8654）
> - backend 容器跑 FastAPI（对外端口 8147）
> 开发时用 tmux 在一个终端里同时跑两个服务。

---

## 六、可能的追问及回答

### "你在这个项目中负责了什么？"

> 我负责了全栈开发，包括：
> 1. **产品设计**：设计了 5 章 21 题的问卷结构和心理标签体系
> 2. **前端开发**：用 Next.js + React 实现了 4 个页面和所有交互组件
> 3. **后端开发**：用 FastAPI 实现了评分算法和 AI 分析的 SSE 流式接口
> 4. **AI 集成**：设计了系统提示词，让 AI 按照指定 JSON 格式输出分析报告
> 5. **部署**：Docker Compose 容器化部署

### "遇到了什么技术难点？"

> 1. **SSE 流式通信**：前端用 Fetch API + ReadableStream 手动解析 SSE 格式，比直接用 EventSource API 复杂，但支持 POST 请求
> 2. **html2canvas 截图**：Tailwind CSS 4 生成的 `oklch()` 颜色函数不被 html2canvas 支持，需要在截图前把所有颜色转换为标准 hex/rgb
> 3. **状态持久化**：Zustand 的 persist 中间件在 SSR（服务端渲染）时会导致 hydration 不匹配，需要用 `useHydrated()` Hook 等待客户端 rehydration 完成后再渲染

### "如果让你改进，你会怎么做？"

> 1. 给风险标签加**权重**（`danger` 应该比 `risk` 更严重）
> 2. 加**用户账号系统**，可以保存历史测评记录
> 3. AI 分析结果加**缓存**，相同答案不用重复调用 AI
> 4. 加**A/B 测试**，优化问卷题目的表达方式
> 5. 支持**多语言**

---

## 七、核心代码速查表

| 你想说的 | 对应代码位置 |
|---------|-------------|
| 题目数据和隐藏标签 | `frontend/src/data/questions.ts` |
| 答题交互逻辑 | `frontend/src/app/assessment/page.tsx` |
| 全局状态管理 | `frontend/src/store/store.ts` |
| SSE 流式通信 | `frontend/src/hooks/useSSE.ts` |
| 发起 AI 分析 | `frontend/src/app/analyzing/page.tsx` |
| 结果展示 | `frontend/src/app/result/page.tsx` |
| 评分算法 | `backend/app/services/scoring_service.py` |
| AI 调用和提示词构建 | `backend/app/services/llm_service.py` |
| SSE 事件生成 | `backend/app/api/v1/analysis.py` |
| AI 的角色设定 | `backend/app/prompts/analysis_system.txt` |
| API 代理配置 | `frontend/next.config.ts` |
| 环境变量 | 项目根目录 `.env` |
