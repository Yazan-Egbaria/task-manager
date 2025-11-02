import { createBrowserRouter, Navigate } from "react-router";
import Signup from "../pages/Signup";
import Verify from "../pages/Verify";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/signup", element: <Signup /> },
      { path: "/verify", element: <Verify /> },
      { path: "/login", element: <Login /> },

      {
        path: "/tasks",
        element: (
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
