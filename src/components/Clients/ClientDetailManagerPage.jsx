import React from 'react';
import Layout from '../../shared/components/Layout/Layout';
import AddClientForm from '../../components/Clients/EditCLientDetail';
import './AddClientPage.css'; // Asegúrate de crear este archivo también

function ClientDetailManagerPage() {
  return (
    <Layout>
      <div className="add-client-page">
        <h1>Gestión del Cliente</h1>
        <p>Rellena el formulario para actualizar el cliente.</p>
        <div className="form-container">
          <AddClientForm />
        </div>
      </div>
    </Layout>
  );
}

export default ClientDetailManagerPage;
