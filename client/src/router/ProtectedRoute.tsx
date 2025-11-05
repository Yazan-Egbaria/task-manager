import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading the page for you...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
