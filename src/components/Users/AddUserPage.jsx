import React from 'react';
import Layout from '../../shared/components/Layout/Layout';
import AddUserForm from '../../components/Users/AddUserForm';
import './AddUserPage.css';

function AddUserPage() {
  return (
    <Layout>
      <div className="add-user-page">
        <h1>Agregar Nuevo Usuario</h1>
        <p>Rellena el formulario para crear un nuevo usuario en el sistema.</p>
        <div className="form-container">
          <AddUserForm />
        </div>
      </div>
    </Layout>
  );
}

export default AddUserPage;
