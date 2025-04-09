import React from 'react';
import Layout from '../../shared/components/Layout/Layout';
import EditUserForm from './EditProfileForm';


function EditUserPage() {
  return (
    <Layout>
      <div className="add-user-page">
        <h1>Actualziar Usuario</h1>
        <p>Rellena el formulario para actualziar un usuario en el sistema.</p>
        <div className="form-container">
          <EditUserForm/>
        </div>
      </div>
    </Layout>
  );
}

export default EditUserPage;
