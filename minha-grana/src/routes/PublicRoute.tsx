import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/generic/Loading";

export default function PublicRoute() {
  const { isAuthenticated, loadingPage } = useAuth();

  if (loadingPage) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
