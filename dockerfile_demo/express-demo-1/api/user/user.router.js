import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  console.log("req.query: ", req.query);

  res.json({ user: "all" });
});

export default userRouter;
