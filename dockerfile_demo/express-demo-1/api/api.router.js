import express from "express";

import userRouter from "./user/user.router.js";

const apiRouter = express.Router();

apiRouter.get("/", (_req, res) => {
  const node_env = process.env.NODE_ENV || "develop";

  res.send(`Hello My Dockerfile Express demo 1, Env: ${node_env}`);
});

apiRouter.use("/user", userRouter);

export default apiRouter;
