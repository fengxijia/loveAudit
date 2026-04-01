# LoveAudit — 亲密关系深度解码系统

AI 驱动的婚恋对象评估平台。通过多章节心理问卷 + 最前沿的大模型分析，帮助用户理性评估亲密关系。

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
| Deployment | Docker Compose, Nginx, Cloudflare |

## Quick Start

### Environment Variables

Create `.env` in the project root (see `.env.example`):

```env
API_KEY=sk-your-api-key
API_ENDPOINT=https://your-openai-compatible-endpoint/v1
MODEL=your-preferred-model
CORS_ORIGINS=["https://your-domain.com"]
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

## Architecture

```
User → Cloudflare (HTTPS + CDN) → Nginx → Next.js (:3147)
                                       ↘ FastAPI (:8147) → LLM API
```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry
│   │   ├── config.py            # Settings (pydantic-settings)
│   │   ├── api/v1/              # API routes
│   │   ├── data/                # Question tags (server-side only)
│   │   ├── services/            # Scoring + LLM services
│   │   └── prompts/             # System prompts
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom hooks (SSE)
│   │   ├── store/               # Zustand state
│   │   ├── data/                # Question data (no scoring tags)
│   │   └── types/               # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── deploy/
│   └── nginx.conf               # Nginx reverse proxy config
├── docker-compose.yml
└── .env.example
```

## License

MIT
