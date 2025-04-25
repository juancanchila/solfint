// src/pages/ClientDetailManager.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Divider, Box, Button, Modal,
  Grid, TextField
} from '@mui/material';
import ClientService from '../../services/clientService';
import alertService from '../../services/alertService';
import DataTable from '../../components/DataTable';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ClientDetailManager() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) navigate('/clients');

  const [areas, setAreas] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  const [areaName, setAreaName] = useState('');
  const [licenseName, setLicenseName] = useState('');
  const [costCenterName, setCostCenterName] = useState('');

  const [openAreaModal, setOpenAreaModal] = useState(false);
  const [openLicenseModal, setOpenLicenseModal] = useState(false);
  const [openCostModal, setOpenCostModal] = useState(false);

  const loadAll = async () => {
    try {
      setAreas(await ClientService.getAreas(id));
      setLicenses(await ClientService.getLicencias(id));
      setCostCenters(await ClientService.getCostCenters(id));
    } catch (e) {
      console.error(e);
      alertService.confirmAlert({ message: 'Error cargando datos', type: 'error' });
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleSave = async (type) => {
    try {
      if (type === 'area') {
        await ClientService.addArea(id, { name: areaName });
        setAreaName('');
        setOpenAreaModal(false);
      }
      if (type === 'license') {
        await ClientService.addLicencia(id, { licenseNumber: licenseName });
        setLicenseName('');
        setOpenLicenseModal(false);
      }
      if (type === 'cost') {
        await ClientService.addCostCenter(id, { description: costCenterName, amount: 0 });
        setCostCenterName('');
        setOpenCostModal(false);
      }
      await loadAll();
      alertService.confirmAlert({ message: 'Guardado con éxito', type: 'success' });
    } catch (e) {
      console.error(e);
      alertService.confirmAlert({ message: 'Error al guardar', type: 'error' });
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/editclient/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este item?');
    if (confirmed) {
      try {
        await ClientService.deleteItem(itemId); // ajusta si se necesita identificar tipo
        await loadAll();
        alertService.confirmAlert({ message: 'Item eliminado correctamente', type: 'success' });
      } catch (e) {
        console.error(e);
        alertService.confirmAlert({ message: 'Error al eliminar el item', type: 'error' });
      }
    }
  };

  return (
    <Paper sx={{ p: 4, m: 4 }}>
      <Typography variant="h5" gutterBottom>
        Gestión Detallada Cliente #{id}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* ÁREAS */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Áreas</Typography>
          <Button onClick={() => setOpenAreaModal(true)} variant="outlined">+</Button>
        </Box>
        <DataTable
          data={areas}
          columns={[{ field: 'name', title: 'Nombre del Área' }]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>

      {/* LICENCIAS */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Licencias</Typography>
          <Button onClick={() => setOpenLicenseModal(true)} variant="outlined">+</Button>
        </Box>
        <DataTable
          data={licenses}
          columns={[{ field: 'licenseNumber', title: 'Número de Licencia' }]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>

      {/* CENTROS DE COSTO */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Centros de Costo</Typography>
          <Button onClick={() => setOpenCostModal(true)} variant="outlined">+</Button>
        </Box>
        <DataTable
          data={costCenters}
          columns={[{ field: 'description', title: 'Descripción del Centro' }]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>

      {/* MODAL ÁREA */}
      <Modal open={openAreaModal} onClose={() => setOpenAreaModal(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6" mb={2}>Nueva Área</Typography>
          <TextField
            fullWidth
            label="Nombre del Área"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => handleSave('area')}
          >
            Guardar
          </Button>
        </Box>
      </Modal>

      {/* MODAL LICENCIA */}
      <Modal open={openLicenseModal} onClose={() => setOpenLicenseModal(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6" mb={2}>Nueva Licencia</Typography>
          <TextField
            fullWidth
            label="Número de Licencia"
            value={licenseName}
            onChange={(e) => setLicenseName(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => handleSave('license')}
          >
            Guardar
          </Button>
        </Box>
      </Modal>

      {/* MODAL CENTRO DE COSTO */}
      <Modal open={openCostModal} onClose={() => setOpenCostModal(false)}>
        <Box sx={styleModal}>
          <Typography variant="h6" mb={2}>Nuevo Centro de Costo</Typography>
          <TextField
            fullWidth
            label="Descripción del Centro de Costo"
            value={costCenterName}
            onChange={(e) => setCostCenterName(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => handleSave('cost')}
          >
            Guardar
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}
