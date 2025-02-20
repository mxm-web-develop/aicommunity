#!/bin/bash

echo "开始部署..."

# 停止现有进程
if [ -f deploy/pid.txt ]; then
  kill $(cat deploy/pid.txt) || true
fi

# 清理旧的部署文件
rm -rf deploy

# 构建应用
yarn build

# 创建部署目录
mkdir -p deploy
mkdir -p deploy/.next

# 复制 standalone 文件
cp -r .next/standalone/* deploy/

# 复制完整的 .next 目录（包括所有构建文件）
cp -r .next/* deploy/.next/

# 复制 public 目录
cp -r public deploy/

echo "文件复制完成，开始启动服务..."

# 进入部署目录
cd deploy

# 启动服务
node server.js