import type { Task } from "./types";

type Props = {
  show: boolean;
  isEditing: boolean;
  title: string;
  description: string;
  priority: Task["priority"];
  editStatus: Task["status"];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setPriority: (v: Task["priority"]) => void;
  setEditStatus: (v: Task["status"]) => void;
};

export default function TaskModal({
  show,
  isEditing,
  title,
  description,
  priority,
  editStatus,
  onClose,
  onSubmit,
  setTitle,
  setDescription,
  setPriority,
  setEditStatus,
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          {isEditing ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full rounded border p-3"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              className="w-full rounded border p-3"
              placeholder="Enter task description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full cursor-pointer rounded border p-3"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {isEditing && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full cursor-pointer rounded border p-3"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as Task["status"])
                }
                required
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded border border-black bg-black px-4 py-2 text-white transition duration-300 hover:bg-white hover:text-black"
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded border px-4 py-2 transition duration-300 hover:border-black hover:bg-black hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
