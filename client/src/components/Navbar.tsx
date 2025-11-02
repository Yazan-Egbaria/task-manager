import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const username = user?.email?.split("@")[0] || "Guest";
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <Link to="/tasks" className="text-lg font-semibold">
          Task Manager
        </Link>

        {loading ? (
          ""
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hello, {displayName}</span>
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded border border-black bg-black px-3 py-1 text-sm text-white transition hover:bg-white hover:text-black"
            >
              Logout
            </button>
          </div>
        ) : (
          <nav className="flex gap-3 text-sm">
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Login</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
