module.exports = {
    apps: [
      {
        name: 'aicommunity', // 应用名称
        script: 'node_modules/next/dist/bin/next', // Next.js 启动脚本
        args: 'start', // 运行参数
        instances: "max", // 实例数量，可以设置为 'max' 使用全部 CPU
        exec_mode: 'cluster', // 执行模式
        watch: false, // 是否监听文件变化
        env: {
          PORT: 3000, // 运行端口
          NODE_ENV: 'production',
        },
        exp_backoff_restart_delay: 100, // 重启延迟
      },
    ],
  };