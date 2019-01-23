module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'index.js',
      exec_interpreter: 'node',
      ignore_watch: ['node_modules'],
      autorestart: true,
      watch: true,
      usePolling: true,
    },
  ],
};
