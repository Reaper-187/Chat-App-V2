import { Spinner } from "@/components/Spinner/Spinner";
import { useAuth } from "@/context/AuthContext";

import { type PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

type PublicRouteProps = PropsWithChildren;

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { loadingSpinner } = useAuth();
  console.log("loadingSpinner", loadingSpinner);

  if (loadingSpinner === "loading") {
    return <Spinner />;
  }
  if (loadingSpinner === "authenticated") {
    return <Navigate to="/chat" replace />;
  }
  if (loadingSpinner === "unauthenticated") {
    return children;
  }
  return null;
};
