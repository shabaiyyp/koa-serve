module.exports = {
  apps: [{
    name: 'guestbook',
    script: './app.js',
    watch: true,
    max_memory_restart: '1G',
    cwd: "./", // 当前工作路径 
    ignore_watch: [
      // 从监控目录中排除 
      "node_modules",
      "logs",
      "public",
      "README.MD"
    ],
    error_file: "./logs/app-err.log", // 错误日志路径 
    out_file: "./logs/app-out.log", // 普通日志路径 
  }],

};
