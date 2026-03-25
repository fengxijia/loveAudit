# Backend Implementation Documentation

> 维护者只看本文档即可了解后端全部实现逻辑，无需阅读源码。

## 目录

- [1. 配置与环境变量](#1-配置与环境变量)
- [2. 应用入口](#2-应用入口)
- [3. 评分服务 (Scoring Service)](#3-评分服务-scoring-service)
- [4. LLM 服务](#4-llm-服务)
- [5. API 端点](#5-api-端点)
- [6. SSE 流式协议](#6-sse-流式协议)
- [7. 系统提示词](#7-系统提示词)
- [8. 应用流程](#8-应用流程)
- [9. 依赖与版本](#9-依赖与版本)
- [10. 部署](#10-部署)
- [11. 错误处理与日志](#11-错误处理与日志)

---

## 1. 配置与环境变量

**文件:** `backend/app/config.py`

使用 `pydantic_settings.BaseSettings` 管理配置，自动从 `.env` 文件加载。

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `API_KEY` | `""` | OpenAI 兼容 API 密钥 |
| `API_ENDPOINT` | `""` | API 端点地址（如 `https://aihubmix.com/v1`） |
| `MODEL` | `"gemini-2.0-flash"` | 使用的 LLM 模型 |
| `DEBUG` | `false` | 为 `true` 时启用 `/docs` 和 `/redoc` Swagger 文档 |
| `CORS_ORIGINS` | `["http://localhost:3147"]` | CORS 允许的源列表（JSON 数组） |

### Settings 类

```python
class Settings(BaseSettings):
    api_title: str = "LoveAudit API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3147"]
```

- `.env` 文件搜索路径：`backend/.env` → `backend/../.env` → `backend/../../.env`
- 使用 `@lru_cache` 实现单例模式（`get_settings()` 函数）

---

## 2. 应用入口

**文件:** `backend/app/main.py`

### FastAPI 实例配置

```python
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)
```

### 中间件

- **CORS:** `allow_origins` 来自 settings，`allow_credentials=True`，`allow_methods=["*"]`，`allow_headers=["*"]`

### 已注册路由

- Assessment 路由：`/api/v1/assessment/*`
- Analysis 路由：`/api/v1/analysis/*`

### 健康检查

- `GET /health` → `{"status": "healthy", "version": "..."}`

---

## 3. 评分服务 (Scoring Service)

**文件:** `backend/app/services/scoring_service.py`

### 3.1 `aggregate_tags(answers) -> Dict[str, float]`

将所有答案的心理标签汇总求和。

- **输入:** `Dict[str, dict]`，每个 answer 含 `value`（选项）和 `tags`（标签-分数映射）
- **输出:** 所有标签的累加总分
- **逻辑:** 遍历所有答案，同名标签分数相加

### 3.2 `compute_risk_score(tags) -> float`

计算风险分数（0-100，越高越危险）。

**风险标签（12 个）：**
`risk`, `danger`, `controlled`, `selfish`, `verbal_abuse`, `gaslighting`, `mental_depressed`, `mental_unstable`, `incompatible`, `immature`, `unbalanced`, `stubborn`

**安全标签（7 个）：**
`safe`, `mature`, `compatible`, `loyal`, `mental_healthy`, `family_healthy`, `secure`

**计算公式：**
```
risk_sum = 所有风险标签分数之和
safe_sum = 所有安全标签分数之和
total = risk_sum + safe_sum

如果 total == 0: 返回 50.0（中性分数）
否则: 返回 round(risk_sum / total * 100, 1)
```

### 3.3 `determine_verdict(risk_score) -> str`

根据风险分数确定判定结果：

| 风险分数 | 判定 | 含义 |
|----------|------|------|
| ≤ 25 | `"angel"` | 安全，高兼容性 |
| 26-55 | `"observe"` | 存在混合信号，需继续观察 |
| > 55 | `"run"` | 高风险，需谨慎 |

### 3.4 `get_personality_weight_adjustments(user_personality, partner_personality) -> Dict[str, float]`

根据性格类型返回标签权重调整系数。用于矫正性格导致的报告偏差。

**调整规则：**

| 用户性格 | 调整标签 | 系数 | 原因 |
|----------|----------|------|------|
| emotional | `anxious`, `mental_anxious` | ×0.7 | 感性用户倾向过度报告焦虑 |
| rational | `controlled` | ×1.3 | 理性用户可能低估控制行为 |
| rational | `verbal_abuse` | ×1.2 | 理性用户可能低估言语伤害 |
| rational + emotional 伴侣 | `incompatible` | ×0.8 | 理性+感性组合的不兼容性可降低 |

### 3.5 `apply_adjustments(tags, adjustments) -> Dict[str, float]`

将性格调整系数应用到标签分数上。

- 对每个需调整的标签，将其分数乘以对应系数
- 结果保留 2 位小数

---

## 4. LLM 服务

**文件:** `backend/app/services/llm_service.py`

### 配置

```python
API_KEY = os.getenv("API_KEY", "")
API_ENDPOINT = os.getenv("API_ENDPOINT", "")
MODEL = os.getenv("MODEL", "gemini-2.0-flash")
PROMPTS_DIR = Path(__file__).parent.parent / "prompts"
```

### LLMService 类

**初始化：**
- 校验 `API_KEY` 非空，否则抛出 `ValueError`
- 创建 `openai.OpenAI` 客户端（兼容模式，支持非 OpenAI 端点）
- 设置 `base_url` 为 `API_ENDPOINT`（如有）

**`stream_analysis()` 方法（异步生成器）：**

```python
async def stream_analysis(
    self,
    answers: Dict[str, dict],
    user_personality: Optional[str],
    partner_personality: Optional[str],
    freeform_text: str,
    tags_summary: Dict[str, float],
    risk_score: float,
    verdict: str,
) -> AsyncGenerator[str, None]:
```

处理流程：
1. 从 `prompts/analysis_system.txt` 加载系统提示词
2. 调用 `_build_prompt()` 构建用户提示词
3. 调用 OpenAI API（`stream=True`，`temperature=0.7`，`timeout=60s`）
4. 逐块 yield 文本内容
5. 异常捕获并记录日志后重新抛出

**`_build_prompt()` 方法：**

构建的提示词结构：
```
## 用户答题数据
题目{qid}: 选择={answer_value}

## 性格类型
用户: {user_personality or "未知"}
伴侣: {partner_personality or "未知"}

## 用户补充说明
{freeform_text}

## 心理标签汇总
- tag1: score1
- tag2: score2

## 初步评估
风险分数: {risk_score}/100
初步判定: {verdict}

请根据以上数据生成完整的分析报告。
```

**单例模式：** `get_llm_service()` 全局函数，懒加载并缓存实例。

---

## 5. API 端点

### 5.1 评估提交

**文件:** `backend/app/api/v1/assessment.py`
**路由:** `POST /api/v1/assessment/submit`

**请求模型：**
```python
class AnswerValue(BaseModel):
    value: str                    # 选项值（如 "A"、"B"）
    tags: Dict[str, float]        # 心理标签及分数

class SubmitRequest(BaseModel):
    answers: Dict[str, AnswerValue]          # 按题目 ID 索引
    userPersonality: Optional[str] = None    # "emotional"、"rational" 等
    partnerPersonality: Optional[str] = None
    freeformText: str = ""                   # 用户补充文字
```

**响应：**
```json
{
  "riskScore": 45.3,
  "verdict": "observe",
  "tagsSummary": { "safe": 1.0, "mature": 0.5, "compatible": 0.64 }
}
```

**处理流程：**
1. 解析 answers 为字典格式
2. `aggregate_tags()` 汇总标签
3. `get_personality_weight_adjustments()` 获取性格调整系数
4. `apply_adjustments()` 应用调整
5. `compute_risk_score()` 计算风险分数
6. `determine_verdict()` 确定判定结果
7. 返回结果

### 5.2 分析流

**文件:** `backend/app/api/v1/analysis.py`
**路由:** `POST /api/v1/analysis/stream`

**请求模型：**
```python
class StreamAnalysisRequest(BaseModel):
    answers: Dict[str, AnswerValue]
    userPersonality: Optional[str] = None
    partnerPersonality: Optional[str] = None
    freeformText: str = ""
```

**响应类型：** `sse_starlette.sse.EventSourceResponse`（Server-Sent Events）

处理流程：
1. 先执行与 assessment/submit 相同的评分逻辑
2. 发送 `start` 事件（含 riskScore 和 verdict）
3. 初始化 LLMService，开始流式生成
4. 逐块发送 `chunk` 事件，同时累积到 buffer
5. 流结束后尝试将 buffer 解析为 JSON
6. 发送 `complete` 事件（含解析后的 JSON 或原始文本）

---

## 6. SSE 流式协议

### 事件类型

**`start`：** 开始事件，含初始评分
```json
{"event": "start", "data": "{\"status\":\"started\",\"riskScore\":45.3,\"verdict\":\"observe\"}"}
```

**`chunk`：** LLM 文本流片段（重复多次）
```json
{"event": "chunk", "data": "{\"content\":\"这段关系中...\"}"}
```

**`complete`：** 完成事件

成功解析 JSON 时：
```json
{"event": "complete", "data": "{\"status\":\"complete\",\"result\":{...JSON对象...}}"}
```

JSON 解析失败时（返回原始文本）：
```json
{"event": "complete", "data": "{\"status\":\"complete\",\"text\":\"...buffer内容...\"}"}
```

**`error`：** 错误事件
```json
{"event": "error", "data": "{\"error\":\"错误信息\"}"}
```

### 超时与错误处理

- **LLM 流超时：** 90 秒硬限制（`time.monotonic()` 计时）
  - 超时时若 buffer 有内容 → 作为 `complete` 事件发送文本
  - 超时时若 buffer 为空 → 发送 `error` 事件
- **LLM 初始化失败：** 发送 `error` 事件（"LLM 服务初始化失败"）
- **JSON 解析：** 尝试解析 buffer，先去除 markdown 代码围栏（\`\`\`json ... \`\`\`），失败则降级为纯文本

---

## 7. 系统提示词

**文件:** `backend/app/prompts/analysis_system.txt`

### 角色设定
"LoveAudit 亲密关系评估系统的分析引擎"

### 核心原则
- 以用户为中心，尊重用户感受
- 保持客观，不替伴侣找借口
- 避免 "你也有问题" 的自我归因文化
- 基于事实分析，不进行人身攻击
- 鼓励自我发展和高自我价值
- 建议心理健康资源（CBT、医院咨询）
- 严重抑郁情况下提供务实的暗黑策略

### 网红名词解构规则

| 网红名词 | 实际含义 |
|----------|----------|
| NPD | 关系中的强势方，冲突中不灵活 |
| 血包 | 弱势方，总是妥协 |
| 三角测量 | 通过第三方制造不安全感 |
| 煤气灯 | 操纵他人对现实的认知 |

### 输出格式（JSON）

```json
{
  "verdict": "angel|observe|run",
  "verdictTitle": "核心结论标题",
  "verdictDescription": "50-100字描述",
  "mentalHealth": {
    "user": "50-150字用户心理分析",
    "partner": "50-150字伴侣心理推测"
  },
  "mythBusters": [
    {
      "buzzword": "网红名词",
      "realMeaning": "真实含义",
      "analysis": "50-100字针对用户的分析"
    }
  ],
  "personaTags": ["标签1", "标签2", "标签3", "标签4"],
  "tips": ["具体可操作建议1", "具体可操作建议2", "具体可操作建议3"]
}
```

**要求：**
- `mythBusters`：至少 2 个网红名词解构
- `tips`：至少 3 条可操作建议
- `personaTags`：4-6 个人格标签（正面如"安全感满格"，负面如"红旗收集者"）

---

## 8. 应用流程

```
1. 用户提交评估表单
   ↓
2. 前端 POST /api/v1/analysis/stream（含全部答案）
   ↓
3. 后端计算：
   - 标签汇总 (aggregate_tags)
   - 性格调整 (personality adjustments)
   - 风险评分 (compute_risk_score)
   - 判定结果 (determine_verdict)
   ↓
4. 后端流式发送 SSE 事件：
   - start（含 risk_score + verdict）
   - chunk（LLM 流式文本）× N
   - complete（含 JSON 结果或文本）
   ↓
5. 前端实时更新 UI
   ↓
6. 前端展示最终结果页：
   - 判定标题与描述
   - 心理健康分析（用户 & 伴侣）
   - 网红名词解构
   - 人格标签
   - 可操作建议
```

---

## 9. 依赖与版本

| 依赖 | 版本要求 | 用途 |
|------|----------|------|
| fastapi | ≥0.115.0 | Web 框架 |
| uvicorn[standard] | ≥0.30.0 | ASGI 服务器 |
| sse-starlette | ≥2.0.0 | Server-Sent Events 支持 |
| openai | ≥1.30.0 | OpenAI 兼容客户端 |
| pydantic-settings | ≥2.0.0 | 配置管理 |
| python-dotenv | ≥1.0.0 | .env 文件加载 |

**Python 版本：** ≥ 3.10

---

## 10. 部署

### Docker Compose

```yaml
# frontend 服务
- 端口: 3147:3000
- 环境: NEXT_PUBLIC_API_URL=http://backend:8147
- 依赖: backend

# backend 服务
- 端口: 8147:8000
- 加载 .env 文件
- 环境: DEBUG=true
```

### 开发运行脚本

**`backend/run.sh`：**
- 切换到脚本所在目录
- 激活虚拟环境
- 运行 `uvicorn app.main:app --host 0.0.0.0 --port 8147 --reload`

---

## 11. 错误处理与日志

- **日志：** 使用 Python 标准 `logging` 模块，每个模块独立 logger
- **LLM 错误：** 捕获后以 `exc_info=True` 记录完整堆栈
- **API 错误：** 返回 JSON 格式错误响应
- **SSE 超时：** 90 秒硬限制
- **配置错误：** FastAPI 通过 Pydantic 模型自动校验

---

## 文件路径索引

| 文件 | 说明 |
|------|------|
| `backend/app/main.py` | 应用入口 |
| `backend/app/config.py` | 配置管理 |
| `backend/app/api/v1/assessment.py` | 评估提交 API |
| `backend/app/api/v1/analysis.py` | 分析流 API |
| `backend/app/services/scoring_service.py` | 评分逻辑 |
| `backend/app/services/llm_service.py` | LLM 服务 |
| `backend/app/prompts/analysis_system.txt` | 系统提示词 |
| `backend/pyproject.toml` | 依赖定义 |
