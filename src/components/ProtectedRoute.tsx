import { Navigate, useLocation } from "react-router-dom";
import { useCaja } from "../context/CajaContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiresClosed?: boolean; // true = solo si caja cerrada, false o undefined = solo si abierta
}

export default function ProtectedRoute({
  children,
  requiresClosed = false,
}: ProtectedRouteProps) {
  const { caja } = useCaja();
  const location = useLocation();

  // Caso 1: La ruta requiere caja CERRADA (ej: página de Abrir Caja)
  if (requiresClosed && caja.abierta) {
    // Ya está abierta → redirige al dashboard o transferencias
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  // Caso 2: La ruta requiere caja ABIERTA (la mayoría de las páginas)
  if (!requiresClosed && !caja.abierta) {
    // Aún no abierta → redirige a la página de abrir caja
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Todo bien → permite acceso
  return <>{children}</>;
}