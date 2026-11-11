import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import SpinnerFullPage from "./SpinnerFullPage";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <SpinnerFullPage />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}
