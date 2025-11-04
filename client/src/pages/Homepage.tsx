import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";

const Homepage = () => {
  const { user, loading } = useAuth();

  const username = user?.email?.split("@")[0] || "Guest";
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);

  if (loading) {
    return <div className="flex items-center justify-center">Loading..</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-sm md:text-base lg:text-lg">
        Hello there,{" "}
        <span className="font-bold">{displayName || "Guest"}!</span>
      </h1>

      {user ? (
        <Link
          to="/tasks"
          className="cursor-pointer rounded border border-black bg-black px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black md:text-base"
        >
          View Your Tasks
        </Link>
      ) : (
        <Link
          to="/login"
          className="cursor-pointer rounded border border-black bg-black px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black md:text-base"
        >
          Please log in to view your tasks
        </Link>
      )}
    </div>
  );
};

export default Homepage;
