import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { type Roles } from "@/types/Auth";
import type { RootState } from "@/store";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: Roles[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
