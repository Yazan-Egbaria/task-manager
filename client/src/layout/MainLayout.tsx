import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <main className="paddingX myHeight mx-auto flex items-center justify-center py-16">
        <Outlet />
      </main>
    </div>
  );
}
