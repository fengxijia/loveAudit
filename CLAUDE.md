# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Marriage Partner Assessment Platform (结婚对象评估)** — An AI-powered web app that helps users assess marriage partner suitability via a multi-chapter questionnaire and LLM-generated analysis.

## Current Focus
- Developing "LoveAudit" module (Relationship Suitability Assessment).
- Reference: `docs/love_audit_PRD.md` for product logic, `docs/assessment_rules.md` for evaluation rules.
- 题目：`docs/questions.md`

## Development Commands

### Backend (FastAPI + Python)
```bash
cd backend
# Activate venv
source /home/becool1/wd/doro/marriage/backend/.venv/bin/activate
# Install dependencies (uses uv)
uv sync
# Run dev server (port 8147, auto-reload)
uvicorn app.main:app --host 0.0.0.0 --port 8147 --reload
# Or use the script (activates venv automatically):
./run.sh
```

### Frontend (Next.js 16 + React 19)
```bash
cd frontend
npm install
npm run dev      # Dev server (port 8654)
npm run build    # Production build
npm run lint     # ESLint
```

### Running Both
Start backend first (port 8147), then frontend (port 8654). Next.js rewrites `/api/*` to `http://localhost:8147/api/*` (configured in `frontend/next.config.ts`).

## Architecture

```
Browser → Next.js (:8654) → /api/* rewrite → FastAPI (:8147)
```

**Stateless app** — no database, no auth. All state lives client-side in Zustand.

### User Flow
1. **Landing** (`/`) → Start assessment
2. **Assessment** (`/assessment`) → 5-chapter questionnaire (19 questions with hidden psychological tags)
3. **Analyzing** (`/analyzing`) → Submits answers, streams LLM analysis via SSE
4. **Result** (`/result`) → Displays verdict, analysis, myth busters, tips

### Backend (FastAPI)
- **Entry point:** `backend/app/main.py`
- **Config:** `backend/app/config.py` — pydantic-settings loading from root `.env`
- **API routes** (`backend/app/api/v1/`):
  - `POST /api/v1/assessment/submit` — tag aggregation + risk scoring → verdict
  - `POST /api/v1/analysis/stream` — SSE streaming of LLM analysis
- **Services** (`backend/app/services/`):
  - `scoring_service.py` — tag counting, personality adjustments, risk score (0–100), verdict (angel/observe/run)
  - `llm_service.py` — OpenAI-compatible client, streams analysis with system prompt from `prompts/analysis_system.txt`
- **LLM:** Uses OpenAI-compatible API (configured via `API_KEY`, `API_ENDPOINT`, `MODEL` in `.env`)

### Frontend (Next.js)
- **Pages:** `frontend/src/app/{page,assessment,analyzing,result}/`
- **State:** Zustand store at `frontend/src/store/store.ts`
- **SSE hook:** `frontend/src/hooks/useSSE.ts` — custom hook for streaming analysis
- **Question data:** `frontend/src/data/questions.ts` — questions with psychological tags per choice
- **UI:** Tailwind CSS 4 + Radix UI + Framer Motion, dark theme
- **Path alias:** `@/*` → `./src/*`

### Scoring Logic
- Each answer carries hidden tags (e.g., `safe`, `risk`, `gaslighting`, `mature`)
- Risk score = risk_tags / (risk_tags + safe_tags) × 100
- Verdicts: ≤25 → "angel", 26–55 → "observe", >55 → "run"
- Personality type adjustments modify final score

### SSE Stream Protocol
Events from `/api/v1/analysis/stream`:
- `start` — contains initial risk score
- `chunk` — streaming text pieces
- `complete` — final structured JSON (verdict, mentalHealth, mythBusters, tips, personaTags)
- `error` — error message

## Key Config
- `.env` at project root — API keys, model selection, CORS origins, debug flag
- `frontend/next.config.ts` — API rewrite proxy
- `docker-compose.yml` — container setup (frontend :3147, backend :8147)

## Dev Environment (tmux)

All services run in a single tmux session `marriage` with two windows:
- `marriage:backend` (window 0) — FastAPI on `:8147`
- `marriage:frontend` (window 1) — Next.js on `:8654`
- `marriage`的window 2：是claude code常驻的窗口，不要动

**Rules:**
- Always reuse this existing tmux session. Never create additional sessions or windows.
- To start/restart a service: `tmux send-keys -t marriage:backend C-c` then send the start command.
- To check logs: `tmux capture-pane -t marriage:backend -p | tail -30` (or `marriage:frontend`).
- Backend venv: `source /home/becool1/wd/doro/marriage/backend/.venv/bin/activate`

## Documentation Maintenance

项目维护三份文档，**每次新增或修改功能时必须同步更新对应文档**：

| 文档 | 定位 | 更新时机 |
|------|------|----------|
| `docs/frontend_doc.md` | 前端实现细节（看文档不看代码即可理解逻辑） | 修改前端代码时 |
| `docs/backend_doc.md` | 后端实现细节（看文档不看代码即可理解逻辑） | 修改后端代码时 |
| `README.md` | High-level 概览（features、运行方式、架构） | 新增大功能或架构变更时 |

**规则：**
- `frontend_doc.md` / `backend_doc.md`：记录实现逻辑、函数签名、数据流、算法细节、组件 props 与行为等，使维护者**只看文档不看代码**就能理解全部实现。
- `README.md`：只放 features、tech stack、架构图、quick start、项目结构等 high-level 信息，**不放具体实现细节**。
- 新增页面/组件/API/服务时，在对应文档中添加完整说明。
- 修改现有功能时，更新文档中对应的描述，确保文档与代码一致。

@README.md
@docs/backend_doc.md
@docs/frontend_doc.md