import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import reactLogo from '../../../assets/react.svg';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navega hacia atrás
  };

  return (
    <nav className={`navbar ${isSidebarOpen ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <img src={reactLogo} alt="React Logo" className="logo" />
        <span>Mi Aplicación</span>
      </div>

      <div className="navbar-actions">

      <Tooltip title="Regresar" >
          <IconButton onClick={handleBack} color="inherit">
            <ArrowBackIosNewIcon className="back" />
          </IconButton>
        </Tooltip>
        <button className="menu-btn" onClick={toggleSidebar}>
          &#9776;
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
