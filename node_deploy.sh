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
echo "🛠️ 生成控制脚本..."
cat > ./deploy/control.sh << 'EOL'
#!/bin/bash

# 默认端口
DEFAULT_PORT=3000

case "$1" in
  start)
    # ... existing code ...
    ;;
  stop)
    STOPPED_SOMETHING=false
    
    if [ -f "server.pid" ]; then
      PID=$(cat server.pid)
      echo "🛑 尝试停止服务 (PID: $PID)"
      
      # 检查PID是否真的存在
      if ps -p $PID > /dev/null; then
        # 先尝试正常终止
        kill $PID 2>/dev/null || true
        sleep 2
        
        # 强制终止如果仍在运行
        if ps -p $PID > /dev/null; then
          echo "进程未响应，使用强制终止..."
          kill -9 $PID 2>/dev/null || true
          sleep 1
        fi
        
        # 检查是否成功终止
        if ! ps -p $PID > /dev/null; then
          echo "✅ 进程 $PID 已成功停止"
          STOPPED_SOMETHING=true
        else
          echo "❌ 无法停止进程 $PID"
        fi
      else
        echo "⚠️ PID文件包含无效进程ID：$PID（进程不存在）"
      fi
      rm -f server.pid
    else
      echo "📝 没有找到PID文件，尝试根据端口停止服务..."
    fi
    
    # 清理端口3000进程
    PORT_PIDS=$(lsof -ti:$DEFAULT_PORT 2>/dev/null)
    if [ -n "$PORT_PIDS" ]; then
      echo "🔍 检测到端口 $DEFAULT_PORT 上的进程："
      for pid in $PORT_PIDS; do
        echo " - 进程 $pid: $(ps -p $pid -o comm= 2>/dev/null || echo '未知')"
        kill -9 $pid 2>/dev/null
        echo "🚫 已终止进程 $pid"
        STOPPED_SOMETHING=true
      done
      
      # 再次检查端口是否释放
      sleep 1
      if [ -z "$(lsof -ti:$DEFAULT_PORT 2>/dev/null)" ]; then
        echo "✅ 端口 $DEFAULT_PORT 已释放"
      else
        echo "⚠️ 无法完全释放端口 $DEFAULT_PORT"
      fi
    fi
    
    # 最终状态报告
    if [ "$STOPPED_SOMETHING" = false ]; then
      echo "🔍 未发现任何运行中的服务进程"
    fi
    ;;
  status)
    # ... existing code ...
    ;;
  restart)
    echo "重启服务..."
    $0 stop
    sleep 2
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