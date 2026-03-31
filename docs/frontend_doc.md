# Frontend Implementation Documentation

> 维护者只看本文档即可了解前端全部实现逻辑，无需阅读源码。

## 目录

- [1. 项目配置](#1-项目配置)
- [2. 类型系统](#2-类型系统)
- [3. 状态管理 (Zustand)](#3-状态管理-zustand)
- [4. 问题数据](#4-问题数据)
- [5. SSE Hook](#5-sse-hook)
- [6. 页面](#6-页面)
- [7. 组件](#7-组件)
- [8. 样式与主题](#8-样式与主题)
- [9. 工具函数](#9-工具函数)
- [10. 路由与导航流程](#10-路由与导航流程)
- [11. 端到端数据流](#11-端到端数据流)

---

## 1. 项目配置

### Next.js 配置 (`next.config.ts`)

- **API 代理重写：** `/api/:path*` → `http://localhost:8147/api/:path*`（转发至 FastAPI 后端）
- **开发服务器端口：** 8654

### TypeScript (`tsconfig.json`)

- Target: ES2017，Module: esnext，严格模式
- **路径别名：** `@/*` → `./src/*`
- 增量编译启用

### 主要依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.1.6 | 框架 |
| React | 19.2.3 | UI 库 |
| Zustand | 5.0.11 | 状态管理 |
| Framer Motion | 12.0.0 | 动画 |
| Tailwind CSS | 4 | 样式 |
| Radix UI | - | 无障碍组件 |
| html2canvas | 1.4.1 | 截图分享 |
| lucide-react | 0.563.0 | 图标 |

---

## 2. 类型系统

**文件:** `src/types/index.ts`

### 核心类型

```typescript
// 选项（纯展示，不含评分标签）
interface Choice {
  label: string;              // 显示文本
  value: string;              // 选项值
}

// 问题
interface Question {
  id: number;
  chapter: number;            // 所属章节 (1-5)
  question: string;           // 问题文本
  description?: string;       // 补充说明
  type: "single" | "text";    // 单选 或 文本输入
  choices?: Choice[];         // 单选时的选项列表
  adaptive?: boolean;
  dimension: string;          // 心理维度（personality, safety, values 等）
}

// 章节
interface Chapter {
  id: number;
  title: string;              // 章节标题
  subtitle: string;           // 副标题
  icon: string;               // 章节图标 emoji
}

// 用户答案（仅存选项值，不含评分标签）
interface Answer {
  questionId: number;
  value: string;              // 选择的选项值
}

// 性格类型
type PersonalityType = "rational" | "emotional" | "balanced";

// 判定等级
type VerdictLevel = "angel" | "observe" | "run";

// 分析结果（后端返回）
interface AnalysisResult {
  verdict: VerdictLevel;
  verdictTitle: string;        // 核心结论标题
  verdictDescription: string;  // 50-100字描述
  mentalHealth: {
    user: string;              // 用户心理分析
    partner: string;           // 伴侣心理推测
  };
  mythBusters: Array<{
    buzzword: string;          // 网红名词
    realMeaning: string;       // 真实含义
    analysis: string;          // 针对用户的分析
  }>;
  personaTags: string[];       // 人格标签列表
  tips: string[];              // 可操作建议列表
}
```

---

## 3. 状态管理 (Zustand)

**文件:** `src/store/store.ts`

### Store 结构

```typescript
interface AppState {
  // 评估阶段
  currentIndex: number;                    // 当前题目索引
  answers: Answer[];                       // 已回答列表
  userPersonality: PersonalityType | null; // 用户性格类型
  partnerPersonality: PersonalityType | null; // 伴侣性格类型
  freeformText: string;                    // 自由文本补充

  // 分析阶段
  analysisResult: AnalysisResult | null;   // 最终分析结果
  streamingText: string;                   // 流式文本（降级备用）
  isAnalyzing: boolean;                    // 是否正在分析中
}
```

### Actions

| Action | 说明 |
|--------|------|
| `setCurrentIndex(index)` | 设置当前题目索引 |
| `addAnswer(answer)` | 添加答案（按 questionId 去重，后答覆盖前答） |
| `setUserPersonality(type)` | 设置用户性格 |
| `setPartnerPersonality(type)` | 设置伴侣性格 |
| `setFreeformText(text)` | 设置自由文本 |
| `setAnalysisResult(result)` | 设置分析结果 |
| `appendStreamingText(text)` | 追加流式文本 |
| `setIsAnalyzing(analyzing)` | 设置分析状态 |
| `resetStreamingText()` | 清空流式文本 |
| `reset()` | 重置所有状态（重新开始评估） |

**关键行为：**
- `addAnswer` 会先过滤掉相同 questionId 的旧答案再添加新答案
- `reset()` 清除所有状态并同时清除 localStorage 缓存

### 持久化 (Persist)

使用 Zustand `persist` 中间件将部分状态缓存到 `localStorage`（key: `"loveaudit-store"`）。

**缓存的字段：** `currentIndex`, `answers`, `userPersonality`, `partnerPersonality`, `freeformText`, `analysisResult`
**不缓存的字段：** `streamingText`, `isAnalyzing`（瞬态流式状态，无需持久化）

**效果：** 用户刷新页面或关闭浏览器后重新打开，评估进度和分析结果自动恢复。点击"重新测评"调用 `reset()` 后缓存清除。

### Hydration Hook

```typescript
export function useHydrated(): boolean
```

返回 `true` 表示 persist 已从 localStorage 完成 rehydration。所有依赖 store 数据做跳转判断的页面（assessment、analyzing、result）必须在 hydrated 之后再读取 store，否则会因为 SSR 初始状态为空而误跳转到首页。

---

## 4. 问题数据

**文件:** `src/data/questions.ts`

### 章节结构（5 章 19 题）

| 章节 | 标题 | 图标 | 题数 |
|------|------|------|------|
| 1 | 双方性格 | 🎭 | 3 题 |
| 2 | 基础安全 | 🛡️ | 4 题 |
| 3 | 三观金钱 | ⚖️ | 4 题 |
| 4 | 矛盾处理 | 🌪️ | 4 题 |
| 5 | 原生家庭 | 🧬 | 3 题单选 + 1 题文本 |

### 问题类型

- **`"single"`：** 多选一，每个选项携带隐藏的心理标签
- **`"text"`：** 自由文本输入（可跳过）

### 标签系统

心理标签（如 `safe`, `risk`, `gaslighting`）**仅存于后端** `backend/app/data/questions_data.py`，前端不包含任何评分标签数据。前端只发送 `questionId` + `value`，后端根据此查表获取对应标签并计算评分。这样用户无法通过浏览器 DevTools、Network 面板或 localStorage 看到评分逻辑。

### 涉及的心理维度

`personality`, `attachment`, `safety`, `loyalty`, `trust`, `money`, `values`, `respect`, `conflict`, `communication`, `responsibility`, `self_worth`, `family`, `family_boundary`, `core_wish`, `freeform`

---

## 5. SSE Hook

**文件:** `src/hooks/useSSE.ts`

### 接口

```typescript
function useSSE(url: string, options?: SSEOptions): {
  connect: (body: unknown) => Promise<void>; // POST 请求，启动 SSE 流
  disconnect: () => void;                     // 中止连接
  isConnected: boolean;                       // 连接状态
  error: Error | null;                        // 最近错误
}

interface SSEOptions {
  onMessage?: (data: unknown) => void;   // 每个 chunk 事件触发
  onError?: (error: Error) => void;      // 错误或超时触发
  onComplete?: (result: unknown) => void; // complete 事件触发
  timeoutMs?: number;                     // 超时时间，默认 90000ms
}
```

### 实现细节

- 使用 **Fetch API + ReadableStream** 实现流式读取（非 EventSource）
- 逐行解析 SSE 格式（`event:` + `data:` 行）
- 事件处理：
  - `chunk` → 调用 `onMessage`，传入 `{ content: string }`
  - `complete` → 调用 `onComplete`，传入 `{ result: AnalysisResult }` 或 `{ text: string }`
  - `error` → 调用 `onError`
  - `start` → 包含 `{ riskScore: number }`（元数据）
- 每个 event data 先尝试 `JSON.parse`，失败则作为纯文本处理
- 超时后自动 abort，触发 `onError`（"分析超时，请重试"）
- 流结束时处理 buffer 中可能的剩余事件

---

## 6. 页面

### 6.1 首页 Landing (`/`)

**文件:** `src/app/page.tsx`

- 展示标题 "LoveAudit" 和标语 "亲密关系深度解码系统"
- 4 张 HookCards 展示痛点问题
- CTA 按钮跳转至 `/assessment`
- 入场动画：opacity + y 位移（Framer Motion）

### 6.2 评估页 Assessment (`/assessment`)

**文件:** `src/app/assessment/page.tsx`

**状态管理：** 从 Zustand store 读取 `currentIndex`、`answers`、`userPersonality` 等

**核心流程：**
1. 进入新章节时显示 ChapterIntro（跟踪 `currentIndex` 和 `lastChapter` 检测章节切换）
2. 显示当前题目的 QuestionCard
3. 用户选择后 **300ms 延迟自动前进** 到下一题
4. 顶部 ProgressBar 显示章节信息和进度
5. 返回按钮（第 1 题时禁用）
6. **19 题全部回答后自动跳转** `/analyzing`

**特殊逻辑：**
- Q1 的答案记录为用户性格类型 (`userPersonality`)
- Q2 的答案记录为伴侣性格类型 (`partnerPersonality`)
- Q19（文本题）的答案记录为自由文本 (`freeformText`)

### 6.3 分析页 Analyzing (`/analyzing`)

**文件:** `src/app/analyzing/page.tsx`

**UI 元素：**
- MatrixRain: canvas 背景动画（"LOVEAUDIT" 字符雨）
- 扫描动画：脉冲圆环 + 旋转环
- 进度点：5 个交错透明度动画点
- CbtTips：每 4 秒轮换的心理学小知识

**SSE 集成：**
- 发送 POST 至 `/api/v1/analysis/stream`
- 请求体（不含 tags，评分标签由后端查表获取）：
  ```json
  {
    "answers": { "1": { "value": "A", "questionText": "...", "selectedLabel": "..." }, ... },
    "userPersonality": "rational",
    "partnerPersonality": "emotional",
    "freeformText": "..."
  }
  ```
- `onMessage`：追加流式文本到 store
- `onComplete`：设置 analysisResult，自动跳转 `/result`
- `onError`：显示错误信息 + "重新分析" 按钮

**错误处理：**
- 错误信息以红色展示
- 重试按钮：先断开连接再重新发起分析
- 如果没有答案数据，重定向到首页

### 6.4 结果页 Result (`/result`)

**文件:** `src/app/result/page.tsx`

**布局（从上到下）：**
1. "ANALYSIS REPORT" 头部
2. Verdict 卡片（判定结果）
3. MentalHealth 卡片（心理分析）
4. MythBuster 卡片（名词解构）
5. PersonaTag 卡片 + 分享按钮
6. Tips 卡片（建议列表）
7. 重置按钮
8. 页脚

**降级解析：**
- 如果 `analysisResult` 为 null 但 `streamingText` 存在，尝试从文本中提取 JSON
- 解析失败则使用默认值（verdict 默认 "observe"）

---

## 7. 组件

### 7.1 评估组件

#### QuestionCard (`src/components/assessment/QuestionCard.tsx`)

**Props:** `question: Question`, `onAnswer: (value) => void`, `selectedValue?: string`

**行为：**
- `type === "text"`：显示 textarea + 跳过按钮 + 提交按钮
- `type === "single"`：选项按钮列表，带交错入场动画
  - 已选中：cyan 边框 + cyan/10 背景 + 发光阴影
  - 未选中：purple/15 边框 + secondary/30 背景

#### ChapterIntro (`src/components/assessment/ChapterIntro.tsx`)

**Props:** `chapterId: number`, `onContinue: () => void`

**展示：** 大号章节图标（缩放+旋转动画）→ "CHAPTER {id} / 5" → 章节标题（紫色发光）→ 副标题 → 渐变线 → 继续按钮

#### ProgressBar (`src/components/assessment/ProgressBar.tsx`)

**Props:** `currentIndex`, `totalQuestions`, `currentChapter`

- 显示章节图标 + 标题
- 进度百分比：`(currentIndex + 1) / totalQuestions * 100`
- 进度条渐变色：purple → cyan

### 7.2 分析组件

#### MatrixRain (`src/components/analyzing/MatrixRain.tsx`)

- Canvas 绘制的字符雨背景
- 字符集："LOVEAUDIT心理分析评估亲密关系解码扫描01"
- 字号 14px，列数 = canvas.width / fontSize
- 绘制循环：50ms 间隔
- 字符落到底部后 97.5% 概率重置
- 固定定位，不响应鼠标事件

#### CbtTips (`src/components/analyzing/CbtTips.tsx`)

- 6 条轮换的 CBT/心理学小知识
- 每 4 秒切换，带 AnimatePresence 动画
- y 轴 ±15px 位移 + opacity 淡入淡出

### 7.3 首页组件

#### HookCards (`src/components/landing/HookCards.tsx`)

- 4 张痛点卡片：💔（分手）、🚧（边界）、⏳（沉没成本）、🧠（网红名词）
- 扫描线效果（CSS 动画叠加层）
- 网格布局，交错入场动画

### 7.4 结果组件

#### Verdict (`src/components/result/Verdict.tsx`)

**Props:** `level: VerdictLevel`, `title: string`, `description: string`

根据 level 配置不同样式：
| level | emoji | 发光色 | 动画 |
|-------|-------|--------|------|
| angel | ✨ | 绿色 | pulse-green |
| observe | 🔍 | 黄色 | pulse-yellow |
| run | 🚨 | 红色 | pulse-red |

弹簧动画入场（scale 0.9 → 1）

#### MentalHealth (`src/components/result/MentalHealth.tsx`)

**Props:** `user: string`, `partner: string`

两段心理分析文本，以分隔线隔开，标签为 "[ 你的状态 ]" 和 "[ 伴侣状态 ]"

#### MythBuster (`src/components/result/MythBuster.tsx`)

**Props:** `myths: Array<{ buzzword, realMeaning, analysis }>`

每条：~~网红名词~~（红底删除线）→ 箭头 → 真实含义（cyan 底）+ 分析文字

#### PersonaTag (`src/components/result/PersonaTag.tsx`)

**Props:** `tags: string[]`, `verdict: string`

- 可分享的卡片容器（用 ref 引用）
- 展示：判定标题 + 标签药丸（#tag 格式）+ 页脚水印
- **重要：** 卡片区域使用 **内联 hex 样式**（`shareCardStyles` 对象），不使用 Tailwind 类名。原因：html2canvas 1.x 无法解析 Tailwind CSS 4 生成的 `lab()`/`oklch()` 颜色函数，会导致颜色丢失或截图空白。
- **分享功能：** html2canvas 截图（2x 缩放，暗色背景 #0a0a0f，`useCORS: true`）
  - 按钮点击后进入 `saving` 状态（防止重复点击，按钮显示"生成中..."）
  - 动态导入 html2canvas，兼容 `mod.default` 和 `mod` 两种导出方式
  - `canvas.toBlob()` 包装为 Promise，失败时提示用户
  - 优先尝试 `navigator.share()` API（移动端原生分享）
  - 降级为下载 PNG（`document.body.appendChild(a)` 确保兼容性）
  - 错误时在控制台打印详情并 alert 提示

#### Tips (`src/components/result/Tips.tsx`)

**Props:** `tips: string[]`

编号列表（2 位数补零），紫色 mono 数字标签，交错入场动画

### 7.5 UI 基础组件

#### Button (`src/components/ui/button.tsx`)

基于 CVA（class-variance-authority）的按钮组件。

**Variants：** `default`, `ghost`, `outline`, `neon`
- **neon：** cyan 边框 + cyan 文字 + 发光阴影 + hover 亮度提升

**Sizes：** `default`, `sm`, `lg`, `icon`

支持 Radix Slot 组合和 forwardRef。

#### Card (`src/components/ui/card.tsx`)

基础卡片 + CardHeader + CardTitle + CardContent 子组件。
- `card-glow` 类：紫色 box-shadow，hover 时加亮
- 圆角 xl，紫色/10 边框

#### Progress (`src/components/ui/progress.tsx`)

Radix Progress 封装。渐变指示器（purple → cyan），500ms 平滑过渡。

---

## 8. 样式与主题

**文件:** `src/app/globals.css`

### 颜色体系（CSS 变量）

| 变量 | 值 | 用途 |
|------|-----|------|
| `--background` | `#0a0a0f` | 极深色背景 |
| `--foreground` | `#e2e8f0` | 浅灰文字 |
| `--card` | `#12121a` | 卡片背景 |
| `--primary` | `#a855f7` | 紫色主色 |
| `--secondary` | `#1e1e2e` | 深紫次色 |
| `--accent` | `#7c3aed` | 中紫强调色 |
| `--neon` | `#22d3ee` | 青色霓虹 |
| `--destructive` | `#ef4444` | 红色警告 |

### 背景渐变
径向渐变：20% 50% 紫色 + 80% 20% 青色，低透明度

### 自定义 CSS 类

| 类名 | 效果 |
|------|------|
| `.text-glow` | 青色文字发光 (text-shadow) |
| `.text-glow-purple` | 紫色文字发光 |
| `.card-glow` | 紫色卡片发光 (box-shadow) |
| `.scan-line::after` | 扫描线动画叠加层（4s 循环） |
| `.cursor-blink::after` | 打字光标闪烁 |

### 关键帧动画

| 动画名 | 效果 |
|--------|------|
| `pulse-green` | 绿色 box-shadow 脉冲 |
| `pulse-yellow` | 黄色脉冲 |
| `pulse-red` | 红色脉冲 |
| `matrix-fall` | 字符雨下落 |
| `scan` | 垂直扫描线移动 |
| `blink` | 光标闪烁 |

### Tailwind 集成
- Tailwind CSS 4，`@import` + `@theme` 内联
- 自定义主题色定义为 CSS 变量
- 默认圆角：0.625rem

---

## 9. 工具函数

**文件:** `src/lib/utils.ts`

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

使用 clsx 合并类名 + tailwind-merge 解决 Tailwind 类冲突。

---

## 10. 路由与导航流程

```
/ (首页 Landing)
  ↓ [开始按钮]
/assessment (评估)
  ↓ [回答完 19 题后自动跳转]
/analyzing (分析中)
  ↓ [SSE complete 事件后自动跳转]
/result (结果)
  ↓ [重置按钮]
/ (返回首页)
```

- 使用 Next.js `useRouter().push()` 导航
- 无中间件、无路由守卫（仅 analyzing 页面校验是否有答案数据）

---

## 11. 端到端数据流

```
1. 用户在 /assessment 逐题作答
   → 每个答案存入 Zustand store（仅含选项值，不含评分标签）
   ↓
2. 25 题完成后自动跳转 /analyzing
   ↓
3. analyzing 页面发送 POST /api/v1/analysis/stream
   → 请求体包含所有答案（questionId + value + questionText + selectedLabel）+ 性格类型 + 自由文本
   → 后端根据 questionId + value 从 questions_data.py 查表获取隐藏标签
   ↓
4. SSE 流式接收：
   - chunk 事件 → appendStreamingText() 追加到 store
   - complete 事件 → setAnalysisResult() 存入 store → 跳转 /result
   ↓
5. /result 页面从 store 读取 analysisResult
   → 渲染判定、心理分析、名词解构、标签、建议
   ↓
6. 用户可分享 PersonaTag 卡片（html2canvas 截图 → share/download）
   ↓
7. 重置按钮 → store.reset() → 跳转首页
```

---

## 文件路径索引

```
frontend/src/
├── app/
│   ├── page.tsx                    # 首页
│   ├── assessment/page.tsx         # 评估页
│   ├── analyzing/page.tsx          # 分析中页
│   ├── result/page.tsx             # 结果页
│   ├── layout.tsx                  # 根布局
│   └── globals.css                 # 主题与动画
├── components/
│   ├── assessment/
│   │   ├── QuestionCard.tsx        # 题目卡片
│   │   ├── ChapterIntro.tsx        # 章节介绍
│   │   └── ProgressBar.tsx         # 进度条
│   ├── analyzing/
│   │   ├── MatrixRain.tsx          # 字符雨背景
│   │   └── CbtTips.tsx             # 心理学小知识轮播
│   ├── landing/
│   │   └── HookCards.tsx           # 痛点卡片
│   ├── result/
│   │   ├── Verdict.tsx             # 判定结果
│   │   ├── MentalHealth.tsx        # 心理分析
│   │   ├── MythBuster.tsx          # 名词解构
│   │   ├── PersonaTag.tsx          # 人格标签（可分享）
│   │   └── Tips.tsx                # 建议列表
│   └── ui/
│       ├── button.tsx              # 按钮
│       ├── card.tsx                # 卡片
│       └── progress.tsx            # 进度条
├── hooks/
│   └── useSSE.ts                   # SSE 流式 Hook
├── store/
│   └── store.ts                    # Zustand 状态管理
├── data/
│   └── questions.ts                # 问题与章节数据
├── types/
│   └── index.ts                    # TypeScript 类型定义
└── lib/
    └── utils.ts                    # 工具函数
```
