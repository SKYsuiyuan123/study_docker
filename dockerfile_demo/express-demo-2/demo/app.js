const express = require("express");

const app = express();

const port = process.env.SERVER_PORT;

app.get("/", (req, res) => {
  console.log(req.query);

  res.json({ value: "Hello Express Dockerfile" });
});

app.get("/env", (_req, res) => {
  res.json({ value: process.env });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}...`);
});
