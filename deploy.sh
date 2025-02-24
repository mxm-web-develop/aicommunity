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

# 确保 PM2 已安装
if ! command -v pm2 &> /dev/null; then
    error "PM2 未安装，请先安装 PM2: npm install -g pm2"
    exit 1
fi

# 停止现有应用
log "停止现有应用..."
pm2 stop aicommunity || true
pm2 delete aicommunity || true

# 修改清理旧文件的逻辑（增加存在性检查）
log "清理旧文件..."
if [ -d "deploy" ]; then
    rm -rf deploy
    log "已删除旧部署目录"
else
    log "未找到旧部署目录，跳过清理"
fi

# 构建应用
log "开始构建应用..."
yarn build

# 在创建目录前添加校验（关键修复）
log "创建目录结构..."
if ! mkdir -p deploy/{.next,public,src/static/img,src/static/json,logs}; then
    error "创建部署目录失败"
    exit 1
fi

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

# 复制环境变量和配置文件
log "复制配置文件..."
if [ -f ".env.production" ]; then
    cp .env.production deploy/.env.production
else
    error ".env.production 文件不存在"
    exit 1
fi

# 复制 PM2 配置文件
cp ecosystem.config.js deploy/
log "当前工作目录: $PWD"
log "部署目录路径: $DEPLOY_PATH"
# 修改进入部署目录的逻辑
log "进入部署目录..."
DEPLOY_PATH="$PWD/deploy"
if [ ! -d "$DEPLOY_PATH" ]; then
    error "部署目录 $DEPLOY_PATH 不存在"
    exit 1
fi
cd "$DEPLOY_PATH" || {
    error "无法进入部署目录"
    exit 1
}

# 修改权限设置部分（使用绝对路径）
log "设置文件权限..."
chown -R $(whoami) "$DEPLOY_PATH"
chmod -R 755 "$DEPLOY_PATH"

# 修改 PM2 启动命令（使用绝对路径）
log "使用 PM2 启动应用..."
pm2 start "$DEPLOY_PATH/ecosystem.config.js"

# 保存 PM2 进程列表
log "保存 PM2 进程列表..."
pm2 save

# 部署完成后清理并重置开发环境权限
log "重置开发环境权限..."
chown -R $(whoami) .next/
chmod -R 755 .next/

log "部署完成！"

# 显示一些有用的信息
echo -e "\n${GREEN}部署信息:${NC}"
echo "- 部署目录: $(pwd)"
echo "- PM2 状态: $(pm2 status aicommunity)"
echo "- 环境变量: .env.production"
echo "- 日志文件: ./logs/out.log 和 ./logs/err.log"
echo -e "\n${GREEN}常用命令:${NC}"
echo "- 查看日志: pm2 logs aicommunity"
echo "- 重启应用: pm2 restart aicommunity"
echo "- 停止应用: pm2 stop aicommunity"
echo "- 删除应用: pm2 delete aicommunity"

log "进入部署目录..."
cd "$DEPLOY_PATH" || {
    error "无法进入部署目录"
    exit 1
}

log "当前验证路径: $PWD"
log "目录内容:"
ls -l

# 修改验证逻辑（使用当前目录路径）
log "验证部署完整性..."
if [ ! -f "server.js" ]; then
    error "关键文件 server.js 缺失（当前目录: $PWD）"
    ls -l  # 显示目录内容帮助调试
    exit 1
fi