// src/components/SplashScreen.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import reactLogo from '../../assets/react.svg';
import './SplashScreen.css';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer); // Limpiar el timer al desmontar el componente
  }, [navigate]);

  return (
    <div className="splash-screen">
      <img src={reactLogo} className="logo react" alt="React logo" />
    </div>
  );
}

export default SplashScreen;
