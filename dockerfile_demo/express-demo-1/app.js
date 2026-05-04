import express from "express";

import apiRouter from "./api/api.router.js";

const app = express();

const serverPort = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ urlencoded: true }));

app.use(apiRouter);

app.listen(serverPort, () => {
  console.log(`Server is running at ${serverPort} port ...`);
});
