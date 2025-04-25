import React from 'react';
import Layout from '../../shared/components/Layout/Layout';
import EditClientForm from './EditClientForm';

function EditClientPage() {
  return (
    <Layout>
      <div className="add-user-page">
        <h1>Actualizar Cliente</h1>
        <p>Rellena el formulario para actualizar un cliente en el sistema.</p>

        <div className="form-container" style={{ marginBottom: '2rem' }}>
          <EditClientForm />
        </div>


      </div>
    </Layout>
  );
}

export default EditClientPage;
