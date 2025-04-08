// src/routes/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from '../services/authService';
import Spinner from '../shared/components/Spinner/Spinner';

const PrivateRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await AuthService.validateToken();
      if (!valid) {
        AuthService.logout(); // 🔐 Limpia el token si no es válido
      }
      setIsAuthorized(valid);
      setIsValidating(false);
    };

    checkAuth();
  }, []);

  if (isValidating) {
    return <Spinner size={120} message="Verificando acceso..." />;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
