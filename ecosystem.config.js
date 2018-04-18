module.exports = {
  apps : [
    {
      name      : 'mastodon-bot',
      script    : 'dist/index.js',
      exec_mode : 'cluster',
      instances : 1,
      env : {
        NODE_ENV: 'production'
      }
    },
  ],
};
