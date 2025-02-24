module.exports = {
    apps: [
      {
        name: 'aicommunity',
        script: '.next/standalone/server.js',  // 注意这里改成 standalone 的入口文件
        instances: 1,
        // exec_mode: 'cluster',
        exec_mode: 'fork',     // 改为 fork 模式
        env: {
          PORT: 80,           // 直接绑定80端口
          NODE_ENV: 'production',
        },
        exp_backoff_restart_delay: 100,
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
      }
    ]
  };