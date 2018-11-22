/* eslint-disable camelcase,max-len,strict */
module.exports = {
  apps: [{
    name: 'client',
    cwd: './client',
    script: 'npm',
    args: 'run serve',
    instances: 1,
    autorestart: true,
    watch: false
  }, {
    name: 'server',
    cwd: './server',
    script: 'npm',
    args: 'run dev',
    instances: 1,
    autorestart: true,
    watch: true
  }],
};
