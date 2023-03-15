const express = require("express");
const router = express.Router();
const redis = require("../redis");

router.get("/", async (_, res) => {
  const addedTodos = { added_todos: await redis.getAsync("todoCount") };
  res.send(addedTodos);
});

module.exports = router;
