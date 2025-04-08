import { Navigate, Outlet } from 'react-router-dom';

const RoleRoute = () => {
  const role = localStorage.getItem('role');
console.log(role);
  const isAdmin = role === 'admin' || role === 'Super Admin';

  return isAdmin ? <Outlet /> : <Navigate to="/home" replace />;
};

export default RoleRoute;
