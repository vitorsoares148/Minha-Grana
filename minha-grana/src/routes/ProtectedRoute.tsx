import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/generic/Loading";

export default function ProtectedRoute() {
  const { isAuthenticated, loadingPage } = useAuth();
  const location = useLocation();

  if (loadingPage) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
