import { useEffect, useRef, useState } from "react";
import TaskCard from "./TaskCard";
import type { ColumnId, Task } from "./types";

const PAGE_SIZE = 10;

type ColumnConfig = { id: ColumnId; label: string; color: string };

type Props = {
  column: ColumnConfig;
  tasks: Task[];
  isActiveDrop: boolean;
  priorityConfig: Record<Task["priority"], { bg: string; text: string }>;
  statusLabels: Record<Task["status"], string>;
  onAdd: (status: ColumnId) => void;
  // DnD handlers from parent
  onDragOver: (e: React.DragEvent, colId: ColumnId) => void;
  onDragEnter: (e: React.DragEvent, colId: ColumnId) => void;
  onDragLeave: (e: React.DragEvent, colId: ColumnId) => void;
  onDrop: (e: React.DragEvent, colId: ColumnId) => void;
  onCardDragStart: (task: Task) => void;
  onCardDragEnd: () => void;
  onEditCard: (task: Task) => void;
  onDeleteCard: (id: string) => void;
  draggedTaskId?: string | null;
};

export default function TaskColumn({
  column,
  tasks,
  isActiveDrop,
  priorityConfig,
  statusLabels,
  onAdd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onCardDragStart,
  onCardDragEnd,
  onEditCard,
  onDeleteCard,
  draggedTaskId,
}: Props) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [tasks]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          setVisible((prev) => Math.min(prev + PAGE_SIZE, tasks.length));
        });
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [tasks.length]);

  const showMore = visible < tasks.length;
  const renderList = tasks.slice(0, visible);

  return (
    <div
      className="flex-1"
      onDragOver={(e) => onDragOver(e, column.id)}
      onDragEnter={(e) => onDragEnter(e, column.id)}
      onDragLeave={(e) => onDragLeave(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${column.color}`} />
          <h2 className="font-semibold text-gray-700">{column.label}</h2>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAdd(column.id)}
          className="cursor-pointer text-gray-400 transition hover:text-gray-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div
        className={`space-y-3 rounded-md p-1 transition ${
          isActiveDrop ? "bg-indigo-50/60 ring-2 ring-indigo-400" : ""
        }`}
      >
        {renderList.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            priorityConfig={priorityConfig}
            statusLabels={statusLabels}
            dragged={draggedTaskId === task._id}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
          />
        ))}

        {tasks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-400">No tasks</p>
          </div>
        )}

        <div ref={sentinelRef} className="grid place-items-center py-3">
          {showMore ? (
            <span className="text-xs text-gray-400">Loading more…</span>
          ) : (
            <span className="sr-only">End of column</span>
          )}
        </div>
      </div>
    </div>
  );
}
