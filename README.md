# LoveAudit — 亲密关系深度解码系统

AI 驱动的婚恋对象评估平台。通过多章节心理问卷 + LLM 分析，帮助用户理性评估亲密关系。

## Features

- **5 章 25 题问卷** ：涵盖安全底线、互动情绪、价值规划、家庭边界、主观体感
- **最强分析** ：最前沿的大模型、结合多对幸福夫妻经验，帮您生成专属情感分析报告和建议
- **关系标签卡片**：可截图分享的关系标签卡

## Tech Stack

| 层 | 技术 |
|----|------|
| Frontend | Next.js 16, React 19, TypeScript |
| State | Zustand |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| Backend | FastAPI, Python 3.10+ |
| LLM | OpenAI-compatible API (可接入任意兼容端点) |
| Deployment | Docker Compose |


## Quick Start

### 环境变量

在项目根目录创建 `.env`：

```env
API_KEY=sk-your-api-key
API_ENDPOINT=https://your-openai-compatible-endpoint/v1
MODEL=your-preferred-model
DEBUG=true
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
└── docker-compose.yml
```