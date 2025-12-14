// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./privateRoutes";
import { Layout } from "@/pages/Layout";
import { PublicRoute } from "./publicRoutes";
import { privateRoutes, publicRoutes } from "./route.config";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      {publicRoutes.map((r) => (
        <Route
          key={r.path}
          path={r.path}
          element={<PublicRoute>{r.element}</PublicRoute>}
        />
      ))}

      {/* PRIVATE */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {privateRoutes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
