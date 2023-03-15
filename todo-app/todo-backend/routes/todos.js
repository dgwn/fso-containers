const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  });
  if (res.statusCode === 200) {
    const redisCount = await redis.getAsync("todoCount");
    const countIncremented = redisCount ? Number(redisCount) + 1 : 1;
    await redis.setAsync("todoCount", countIncremented);
  }
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  const todo = req.todo;
  res.send(todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const todo = req.todo;
  const updatedTodo = await Todo.findOneAndUpdate(
    { id: req.params.id },
    { text: req.body.text }
  );

  res.status(200).json({
    status: "success"
  });
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
