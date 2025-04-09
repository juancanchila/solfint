import { Navigate, Outlet } from "react-router-dom";

const ResetRoute = () => {
  const isReset = localStorage.getItem("isreset") === "true";

  // Si isreset es true, redirige a /set-password, si no, deja pasar
  return isReset ? <Navigate to="/set-password" replace /> : <Outlet />;
};

export default ResetRoute;
