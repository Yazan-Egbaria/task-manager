import type { Task } from "./types";

type Props = {
  task: Task;
  priorityConfig: Record<Task["priority"], { bg: string; text: string }>;
  statusLabels: Record<Task["status"], string>;
  dragged?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
};

export default function TaskCard({
  task,
  priorityConfig,
  statusLabels,
  dragged,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: Props) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      className={`cursor-grab rounded-lg bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${
        dragged ? "opacity-50" : ""
      }`}
    >
      {/* Priority Badge */}
      <div className="mb-2">
        <span
          className={`inline-block rounded-full px-2 py-1 text-[10px] font-medium uppercase ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text}`}
        >
          {task.priority} PRIORITY
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 font-medium text-gray-800">{task.title}</h3>

      {/* Description */}
      {task.description && (
        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
          {task.description}
        </p>
      )}

      {/* Date */}
      <p className="mb-3 text-xs text-gray-500">
        {new Date(task.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <span
          className={`text-xs ${
            task.status === "completed"
              ? "text-green-600"
              : task.status === "in-progress"
                ? "text-yellow-500"
                : "text-gray-500"
          }`}
        >
          {statusLabels[task.status]}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="cursor-pointer text-xs text-red-400 transition hover:text-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
