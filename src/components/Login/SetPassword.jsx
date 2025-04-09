import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import UserService from "../../services/userService"; // 👈 importar aquí
import "./Login.css";
import reactLogo from "../../assets/react.svg";

function SetPassword() {
  const AUTHOR = "Juan López";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("Datos de recuperación no válidos.");
      }

      const updatedUser = await UserService.updateUser(userId, { password });

      if (updatedUser) {
        alert("Contraseña actualizada con éxito. Inicia sesión nuevamente.");
        AuthService.logout();
        navigate("/login");
      } else {
        alert("No se pudo actualizar la contraseña. Intenta más tarde.");
      }
    } catch (error) {
      console.error("Error al establecer la contraseña:", error.message);
      alert(error.message || "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={reactLogo} alt="React Logo" className="logo" />
      </div>

      <div className="login-box">
        <h2>Establecer Nueva Contraseña</h2>
        <form onSubmit={handleSetPassword}>
          <div className="input-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
            />
            <small>Usa una combinación de letras, números y símbolos para mayor seguridad.</small>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Procesando..." : "Guardar Contraseña"}
          </button>
        </form>
      </div>

      <footer className="footer">
        <p>&copy; 2025 MUTO Digital. Elaborado por {AUTHOR}</p>
      </footer>
    </div>
  );
}

export default SetPassword;
