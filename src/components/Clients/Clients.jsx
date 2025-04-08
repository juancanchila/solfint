import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../shared/components/Layout/Layout';
import ClientsList from '../../components/Clients/ClientsList';
import { IconButton, Tooltip, Box, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Clientes() {
  const navigate = useNavigate();

  const goToAddClient = () => {
    navigate('/addClient');
  };

  return (
    <Layout>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" component="h1">
          Lista de Clientes
        </Typography>
        <Tooltip title="Agregar nuevo cliente">
          <IconButton color="primary" onClick={goToAddClient}>
            <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Esta sección es exclusiva para los clientes autenticados.
      </Typography>

      <ClientsList />
    </Layout>
  );
}

export default Clientes;
