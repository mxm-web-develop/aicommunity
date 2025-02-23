module.exports = {
    apps: [
      {
        name: 'aicommunity',
        script: '.next/standalone/server.js',  // 注意这里改成 standalone 的入口文件
        instances: 1,
        exec_mode: 'cluster',
        env: {
          PORT: 3000,
          NODE_ENV: 'production',
        },
        exp_backoff_restart_delay: 100,
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
      }
    ]
  };