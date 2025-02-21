#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 日志函数（改名为 logger）
logger() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error_log() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# 错误处理
set -e
trap 'error_log "部署失败，请检查错误信息"' ERR

# 开始部署
logger "开始部署流程..."

# 检查是否有 root 权限（如果要使用 80 端口需要）
if [ "$EUID" -ne 0 ]; then 
    error_log "需要 root 权限来使用 80 端口"
    error_log "请使用 sudo ./odeploy.sh 运行"
    exit 1
fi

# 停止现有进程
if [ -f deploy/pid.txt ]; then
    logger "停止现有进程..."
    kill $(cat deploy/pid.txt) || true
    rm deploy/pid.txt
fi

# 清理旧的部署文件
logger "清理旧文件..."
rm -rf deploy

# 构建应用
logger "开始构建应用..."
yarn build

# 创建目录结构
logger "创建目录结构..."
mkdir -p deploy/.next
mkdir -p deploy/public
mkdir -p deploy/src/static/img
mkdir -p deploy/src/static/json

# 复制文件
logger "复制构建文件..."
# 首先确保目标目录存在
mkdir -p deploy/.next

# 复制整个 .next 目录的内容
cp -r .next/* deploy/.next/

# 复制 standalone 内容到根目录
if [ -d ".next/standalone" ]; then
    cp -r .next/standalone/* deploy/
fi

# 确保 build-id 文件存在
if [ ! -f "deploy/.next/BUILD_ID" ]; then
    error_log "找不到 BUILD_ID 文件，构建可能不完整"
    exit 1
fi

# 检查关键文件
logger "检查必要文件..."
if [ ! -f "deploy/server.js" ]; then
    error_log "server.js 不存在，部署失败"
    exit 1
fi

if [ ! -d "deploy/.next/static" ]; then
    error_log ".next/static 目录不存在，部署失败"
    exit 1
fi

logger "复制静态资源..."
# 复制 public 目录
if [ -d "public" ]; then
    cp -r public/* deploy/public/
else
    error_log "public 目录不存在"
fi

# 复制静态资源
if [ -d "src/static" ]; then
    cp -r src/static/* deploy/src/static/
else
    logger "src/static 目录不存在，跳过"
fi

# 复制环境变量
logger "复制环境变量文件..."
if [ -f ".env.production" ]; then
    cp .env.production deploy/.env.production
else
    error_log ".env.production 文件不存在"
    exit 1
fi

# 在启动应用之前添加环境变量配置
logger "配置环境变量..."
cat >> deploy/.env.production << EOF
NEXT_PUBLIC_API_URL=http://your-api-url
NODE_ENV=production
EOF

# 进入部署目录
logger "进入部署目录..."
cd deploy

# 启动应用
logger "启动应用..."
if [ -f "server.js" ]; then
    # 明确设置环境变量
    export NODE_ENV=production
    export PORT=80
    export HOST=0.0.0.0
    export DEBUG=*
    
    # 使用环境变量启动服务
    nohup env PORT=80 HOST=0.0.0.0 node server.js > output.log 2>&1 & 
    
    # 保存PID
    echo $! > pid.txt
    
    # 等待几秒确保进程正常启动
    sleep 3
    
    # 检查进程是否真的在运行
    if ps -p $(cat pid.txt) > /dev/null; then
        logger "应用已成功启动，PID: $(cat pid.txt)"
        logger "日志文件: $(pwd)/output.log"
        
        # 验证端口
        netstat -tlnp | grep $(cat pid.txt)
    else
        error_log "应用启动失败，请检查日志文件"
        exit 1
    fi
else
    error_log "server.js 不存在，部署失败"
    exit 1
fi

# 创建一个简单的管理脚本
cat > manage.sh << 'EOF'
#!/bin/bash
case "$1" in
    start)
        if [ -f pid.txt ] && ps -p $(cat pid.txt) > /dev/null; then
            echo "服务已在运行中，PID: $(cat pid.txt)"
        else
            export PORT=80
            export HOST=0.0.0.0
            export NODE_ENV=production
            nohup node server.js > output.log 2>&1 &
            echo $! > pid.txt
            echo "服务已启动，PID: $(cat pid.txt)"
        fi
        ;;
    stop)
        if [ -f pid.txt ]; then
            kill $(cat pid.txt)
            rm pid.txt
            echo "服务已停止"
        else
            echo "找不到PID文件"
        fi
        ;;
    restart)
        if [ -f pid.txt ]; then
            kill $(cat pid.txt)
            rm pid.txt
        fi
        nohup NODE_ENV=production PORT=80 HOST=0.0.0.0 node server.js > output.log 2>&1 &
        echo $! > pid.txt
        echo "服务已重启，新PID: $(cat pid.txt)"
        ;;
    status)
        if [ -f pid.txt ] && ps -p $(cat pid.txt) > /dev/null; then
            echo "服务正在运行，PID: $(cat pid.txt)"
        else
            echo "服务未运行"
        fi
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
EOF

chmod +x manage.sh

logger "部署完成！"

# 显示管理信息
echo -e "\n${GREEN}部署信息:${NC}"
echo "- 部署目录: $(pwd)"
echo "- 进程 PID: $(cat pid.txt)"
echo "- 环境变量: .env.production"
echo "- 日志文件: $(pwd)/output.log"
echo "- 访问地址: http://localhost"
echo -e "\n${GREEN}管理命令:${NC}"
echo "cd $(pwd)"
echo "./manage.sh start   # 启动服务"
echo "./manage.sh stop    # 停止服务"
echo "./manage.sh restart # 重启服务"
echo "./manage.sh status  # 查看状态"
echo -e "\n${GREEN}查看日志:${NC}"
echo "tail -f output.log"