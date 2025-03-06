# 设置环境并构建
export NODE_ENV="${environment}"
echo "🔧 构建模式: $NODE_ENV"
echo "🚀 开始构建 Next.js 应用..."



# 询问部署环境
read -p "请选择部署环境 (dev/prod): " env_input
# 使用更兼容的方式转换为小写
environment=$(echo "$env_input" | tr '[:upper:]' '[:lower:]')
if [[ "$environment" != "dev" && "$environment" != "prod" ]]; then
  echo "错误：无效的环境选择，请输入 'dev' 或 'prod'"
  exit 1
fi

echo "🔄 开始部署 $environment 环境..."
echo "🧹 清理旧构建缓存..."
rm -rf .next
# 映射环境名称到环境文件名
if [[ "$environment" == "dev" ]]; then
  env_file=".env.development"
elif [[ "$environment" == "prod" ]]; then
  env_file=".env.production"
fi

# 检查环境文件是否存在
if [ ! -f "$env_file" ]; then
  echo "⚠️ 错误: 未找到环境文件 $env_file"
  exit 1
fi

echo "📄 使用环境文件: $env_file"

# 复制环境文件到.env.local以供构建使用
cp "$env_file" .env.local
echo "📄 已复制环境文件到 .env.local 用于构建"

# 清理部署目录
echo "🧹 清理部署目录..."
rm -rf ./deploy
mkdir -p ./deploy

# 停止现有服务
echo "🛑 停止现有服务..."
pids=$(lsof -t -i :3000 -s TCP:LISTEN)
if [ -n "$pids" ]; then
  echo "发现运行中的服务进程: $pids"
  kill $pids
  sleep 2
  echo "已终止进程"
else
  echo "未发现运行中的服务"
fi

# 设置环境并构建
export NODE_ENV="${environment}"
echo "🔧 构建模式: $NODE_ENV"
echo "🚀 开始构建 Next.js 应用..."

if ! npx next build; then
  echo "❌ 构建失败，请检查错误信息"
  exit 1
fi

# 复制部署文件
echo "📂 准备部署文件..."

# 完全清理部署目录
rm -rf ./deploy
mkdir -p ./deploy

# 1. 复制整个构建输出的 .next 目录（保持完整结构）
cp -r ./.next ./deploy/

# 2. 复制 standalone 内容到根目录 
cp -r ./.next/standalone/* ./deploy/

# 3. 复制公共资源
cp -r ./public ./deploy/

# 4. 确保 server.js 的路径配置正确
cat > ./path-fix.js << 'EOL'
const fs = require('fs');
const path = require('path');

// 读取 server.js
const serverPath = path.join(__dirname, 'deploy', 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// 修改路径引用，确保指向正确的 .next 目录
content = content.replace(/\.next/g, `../.next`);

// 写回文件
fs.writeFileSync(serverPath, content);
console.log('✅ server.js 路径已修复');
EOL

# 运行路径修复脚本
node path-fix.js || echo "❌ 路径修复失败，请手动检查 server.js"

# 复制环境文件到部署目录
echo "📄 复制环境文件到部署目录: $env_file -> .env"
cp "$env_file" ./deploy/.env

# 创建控制脚本
# 创建更可靠的控制脚本
cat > ./deploy/control.sh << 'EOL'
#!/bin/bash

# 默认端口
DEFAULT_PORT=3000
MAX_KILL_ATTEMPTS=3

# 检查端口占用的函数
check_port_usage() {
  lsof -ti:$DEFAULT_PORT 2>/dev/null || netstat -tunlp 2>/dev/null | grep ":$DEFAULT_PORT " | awk '{print $7}' | cut -d'/' -f1
}

case "$1" in
  start)
    echo "启动服务..."
    # 加载环境变量
    if [ -f ".env" ]; then
      set -a
      source .env
      set +a
    fi
    
    # 先检查是否已有服务运行
    RUNNING_PIDS=$(check_port_usage)
    if [ -n "$RUNNING_PIDS" ]; then
      echo "⚠️ 端口 $DEFAULT_PORT 已被占用，请先停止现有服务: ./control.sh stop"
      exit 1
    fi
    
    # 使用环境变量中的PORT，如果未设置则使用默认值
    PORT=${PORT:-$DEFAULT_PORT}
    echo "使用端口: $PORT"
    
    # 确保日志目录存在
    mkdir -p logs
    
    echo "检查目录结构..."
    if [ ! -f ".next/server/next-font-manifest.json" ]; then
      echo "⚠️ 警告: 未找到字体清单文件，尝试从原始构建目录复制..."
      mkdir -p .next/server
      cp -f ../.next/server/next-font-manifest.json .next/server/ 2>/dev/null || echo "❌ 复制失败"
    fi
    
    echo "启动服务器..."
    # 改进日志记录方式，分离错误和标准输出
    nohup node server.js > logs/server.log 2> logs/error.log &
    NEW_PID=$!
    echo $NEW_PID > server.pid
    echo "✅ 服务已启动 (PID: $NEW_PID) 在端口 $PORT"
    echo "请等待几秒钟后访问: http://localhost:$PORT"
    echo "标准输出日志: logs/server.log"
    echo "错误日志: logs/error.log"
    ;;
    
  stop)
    echo "🛑 停止运行中的服务..."
    
    # 1. 使用PID文件尝试停止
    if [ -f "server.pid" ]; then
      PID=$(cat server.pid)
      echo "📋 PID文件显示服务运行在进程 $PID"
      
      if ps -p $PID > /dev/null 2>&1; then
        echo "🔍 进程 $PID 正在运行，尝试终止..."
        kill $PID 2>/dev/null || kill -9 $PID 2>/dev/null
        sleep 2
        if ! ps -p $PID > /dev/null 2>&1; then
          echo "✅ 成功终止进程 $PID"
        else
          echo "⚠️ 无法终止进程 $PID，尝试强制终止..."
          kill -9 $PID 2>/dev/null
          sleep 1
        fi
      else
        echo "⚠️ PID文件中的进程 $PID 不存在"
      fi
      rm -f server.pid
    else
      echo "⚠️ 未找到PID文件"
    fi
    
    # 2. 根据端口检测并终止进程
    echo "🔍 检查端口 $DEFAULT_PORT 上运行的进程..."
    PORT_PIDS=$(check_port_usage)
    
    if [ -n "$PORT_PIDS" ]; then
      echo "⚠️ 发现端口 $DEFAULT_PORT 上仍有进程运行: $PORT_PIDS"
      
      for attempt in $(seq 1 $MAX_KILL_ATTEMPTS); do
        echo "🔄 尝试终止进程，第 $attempt 次..."
        
        for pid in $PORT_PIDS; do
          echo "终止进程 $pid..."
          # 尝试使用常规终止信号
          kill $pid 2>/dev/null || true
        done
        
        sleep 2
        
        # 检查是否还有进程
        PORT_PIDS=$(check_port_usage)
        if [ -z "$PORT_PIDS" ]; then
          echo "✅ 所有进程已终止，端口 $DEFAULT_PORT 已释放"
          break
        fi
        
        # 最后一次尝试使用强制终止
        if [ "$attempt" -eq "$MAX_KILL_ATTEMPTS" ]; then
          echo "⚠️ 常规终止失败，使用强制终止 (SIGKILL)..."
          for pid in $PORT_PIDS; do
            echo "强制终止进程 $pid..."
            kill -9 $pid 2>/dev/null || true
          done
          sleep 1
        fi
      done
      
      # 最终检查
      PORT_PIDS=$(check_port_usage)
      if [ -n "$PORT_PIDS" ]; then
        echo "❌ 无法释放端口 $DEFAULT_PORT，可能需要手动处理以下进程: $PORT_PIDS"
        echo "可以尝试: sudo kill -9 $PORT_PIDS"
      else
        echo "✅ 成功释放端口 $DEFAULT_PORT"
      fi
    else
      echo "✅ 端口 $DEFAULT_PORT 上没有运行中的进程"
    fi
    ;;
    
  status)
    echo "🔍 检查服务状态..."
    
    # 检查PID文件
    if [ -f "server.pid" ]; then
      PID=$(cat server.pid)
      if ps -p $PID > /dev/null 2>&1; then
        echo "✅ 服务进程 (PID: $PID) 正在运行"
        ps -f -p $PID
      else
        echo "⚠️ PID文件存在，但进程 $PID 未运行"
      fi
    else
      echo "⚠️ 未找到PID文件"
    fi
    
    # 检查端口
    PORT_PIDS=$(check_port_usage)
    if [ -n "$PORT_PIDS" ]; then
      echo "✅ 端口 $DEFAULT_PORT 上有服务运行，进程ID: $PORT_PIDS"
      for pid in $PORT_PIDS; do
        echo "进程 $pid 详情:"
        ps -f -p $pid 2>/dev/null || echo "无法获取进程详情"
        
        # 获取进程启动命令
        cmd=$(ps -p $pid -o command= 2>/dev/null || echo "未知")
        echo "命令: $cmd"
      done
    else
      echo "⚠️ 端口 $DEFAULT_PORT 上没有服务运行"
    fi
    
    # 检查日志
    echo "📊 日志状态:"
    if [ -f "logs/server.log" ]; then
      echo "服务日志最后10行:"
      tail -n 10 logs/server.log
    fi
    
    if [ -f "logs/error.log" ]; then
      echo "错误日志最后10行:"
      tail -n 10 logs/error.log
    fi
    ;;
    
  restart)
    echo "🔄 重启服务..."
    $0 stop
    sleep 3
    $0 start
    ;;
    
  *)
    echo "用法: $0 {start|stop|status|restart}"
    exit 1
esac
EOL

chmod +x ./deploy/control.sh
# 添加环境变量调试信息（移到这里确保创建）
echo "🔍 添加环境变量调试脚本..."
cat > ./deploy/check-env.sh << 'EOL'
#!/bin/bash
echo "环境文件内容:"
cat .env

echo -e "\n当前进程环境变量:"
env | sort

echo -e "\n测试加载环境变量:"
set -a
source .env
set +a
echo "PORT = $PORT"
echo "NODE_ENV = $NODE_ENV"
EOL
chmod +x ./deploy/check-env.sh

# 清理临时环境文件
rm -f .env.local

# 完成提示
echo -e "\n✅ 部署完成"
echo -e "运行以下命令管理服务："
echo -e "启动服务:   cd deploy && ./control.sh start"
echo -e "停止服务:   cd deploy && ./control.sh stop"
echo -e "重启服务:   cd deploy && ./control.sh restart"
echo -e "查看状态:   cd deploy && ./control.sh status"
echo -e "调试环境:   cd deploy && ./check-env.sh"
echo -e "查看标准日志: tail -f deploy/logs/server.log"
echo -e "查看错误日志: tail -f deploy/logs/error.log"

# 自动启动提示
read -p "是否立即启动服务？ (y/N) " start_now
if [[ "$(echo "$start_now" | tr '[:upper:]' '[:lower:]')" == "y" || "$(echo "$start_now" | tr '[:upper:]' '[:lower:]')" == "yes" ]]; then
  cd deploy
  ./control.sh start
  cd ..
fi

# 添加环境变量调试信息
echo "🔍 添加环境变量调试脚本..."
cat > ./deploy/check-env.sh << 'EOL'
#!/bin/bash
echo "环境文件内容:"
cat .env

echo -e "\n当前进程环境变量:"
env | sort

echo -e "\n测试加载环境变量:"
set -a
source .env
set +a
echo "PORT = $PORT"
echo "NODE_ENV = $NODE_ENV"
EOL
chmod +x ./deploy/check-env.sh

echo -e "调试环境:   cd deploy && ./check-env.sh"
echo -e "查看标准日志: tail -f deploy/logs/server.log"
echo -e "查看错误日志: tail -f deploy/logs/error.log"