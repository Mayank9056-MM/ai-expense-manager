import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import Loader from "@/pages/Loader";
import { useAuth } from "@/context/AuthContext";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, initialized } = useAuth();


  console.log(isAuthenticated,"isAuthenticated");
  console.log(loading,"loading");
  console.log(initialized,"initialized");

  if (!initialized || loading) return <Loader />;

  return isAuthenticated ? children : null ;

  // : <Navigate to="/login" replace />;
};
