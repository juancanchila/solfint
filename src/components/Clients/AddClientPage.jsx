import React from 'react';
import Layout from '../../shared/components/Layout/Layout';
import AddClientForm from '../../components/Clients/AddClientForm';
import './AddClientPage.css'; // Asegúrate de crear este archivo también

function AddClientPage() {
  return (
    <Layout>
      <div className="add-client-page">
        <h1>Agregar Nuevo Cliente</h1>
        <p>Rellena el formulario para registrar un nuevo cliente en el sistema.</p>
        <div className="form-container">
          <AddClientForm />
        </div>
      </div>
    </Layout>
  );
}

export default AddClientPage;
