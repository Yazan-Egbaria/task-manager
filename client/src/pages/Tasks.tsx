import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { api } from "../lib/api";
import { toast } from "react-toastify";

type Task = {
  _id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
};

export default function Tasks() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "new");
  const [total, setTotal] = useState(0);

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  async function load(
    searchTerm: string,
    currentPage: number,
    sortOrder: string,
  ) {
    try {
      const res = await api.get("/tasks", {
        params: { search: searchTerm, page: currentPage, sort: sortOrder },
      });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post("/tasks", { title });
      setTitle("");
      toast.success("Task added successfully");
      setPage(1);
      load(search, 1, sort);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add task");
    }
  }

  async function toggle(id: string, done: boolean) {
    try {
      await api.put(`/tasks/${id}`, { done: !done });
      toast.success("Task toggled successfully");
      load(search, page, sort);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  }

  async function remove(id: string) {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      load(search, page, sort);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  }

  function goToPage(newPage: number) {
    setPage(newPage);
    load(search, newPage, sort);
  }

  useEffect(() => {
    const params: any = {};
    if (search) params.search = search;
    if (page > 1) params.page = String(page);
    if (sort !== "new") params.sort = sort;
    setSearchParams(params);

    load(search, page, sort);
  }, [search, page, sort]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex flex-col-reverse gap-4 md:flex-row-reverse">
        <div className="flex gap-2">
          <input
            className="w-full rounded border p-2 text-sm"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded border p-2 text-sm"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </div>

        <form onSubmit={add} className="flex flex-1 gap-2">
          <input
            className="flex-1 rounded border p-2 text-sm"
            placeholder="New Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="cursor-pointer rounded border border-black bg-black px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black">
            Add
          </button>
        </form>
      </div>
      {isLoading ? (
        <h1 className="mx-auto text-center text-sm">Loading your tasks</h1>
      ) : (
        <>
          <ul className="divide-y rounded border bg-white">
            {items.map((t) => (
              <li key={t._id} className="flex items-center gap-3 p-3">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t._id, t.done)}
                  className="accent-green-400"
                />
                <div
                  className={`flex-1 ${t.done ? "text-gray-400 line-through" : ""}`}
                >
                  <div className="text-sm font-medium capitalize">
                    {t.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => remove(t._id)}
                  className="cursor-pointer text-sm text-red-400 hover:text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
            {items.length === 0 && (
              <li className="p-4 text-center text-sm text-gray-500">
                No tasks yet.
              </li>
            )}
          </ul>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="cursor-pointer rounded border border-black bg-black px-3 py-1 text-white transition-all duration-300 hover:enabled:bg-white hover:enabled:text-black disabled:cursor-not-allowed disabled:opacity-20"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="cursor-pointer rounded border border-black bg-black px-3 py-1 text-white transition hover:enabled:bg-white hover:enabled:text-black disabled:cursor-not-allowed disabled:opacity-20"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
