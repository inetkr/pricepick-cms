module.exports = {
  apps: [
    {
      name: "ponhub-cms-dev-6001",
      script: "node_modules/.bin/next",
      args: "start -p 6001",
      cwd: "/home/sindykorea/pricepick/pricepick-cms",
      exec_mode: "cluster",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: { NODE_ENV: "production" },
    },
  ],
};