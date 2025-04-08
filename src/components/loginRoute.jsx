import { Navigate, Outlet } from 'react-router-dom';

const VerifiedRoute = () => {
  const isVerified = localStorage.getItem('isVerified') === 'true';

  // Si está verificado, redirige a home, si no, deja seguir
  return !isVerified ? <Outlet /> : <Navigate to="/home" replace />;
};

export default VerifiedRoute;
