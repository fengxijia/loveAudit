# LoveAudit — 亲密关系深度解码系统

AI 驱动的婚恋对象评估平台。通过多章节心理问卷 + 结构化分析，帮助用户理性评估亲密关系。

[https://auditlove.com](https://auditlove.com)

## Features

- **5 章 25 题问卷**：涵盖安全底线、互动情绪、价值规划、家庭边界、主观体感五大板块
- **AI 深度分析报告**：最前沿大模型 + 多对夫妻相处经验 生成专属情感分析和建议
- **关系标签卡片**：可截图分享的关系标签卡
- **完全匿名**：无需注册，无数据库，所有数据仅存于浏览器本地

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, React 19, TypeScript |
| State | Zustand (localStorage persist) |
| Styling | Tailwind CSS 4, Radix UI, Framer Motion |
| Backend | FastAPI, Python 3.12+ |
| LLM | OpenAI-compatible API |
| Deployment | Vercel (frontend + backend) / Docker Compose |

## Quick Start

### Local Environment Variables

Create `.env` in the project root (see `.env.example`):

```env
BACKEND_URL=http://localhost:8147
API_KEY=sk-your-api-key
API_ENDPOINT=https://your-openai-compatible-endpoint/v1
MODEL=your-preferred-model
CORS_ORIGINS=["http://localhost:8654","https://your-domain.com"]
```

### Development

```bash
# Backend
cd backend
uv sync
uvicorn app.main:app --host 0.0.0.0 --port 8147 --reload

# Frontend
cd frontend
npm install
npm run dev    # http://localhost:8654
```

### Production (Docker)

```bash
docker compose up -d --build
# Frontend: http://localhost:3147
# Backend:  http://localhost:8147
```

## Vercel Deployment

This repository is set up for **two Vercel projects**:

1. **Frontend project**
   - Root Directory: `frontend`
   - Framework Preset: `Next.js`
   - Environment Variable:

   ```env
   BACKEND_URL=https://your-backend-project.vercel.app
   ```

2. **Backend project**
   - Root Directory: `backend`
   - Runtime: Python
   - Entry point: `api/index.py`
   - Environment Variables:

   ```env
   API_KEY=your-api-key
   API_ENDPOINT=https://your-openai-compatible-endpoint/v1
   MODEL=your-model-name
   DEBUG=false
   CORS_ORIGINS=["https://your-frontend-project.vercel.app"]
   ```

### Deploy Order

1. Deploy the **backend** Vercel project first and copy its production URL.
2. Set `BACKEND_URL` in the **frontend** Vercel project to that backend URL.
3. Redeploy the **frontend** project.

### Notes

- `frontend/next.config.ts` rewrites `/api/*` to `BACKEND_URL/api/*`.
- `backend/vercel.json` routes all backend requests into the FastAPI app.
- `backend/api/index.py` is the Vercel Python function entrypoint.
- Local Docker and local dev still work; `standalone` output is only used outside Vercel.

## Architecture

```
Local:
User → Next.js (:8654) → rewrite `/api/*` → FastAPI (:8147) → LLM API

Vercel:
User → Frontend Vercel Project → rewrite `/api/*` → Backend Vercel Project → LLM API
```

## Project Structure

```
.
├── backend/
│   ├── api/
│   │   └── index.py            # Vercel Python entry
│   ├── app/
│   │   ├── main.py              # FastAPI entry
│   │   ├── config.py            # Settings (pydantic-settings)
│   │   ├── api/v1/              # API routes
│   │   ├── data/                # Question tags (server-side only)
│   │   ├── services/            # Scoring + LLM services
│   │   └── prompts/             # System prompts
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom hooks (SSE)
│   │   ├── store/               # Zustand state
│   │   ├── data/                # Question data (no scoring tags)
│   │   └── types/               # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── deploy/
│   └── nginx.conf               # Nginx reverse proxy config
├── docker-compose.yml
└── .env.example
```

## License

MIT
