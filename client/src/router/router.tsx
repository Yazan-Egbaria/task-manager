import { createBrowserRouter, Navigate } from "react-router";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import Homepage from "../pages/Homepage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      {
        path: "/tasks",
        element: (
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        ),
      },
      { path: "/signup", element: <Signup /> },
      { path: "/verify", element: <Verify /> },
      { path: "/login", element: <Login /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
