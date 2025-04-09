// src/components/Clients/ClientProfile.jsx

import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "../../shared/components/Layout/Layout";
import ClientService from "../../services/clientService";
import "./ClientProfile.css";

function ClientProfile() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      setRedirect(true);
      return;
    }

    ClientService.getClientById(clientId)
      .then((response) => setClient(response))
      .catch(() => setRedirect(true));
  }, [clientId]);

  if (redirect) return <Navigate to="/clients" replace />;

  return (
    <Layout>
      <div className="profile-page">
        <h1 className="profile-title">{client?.name || "Cliente"}</h1>
        <p className="profile-paragraph">
          Detalle de la sucursal / cliente en el sistema.
        </p>

        {!client ? (
          <p>Cargando datos del cliente...</p>
        ) : (
          <>
            <h2 className="profile-subtitle">Información General</h2>
            <div className="info-grid-excel">
              <div className="info-header">ID</div>
              <div className="info-value">{client.id}</div>

              <div className="info-header">Nombre</div>
              <div className="info-value">{client.name}</div>

              <div className="info-header">Email</div>
              <div className="info-value">{client.email || "—"}</div>

              <div className="info-header">Teléfono</div>
              <div className="info-value">{client.phone || "—"}</div>

              <div className="info-header">Dirección</div>
              <div className="info-value">{client.address || "—"}</div>

              <div className="info-header">Ciudad</div>
              <div className="info-value">{client.city || "—"}</div>

              <div className="info-header">Departamento</div>
              <div className="info-value">{client.department || "—"}</div>

              <div className="info-header">Código Postal</div>
              <div className="info-value">{client.postalCode || "—"}</div>

              <div className="info-header">Tipo de Sucursal</div>
              <div className="info-value">{client.branchType || "—"}</div>

              <div className="info-header">Límite Subclientes</div>
              <div className="info-value">{client.subClientLimit || "—"}</div>

              <div className="info-header">Número de empleados</div>
              <div className="info-value">{client.employeeCount || "—"}</div>

              <div className="info-header">Contacto 1</div>
              <div className="info-value">
                {client.contact1Name || "—"} ({client.contact1Phone || "—"})
              </div>

              <div className="info-header">Contacto 2</div>
              <div className="info-value">
                {client.contact2Name || "—"} ({client.contact2Phone || "—"})
              </div>

              <div className="info-header">Creado</div>
              <div className="info-value">
                {client.createdAt
                  ? new Date(client.createdAt).toLocaleString()
                  : "—"}
              </div>

              <div className="info-header">Última actualización</div>
              <div className="info-value">
                {client.updatedAt
                  ? new Date(client.updatedAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ClientProfile;
