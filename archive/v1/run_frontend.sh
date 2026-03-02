#!/bin/zsh

# 结婚对象评估 - 前端启动脚本

source ~/.zshrc

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 加载环境变量
set -a
source .env
set +a

# 杀掉已占用的端口
lsof -ti:3050 | xargs kill -9 2>/dev/null

echo "启动前端 Web (端口 3050)..."
cd frontend
npm run dev -- -p 3050
