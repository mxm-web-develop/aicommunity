#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# 错误处理
set -e
trap 'error "部署失败，请检查错误信息"' ERR

# 开始部署
log "开始部署流程..."

# 检查是否有 root 权限（如果要使用 80 端口需要）
if [ "$EUID" -ne 0 ]; then 
    error "需要 root 权限来使用 80 端口"
    error "请使用 sudo ./ndeploy.sh 运行"
    exit 1
fi

# 停止现有进程
if [ -f deploy/pid.txt ]; then
    log "停止现有进程..."
    kill $(cat deploy/pid.txt) || true
    rm deploy/pid.txt
fi

# 清理旧的部署文件
log "清理旧文件..."
rm -rf deploy

# 构建应用
log "开始构建应用..."
yarn build

# 创建目录结构
log "创建目录结构..."
mkdir -p deploy/.next
mkdir -p deploy/public
mkdir -p deploy/src/static/img
mkdir -p deploy/src/static/json

# 复制文件
log "复制构建文件..."
cp -r .next/standalone/* deploy/
cp -r .next/* deploy/.next/

log "复制静态资源..."
# 复制 public 目录
if [ -d "public" ]; then
    cp -r public/* deploy/public/
else
    error "public 目录不存在"
fi

# 复制静态资源
if [ -d "src/static" ]; then
    cp -r src/static/* deploy/src/static/
else
    log "src/static 目录不存在，跳过"
fi

# 复制环境变量
log "复制环境变量文件..."
if [ -f ".env.production" ]; then
    cp .env.production deploy/.env.production
else
    error ".env.production 文件不存在"
    exit 1
fi

# 进入部署目录
log "进入部署目录..."
cd deploy

# 启动应用
log "启动应用..."
if [ -f "server.js" ]; then
    # 设置 PORT 环境变量并后台运行
    PORT=80 node server.js & echo $! > pid.txt
    log "应用已启动，PID: $(cat pid.txt)"
    log "可以通过 'tail -f deploy/output.log' 查看日志"

    # 启动进程监控
    log "启动进程监控..."
    (
        while true; do
            if ! ps -p $! > /dev/null; then
                error "检测到进程崩溃，尝试重启..."
                PORT=80 node --max-old-space-size=2048 server.js & 
                PID=$!
                echo $PID > pid.txt
                sleep 5
            fi
            sleep 10
        done
    ) &
    MONITOR_PID=$!
    echo $MONITOR_PID > monitor_pid.txt
else
    error "server.js 不存在，部署失败"
    exit 1
fi

log "部署完成！"

# 显示一些有用的信息
echo -e "\n${GREEN}部署信息:${NC}"
echo "- 部署目录: $(pwd)"
echo "- 进程 PID: $(cat pid.txt)"
echo "- 环境变量: .env.production"
echo "- 启动命令: PORT=80 node server.js"
echo "- 访问地址: http://localhost"
echo -e "\n${GREEN}如需停止服务:${NC}"
echo "kill \$(cat pid.txt)"