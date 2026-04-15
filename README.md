# [LoveAudit — 终身伴侣适配度评估系统](https://auditlove.com)

TA真的适合和你携手一生吗？

你是否会因伴侣提起前任而难过？

你是否被伴侣与异性的交往边界困扰？

你是否处在一段将就的关系中，不忍离开又看不到未来？

你是否被NPD、三角测量等网红概念捆绑 越来越焦虑？

如果你也有以上困扰 试试我的测评！（用过都说好～
我将协助你分析当前的恋爱关系 以及你在关系中的真实状态。
随测评附赠**免费（敲重点）**关系测评报告 包括TA和你的婚姻匹配程度 你们的关系更接近哪一种模式

以及可执行的相处建议！

还有可截图分享的关系标签卡～

（敲黑板）完全匿名！无需注册！无数据库，所有数据仅存于你的浏览器本地！

快趁我还没开始收费试试看吧！

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
