import { Navigate } from "react-router-dom";

import type { JSX } from "react";
import Loader from "@/pages/Loader";
import { useAuth } from "@/context/AuthContext";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, initialized } = useAuth();

  if (!initialized || loading) return <Loader />;
  // if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};


