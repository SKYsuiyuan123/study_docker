import express from "express";

import apiRouter from "./api/api.router.js";

const app = express();

const serverPort = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));

app.use(apiRouter);

const server = app.listen(serverPort, () => {
  console.log(`Server is running at ${serverPort} port ...`);
});

// 优雅关闭：接住 SIGTERM 信号
process.on("SIGTERM", () => {
  console.log("👋 收到优雅停止信号，正在安全关闭...");

  server.close(() => {
    // 这里的 app 是你 listen 返回的实例
    console.log("✅ HTTP 服务已关闭");
    process.exit(0);
  });
});
