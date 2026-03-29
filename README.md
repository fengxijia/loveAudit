# LoveAudit — 亲密关系深度解码系统

AI 驱动的婚恋对象评估平台。通过多章节心理问卷 + LLM 分析，帮助用户理性评估亲密关系。

## Features

- **5 章 21 题心理问卷** — 涵盖安全底线、互动情绪、价值规划、家庭边界、主观体感
- **单选 + 多选题型** — 单选题统一 4 选项 + 次级跳过按钮，多选题支持最大选择数限制
- **隐藏标签评分系统** — 每个选项携带不可见的心理标签，后端自动聚合计算风险分数
- **AI 流式分析** — LLM 实时生成个性化心理分析报告（SSE 流式传输）
- **网红名词解构** — 解构 NPD、煤气灯、三角测量等热词的真实含义
- **人格标签卡片** — 可截图分享的人格标签卡
- **暗黑哥特主题** — 红/黑/粉配色，玫瑰线条装饰，神秘哥特风 UI

## Tech Stack

| 层 | 技术 |
|----|------|
| Frontend | Next.js 16, React 19, TypeScript |
| State | Zustand |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| Backend | FastAPI, Python 3.10+ |
| LLM | OpenAI-compatible API (可接入任意兼容端点) |
| Deployment | Docker Compose |

## Architecture

```
Browser → Next.js (:8654) → /api/* rewrite → FastAPI (:8147) → LLM API
```

无数据库、无认证，所有状态存于客户端 Zustand store。

## Quick Start

### 环境变量

在项目根目录创建 `.env`：

```env
API_KEY=sk-your-api-key
API_ENDPOINT=https://your-openai-compatible-endpoint/v1
MODEL=gemini-3-flash-preview
DEBUG=true
CORS_ORIGINS='["http://localhost:8654","http://localhost:3147"]'
```

### Backend

```bash
cd backend
uv sync                # 安装依赖
./run.sh               # 启动开发服务器 (port 8147)
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # 启动开发服务器 (port 8654)
```

### Docker

```bash
docker compose up --build
# Frontend: http://localhost:3147
# Backend:  http://localhost:8147
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 入口
│   │   ├── config.py            # 配置管理
│   │   ├── api/v1/              # API 路由
│   │   ├── services/            # 业务逻辑（评分、LLM）
│   │   └── prompts/             # 系统提示词
│   ├── pyproject.toml
│   └── run.sh
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js 页面
│   │   ├── components/          # UI 组件
│   │   ├── hooks/               # 自定义 Hook
│   │   ├── store/               # Zustand 状态
│   │   ├── data/                # 问题数据（5章21题）
│   │   └── types/               # TypeScript 类型
│   ├── next.config.ts
│   └── package.json
├── docs/
│   ├── questions.md             # 题目规格文档
│   ├── frontend_doc.md          # 前端实现文档
│   ├── backend_doc.md           # 后端实现文档
│   ├── love_audit_PRD.md        # 产品需求文档
│   └── assessment_rules.md      # 评估规则
├── .env                         # 环境变量（不入库）
├── docker-compose.yml
└── CLAUDE.md                    # Claude Code 开发指引
```

## Documentation

- **[前端实现文档](docs/frontend_doc.md)** — 前端全部实现逻辑与细节
- **[后端实现文档](docs/backend_doc.md)** — 后端全部实现逻辑与细节
- **[产品需求文档](docs/love_audit_PRD.md)** — 产品逻辑与规则
- **[评估规则](docs/assessment_rules.md)** — 评分算法与判定规则
- **[题目规格](docs/questions.md)** — 21 题内容与评分指引
