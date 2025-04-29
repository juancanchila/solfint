import { Navigate, Outlet } from "react-router-dom";

const SuperAdminRoute = () => {
  const role = localStorage.getItem("role");
  return role === "Super Admin" ? <Outlet /> : <Navigate to="/home" replace />;
};

export default SuperAdminRoute;
