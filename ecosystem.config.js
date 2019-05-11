module.exports = {
  apps: [
    {
      name: 'frontend',
      cmd: 'npm',
      args: 'run serve',
      cwd: 'client/',
      ignore_watch: ['node_modules'],
    },
    {
      name: 'backend',
      script: 'server/src/index.js',
      exec_interpreter: 'node',
      ignore_watch: ['node_modules'],
      autorestart: true,
      watch: ['server'],
      usePolling: true,
    },
  ],
};
