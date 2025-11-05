export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
};

export type ColumnId = "todo" | "in-progress" | "completed";
