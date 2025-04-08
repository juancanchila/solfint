import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import "./Login.css";
import reactLogo from "../../assets/react.svg";

function Login() {
  const AUTHOR = "Juan López";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await AuthService.login(username, password);

      if (user.token) {
        alert(user.message);

        if (!user.isVerified) {
          navigate("/send-code");
        } else {
          navigate("/home");
        }
      } else {
        alert("Error: Token no recibido");
      }
    } catch (error) {
      alert(error.message);
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
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      <footer className="footer">
        <p>&copy; 2025 MUTO Digital. Elaborado por {AUTHOR}</p>
      </footer>
    </div>
  );
}

export default Login;
