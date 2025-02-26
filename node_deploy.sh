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
cat > ./deploy/path-fix.js << 'EOL'
const fs = require('fs');
const path = require('path');

// 读取 server.js
const serverPath = path.join(__dirname, 'deploy', 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

// 修改路径引用，确保指向正确的 .next 目录
content = content.replace(/path:\s*['"](.+?)['"]/g, `path: require('path').join(__dirname, '.next')`);

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
    echo "启动服务..."
    # 加载环境变量
    if [ -f ".env" ]; then
      source .env
    fi
    
    # 使用环境变量中的PORT，如果未设置则使用默认值
    PORT=${PORT:-$DEFAULT_PORT}
    echo "使用端口: $PORT"
    
    # 显式设置环境变量
    export PORT=$PORT
    export NODE_ENV=production
    
    echo "检查目录结构..."
    if [ ! -f ".next/server/next-font-manifest.json" ]; then
      echo "⚠️ 警告: 未找到字体清单文件，尝试从原始构建目录复制..."
      mkdir -p .next/server
      cp -f ../.next/server/next-font-manifest.json .next/server/ 2>/dev/null || echo "❌ 复制失败"
    fi
    
    echo "启动服务器..."
    nohup node server.js > error.log 2>&1 &
    echo $! > server.pid
    echo "✅ 服务已启动 (PID: $(cat server.pid)) 在端口 $PORT"
    echo "请等待几秒钟后访问: http://localhost:$PORT"
    ;;
  stop)
    if [ -f "server.pid" ]; then
      echo "🛑 停止服务 (PID: $(cat server.pid))"
      kill $(cat server.pid)
      rm server.pid
      echo "服务已停止"
    else
      echo "ℹ️ 未找到运行中的服务"
    fi
    ;;
  *)
    echo "用法: $0 {start|stop}"
    exit 1
esac
EOL

chmod +x ./deploy/control.sh


# 清理临时环境文件
rm -f .env.local

# 完成提示
echo -e "\n✅ 部署完成"
echo -e "运行以下命令管理服务："
echo -e "启动服务:   cd deploy && ./control.sh start"
echo -e "停止服务:   cd deploy && ./control.sh stop"
echo -e "查看日志:   tail -f deploy/error.log"

# 自动启动提示
read -p "是否立即启动服务？ (y/N) " start_now
if [[ "$(echo "$start_now" | tr '[:upper:]' '[:lower:]')" == "y" || "$(echo "$start_now" | tr '[:upper:]' '[:lower:]')" == "yes" ]]; then
  cd deploy
  ./control.sh start
  cd ..
fi