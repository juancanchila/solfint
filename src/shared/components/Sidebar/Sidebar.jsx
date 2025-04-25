import React from "react";
import "./Sidebar.css";
import { AuthService } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import Swal from "sweetalert2";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId"); // 👈 obtenemos userId

  const isAdmin = userRole === "Admin" || userRole === "Super Admin";

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Seguro que deseas cerrar sesión en este dispositivo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        AuthService.logout();
        Swal.fire(
          "Sesión cerrada",
          "Has cerrado sesión correctamente.",
          "success"
        );
        navigate("/login");
      }
    });
  };

  const handleProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`); // 👈 vamos a /profile/{id}
    } else {
      navigate("/profile"); // fallback por si no está
    }
  };

  const handleHome = () => {
    navigate("/home");
  };

  const  handleTranslte = () => {
    navigate("/translate");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        X
      </button>
      <ul className="sidebar-links">
        <li>
          <button onClick={handleHome} className="logout-btn">
            Inicio
          </button>
        </li>
        <li>
          <button onClick={handleProfile} className="logout-btn">
            Perfil
          </button>
        </li>

        {isAdmin && (
          <li className="sidebar-item-with-submenu">
            <button className="logout-btn dropdown-toggle">
              Configuraciones <FaChevronDown />
            </button>
            <ul className="sidebar-submenu always-open">
              <li>
                <button
                  onClick={() => navigate("/users")}
                  className="logout-btn"
                >
                  Gestión de Usuarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/clients")}
                  className="logout-btn"
                >
                  Gestión de Clientes
                </button>
              </li>
            </ul>
          </li>
        )}


        {isAdmin && (
          <li className="sidebar-item-with-submenu">
            <button className="logout-btn dropdown-toggle">
              Exámenes <FaChevronDown />
            </button>
            <ul className="sidebar-submenu always-open">
              <li>
                <button
                  onClick={() => navigate("/exams")}
                  className="logout-btn"
                >
                  Completados
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/home")}
                  className="logout-btn"
                >
                 Preparados
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/subjets")}
                  className="logout-btn"
                >
                  Evaluados
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/catalog")}
                  className="logout-btn"
                >
                  Catálogo
                </button>
              </li>
            </ul>
          </li>
        )}
        {isAdmin && (
          <li className="sidebar-item-with-submenu">
            <button className="logout-btn dropdown-toggle">
              Auditoria <FaChevronDown />
            </button>
            <ul className="sidebar-submenu always-open">
              <li>
                <button
                  onClick={() => navigate("/users")}
                  className="logout-btn"
                >
                  Logs
                </button>
              </li>
            </ul>
          </li>
        )}


<li>
          <button onClick={handleTranslte} className="logout-btn">
          Traducciones
          </button>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Salir
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
