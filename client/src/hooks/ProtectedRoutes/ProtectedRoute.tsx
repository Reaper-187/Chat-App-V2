import { Spinner } from "@/components/Spinner/Spinner";
import { useAuth } from "@/context/AuthContext";
import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loadingSpinner } = useAuth();

  if (loadingSpinner === "loading") {
    return <Spinner />;
  }
  if (loadingSpinner === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (loadingSpinner === "authenticated") {
    return children;
  }
  return null;
};
