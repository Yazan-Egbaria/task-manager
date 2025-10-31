import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, default: null },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1, createdAt: -1 });
TaskSchema.index({ userId: 1, title: "text", description: "text" });

export default mongoose.model("Task", TaskSchema);
