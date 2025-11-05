import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="paddingX myHeight container mx-auto flex items-center justify-center py-16">
        <Outlet />
      </main>
    </div>
  );
}
