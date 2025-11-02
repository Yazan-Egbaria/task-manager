import { Router } from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middlewear/auth.js";

const router = Router();
router.use(requireAuth);

// Create task
router.post("/", async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id });
  res.status(201).json(task);
});

// List tasks
router.get("/", async (req, res) => {
  const { page = 1, search = "", sort = "new" } = req.query;
  const pageSize = 10;

  const filter = { userId: req.user.id };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortObj = sort === "old" ? { createdAt: 1 } : { createdAt: -1 };

  const items = await Task.find(filter)
    .sort(sortObj)
    .skip((+page - 1) * pageSize)
    .limit(pageSize);

  const total = await Task.countDocuments(filter);

  res.json({ items, total, page: +page, pageSize });
});

// Get task by id
router.get("/:id", async (req, res) => {
  const t = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json(t);
});

// Update task
router.put("/:id", async (req, res) => {
  const t = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json(t);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.status(204).end();
});

export default router;
