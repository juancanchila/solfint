import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import "./Login.css";
import reactLogo from "../../assets/react.svg";

function RecoverPassword() {
  const AUTHOR = "Juan López";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecover = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthService.recoverPassword(email);
      console.log("Respuesta de recoverPassword:", response); // 👈 AQUÍ

      if (response === true) {
        alert("Código enviado a tu teléfono.");

        localStorage.setItem('isreset', true);
        navigate("/send-code");
      } else {
        alert("El usuario no existe.");
      }
    } catch (error) {
      console.log("Error al recuperar contraseña:", error);
      alert("Ocurrió un error al procesar la solicitud.");
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
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleRecover}>
          <div className="input-group">
            <label htmlFor="email">Correo Registrado</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Procesando..." : "Enviar código"}
          </button>
        </form>
      </div>

      <footer className="footer">
        <p>&copy; 2025 MUTO Digital. Elaborado por {AUTHOR}</p>
      </footer>
    </div>
  );
}

export default RecoverPassword;
