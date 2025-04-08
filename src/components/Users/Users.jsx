import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../shared/components/Layout/Layout';
import RolesCard from '../../shared/components/RolesCard/RolesCard';
import { IconButton, Tooltip, Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UsersList from './UsersList';
import './User.css';
function Users() {
  const navigate = useNavigate();

  const goToAddUser = () => {
    navigate('/addUser');
  };

  return (
    <Layout>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" component="h1">
          Lista de Usuarios
        </Typography>
        <Tooltip title="Agregar nuevo usuario">
          <IconButton color="primary" onClick={goToAddUser}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Esta sección es exclusiva para administradores.
      </Typography>

      <RolesCard />

      <Box sx={{ mt: 4 }}>
        <UsersList />
      </Box>

    </Layout>
  );
}

export default Users;
