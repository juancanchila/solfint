import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "../../shared/components/Layout/Layout";
import UserService from "../../services/userService";
import "./Profile.css";
import UserPIc from "../../assets/user.svg";

import ErrorService from '../../services/errorService';
function Profile() {
  const { userId: userIdParam } = useParams();
  const [user, setUser] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const userId = userIdParam || localStorage.getItem("userId");

    if (!userId || isNaN(Number(userId))) {
      setRedirectToLogin(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await UserService.getUserById(userId);
        setUser(userData);
      } catch (error) {

        console.error("Error al obtener el perfil:", error);
        ErrorService.handle(error);
        setRedirectToLogin(true);
      }
    };

    fetchUser();
  }, [userIdParam]);

  if (redirectToLogin) return <Navigate to="/login" />;

  return (

    <Layout>
  <h1>Información de Perfil</h1>
      <p>Esta es la información de la cuenta registrada en el sistema.</p>

      {!user ? (
        <p>Cargando perfil...</p>
      ) : (
        <div className="card">
          <h2>Información del Usuario</h2>
          <div className="info-grid-excel">
            <div className="info-header">ID</div>
            <div className="info-value">{user.id}</div>
            <div className="info-header">Usuario</div>
            <div className="info-value">{user.username}</div>
            <div className="info-header">Email</div>
            <div className="info-value">{user.email}</div>
            <div className="info-header">Nombre completo</div>
            <div className="info-value">{user.fullName || "—"}</div>
            <div className="info-header">Teléfono</div>
            <div className="info-value">{user.phone || "—"}</div>
            <div className="info-header">WhatsApp</div>
            <div className="info-value">{user.whatsapp || "—"}</div>
                         <div className="info-header">Identidad Validada</div>
            <div className="info-value">
              {user.isIdentityValidated ? "Sí" : "No"}
            </div>
          </div>

          {user.client && (
            <>
              <h2>Datos del Cliente</h2>
              <div className="info-grid-excel">
                <div className="info-header">ID Cliente</div>
                <div className="info-value">{user.client.id}</div>
                <div className="info-header">Nombre</div>
                <div className="info-value">{user.client.name}</div>
                <div className="info-header">Email</div>
                <div className="info-value">{user.client.email || "—"}</div>
                <div className="info-header">Teléfono</div>
                <div className="info-value">{user.client.phone || "—"}</div>
                <div className="info-header">Dirección</div>
                <div className="info-value">{user.client.address || "—"}</div>
                <div className="info-header">Ciudad</div>
                <div className="info-value">{user.client.city || "—"}</div>
                <div className="info-header">Departamento</div>
                <div className="info-value">
                  {user.client.department || "—"}
                </div>
                <div className="info-header">Código Postal</div>
                <div className="info-value">
                  {user.client.postalCode || "—"}
                </div>
                <div className="info-header">Tipo de Sucursal</div>
                <div className="info-value">
                  {user.client.branchType || "—"}
                </div>
                <div className="info-header">Número de empleados</div>
                <div className="info-value">
                  {user.client.employeeCount || "—"}
                </div>
                <div className="info-header">Contacto 1</div>
                <div className="info-value">
                  {user.client.contact1Name || "—"} (
                  {user.client.contact1Phone || "—"})
                </div>
                <div className="info-header">Contacto 2</div>
                <div className="info-value">
                  {user.client.contact2Name || "—"} (
                  {user.client.contact2Phone || "—"})
                </div>
              </div>
            </>
          )}

          {user.roles && user.roles.length > 0 && (
            <>
              <h2>Roles Asignados</h2>
              <ul className="roles-list">
                {user.roles.map((role) => (
                  <li key={role.id}>
                    {role.name} - {role.description}
                  </li>
                ))}
              </ul>
            </>
          )}

          {user.otps && user.otps.length > 0 && (
            <>
              <h2>OTP Registrados</h2>
              <ul className="roles-list">
                {user.otps.map((otp) => (
                  <li key={otp.id}>
                    Validado: {otp.isValidated ? "Sí" : "No"} <br />
                    Validado en: {new Date(
                      otp.validatedAt
                    ).toLocaleString()}{" "}
                    <br />
                    Expira: {new Date(otp.expiresAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

      )}

    </Layout>
  );
}

export default Profile;
