import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await logout();
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  const username = user?.email?.split("@")[0] || "Guest";
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  const menuResponsiveBtns = user ? "justify-between" : "";

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="border-b border-gray-300 bg-gray-50">
      <div className="paddingX container mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold"
          onClick={() => setIsMenuOpen(false)}
        >
          Task Manager
        </Link>

        {user && (
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${isActive ? "opacity-100" : ""} hidden text-sm opacity-50 transition-all duration-300 hover:opacity-100 md:flex`
            }
          >
            Tasks
          </NavLink>
        )}

        {/* Desktop Menu */}
        {user ? (
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-gray-600">Hello, {displayName}</span>
            <button
              onClick={handleLogout}
              disabled={isSubmitting}
              className={`rounded bg-red-400 px-3 py-1 text-sm text-white transition enabled:cursor-pointer enabled:hover:bg-red-500 ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isSubmitting ? "Logging Out..." : "Logout"}
            </button>
          </div>
        ) : (
          <nav className="hidden gap-3 text-sm md:flex">
            <Link to="/signup" className="hover:underline">
              Sign up
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </nav>
        )}

        {/* Mobile Burger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer focus:outline-none md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            // X icon
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute z-50 min-h-screen w-full border-t border-gray-300 bg-white md:hidden">
          <div
            className={`myHeight flex flex-col ${menuResponsiveBtns} gap-4 p-4`}
          >
            <div>
              {user && (
                <NavLink
                  to="/tasks"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full cursor-pointer rounded border border-black bg-black px-3 py-2 text-sm text-white transition hover:bg-white hover:text-black`}
                >
                  Tasks
                </NavLink>
              )}
            </div>

            <div>
              {user ? (
                <>
                  <div className="mb-2 text-sm text-gray-600">
                    Hello, {displayName}
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isSubmitting}
                    className={`w-full rounded bg-red-400 px-3 py-2 text-sm text-white transition hover:bg-red-500 enabled:cursor-pointer ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {isSubmitting ? "Logging Out..." : "Logout"}
                  </button>
                </>
              ) : (
                <nav className="flex flex-col gap-3 text-sm">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full cursor-pointer rounded border border-black bg-black px-3 py-2 text-sm text-white transition hover:bg-white hover:text-black"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full cursor-pointer rounded border border-black bg-black px-3 py-2 text-sm text-white transition hover:bg-white hover:text-black"
                  >
                    Sign up
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
