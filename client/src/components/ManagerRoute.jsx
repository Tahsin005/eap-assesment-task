import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/slices/authSlice";

export default function ManagerRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
