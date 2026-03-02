#!/bin/zsh

# 结婚对象评估 - 后端启动脚本

source ~/.zshrc

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 加载环境变量
set -a
source .env
set +a

# 杀掉已占用的端口
lsof -ti:8765 | xargs kill -9 2>/dev/null

echo "启动后端 API (端口 8765)..."
cd backend
conda activate llm-wd
uvicorn app.main:app --host 0.0.0.0 --port 8765
