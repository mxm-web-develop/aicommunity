# 第一阶段：构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 第二阶段：生产环境
FROM node:18-alpine AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV production

# 只复制必要的文件
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/next.config.js ./next.config.js

# 只安装生产依赖
RUN yarn install --production --frozen-lockfile

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["yarn", "start"]