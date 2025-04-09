// src/routes/PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Necesitas instalar con: npm install jwt-decode
import { AuthService } from '../services/authService';
import Spinner from '../shared/components/Spinner/Spinner';

const PrivateRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = AuthService.getToken(); // Supón que esta función retorna el token actual
      if (!token) {
        setIsAuthorized(false);
        setIsValidating(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // en segundos
        const remainingTime = decoded.exp - currentTime;

        if (remainingTime < 15 * 60) {
          // Si queda menos de 15 minutos, asumimos que es un token temporal
          throw new Error('Token temporal o expirado');
        }

        const valid = await AuthService.validateToken(); // Opcional: validación en backend
        setIsAuthorized(valid);
      } catch (err) {
        console.warn('Token inválido o temporal:', err.message);
        AuthService.logout();
        setIsAuthorized(false);
      }

      setIsValidating(false);
    };

    checkAuth();
  }, []);

  if (isValidating) {
    return <Spinner size={120} message="Verificando acceso..." />;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/send-code" replace />;
};

export default PrivateRoute;
