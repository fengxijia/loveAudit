#!/bin/bash
# 服务器初始化脚本 — 在新服务器上运行一次
set -e

echo "=== 1. 更新系统 ==="
sudo apt update && sudo apt upgrade -y

echo "=== 2. 安装 Docker ==="
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "Docker 已安装，请重新登录 SSH 使 docker 组生效，然后重新运行此脚本"
    exit 0
fi

echo "=== 3. 安装 Nginx ==="
sudo apt install -y nginx

echo "=== 4. 安装 Git ==="
sudo apt install -y git

echo "=== 5. 克隆项目 ==="
if [ ! -d /opt/marriage ]; then
    sudo mkdir -p /opt/marriage
    sudo chown $USER:$USER /opt/marriage
    git clone https://github.com/你的用户名/marriage.git /opt/marriage
else
    echo "项目目录已存在，跳过克隆"
fi

echo "=== 6. 配置 Nginx ==="
sudo cp /opt/marriage/deploy/nginx.conf /etc/nginx/sites-available/auditlove.com
sudo ln -sf /etc/nginx/sites-available/auditlove.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=== 初始化完成 ==="
echo "接下来："
echo "  1. cd /opt/marriage"
echo "  2. 创建 .env 文件（复制 .env.example 并填入你的 API 密钥）"
echo "  3. docker compose up -d --build"
echo "  4. 打开 http://auditlove.com 验证"
