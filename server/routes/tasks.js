import { Router } from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middlewear/auth.js";

const router = Router();
router.use(requireAuth);

// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      userId: req.user.id,
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "todo",
      priority: priority || "medium",
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// List tasks
router.get("/", async (req, res) => {
  try {
    const { status, priority } = req.query;

    const filter = { userId: req.user.id };

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }

    const items = await Task.find(filter).sort({ createdAt: -1 });

    res.json({ items, total: items.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to load tasks" });
  }
});

// Get task by id
router.get("/:id", async (req, res) => {
  try {
    const t = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!t) return res.status(404).json({ message: "Task not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: "Failed to load task" });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const t = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!t) return res.status(404).json({ message: "Task not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const result = await Task.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
