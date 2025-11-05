import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import type { ColumnId, Task } from "../components/tasksPage/types";
import TaskColumn from "../components/tasksPage/TaskColumn";
import TaskModal from "../components/tasksPage/TaskModal";

const STATUS_COLUMNS = [
  { id: "todo" as const, label: "To Do", color: "bg-blue-500" },
  { id: "in-progress" as const, label: "In Progress", color: "bg-yellow-500" },
  { id: "completed" as const, label: "Completed", color: "bg-green-500" },
];

const PRIORITY_CONFIG: Record<Task["priority"], { bg: string; text: string }> =
  {
    high: { bg: "bg-rose-100", text: "text-rose-700" },
    medium: { bg: "bg-amber-100", text: "text-amber-700" },
    low: { bg: "bg-slate-100", text: "text-slate-700" },
  };

const STATUS_LABELS: Record<Task["status"], string> = {
  todo: "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};

export default function Tasks() {
  // form/modal state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [editStatus, setEditStatus] = useState<Task["status"]>("todo");

  // items
  const [items, setItems] = useState<Task[]>([]);
  const itemsRef = useRef<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ui
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ColumnId>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // drag
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);

  async function load() {
    try {
      const res = await api.get("/tasks");
      setItems(res.data.items);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, {
          title,
          description: description.trim() || undefined,
          priority,
          status: editStatus,
        });
        toast.success("Task updated successfully");
      } else {
        await api.post("/tasks", {
          title,
          description: description.trim() || undefined,
          status: selectedStatus,
          priority,
        });
        toast.success("Task added successfully");
      }

      setTitle("");
      setDescription("");
      setPriority("medium");
      setEditStatus("todo");
      setShowModal(false);
      setEditingTask(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save task");
    }
  }

  async function updateStatus(id: string, newStatus: ColumnId) {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      toast.success("Task updated successfully");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  }

  async function remove(id: string) {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setEditStatus(task.status);
    setShowModal(true);
  }

  function openAddModal(status: ColumnId) {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setSelectedStatus(status);
    setEditStatus("todo");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setEditStatus("todo");
  }

  // Drag & Drop (with highlight)
  function handleCardDragStart(task: Task) {
    setDraggedTask(task);
  }
  function handleDragOver(e: React.DragEvent, colId: ColumnId) {
    e.preventDefault();
    setDragOverColumn(colId);
  }
  function handleDragEnter(e: React.DragEvent, colId: ColumnId) {
    e.preventDefault();
    setDragOverColumn(colId);
  }
  function handleDragLeave(_e: React.DragEvent, colId: ColumnId) {
    if (dragOverColumn === colId) setDragOverColumn(null);
  }
  function handleDrop(e: React.DragEvent, newStatus: ColumnId) {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateStatus(draggedTask._id, newStatus);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  }
  function handleCardDragEnd() {
    setDraggedTask(null);
    setDragOverColumn(null);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const getTasksByStatus = (status: ColumnId) =>
    items.filter((task) => task.status === status);

  if (isLoading) {
    return (
      <div className="myHeight flex items-center justify-center">
        <h1 className="text-xl">Loading your tasks...</h1>
      </div>
    );
  }

  return (
    <div className="myHeight w-full overflow-x-auto bg-gray-50">
      <div className="mx-auto">
        <div className="flex gap-4" style={{ minWidth: "1200px" }}>
          {STATUS_COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              column={col}
              tasks={getTasksByStatus(col.id)}
              isActiveDrop={dragOverColumn === col.id}
              priorityConfig={PRIORITY_CONFIG}
              statusLabels={STATUS_LABELS}
              onAdd={openAddModal}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
              onEditCard={openEditModal}
              onDeleteCard={remove}
              draggedTaskId={draggedTask?._id || null}
            />
          ))}
        </div>
      </div>

      <TaskModal
        show={showModal}
        isEditing={!!editingTask}
        title={title}
        description={description}
        priority={priority}
        editStatus={editStatus}
        onClose={closeModal}
        onSubmit={handleSubmit}
        setTitle={setTitle}
        setDescription={setDescription}
        setPriority={setPriority}
        setEditStatus={setEditStatus}
      />
    </div>
  );
}
