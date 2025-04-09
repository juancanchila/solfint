import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import ClientService from '../../services/clientService';
import alertService from '../../services/alertService';

function EditClientForm() {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    email: '',
    branchType: '',
    logo: '',
    employeeCount: '',
    contact1Name: '',
    contact1Phone: '',
    contact2Name: '',
    contact2Phone: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await ClientService.getClientById(clientId);

        const initialData = {
          name: client.name || '',
          description: client.description || '',
          phone: client.phone || '',
          address: client.address || '',
          city: client.city || '',
          department: client.department || '',
          postalCode: client.postalCode || '',
          email: client.email || '',
          branchType: client.branchType || '',
          logo: client.logo || '',
          employeeCount: client.employeeCount || '',
          contact1Name: client.contact1Name || '',
          contact1Phone: client.contact1Phone || '',
          contact2Name: client.contact2Name || '',
          contact2Phone: client.contact2Phone || '',
        };

        setOriginalData(initialData);
        setFormData(initialData);
      } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    const tempErrors = {};

    Object.keys(originalData).forEach((key) => {
      const newValue = formData[key];
      const oldValue = originalData[key];

      if (newValue !== oldValue) {
        if (key === 'email' && newValue && !/\S+@\S+\.\S+/.test(newValue)) {
          tempErrors[key] = 'Correo inválido';
        }
        payload[key] = newValue;
      }
    });

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    if (Object.keys(payload).length === 0) {
      alertService.confirmAlert({
        message: 'No se han realizado cambios',
        type: 'info',
      });
      return;
    }

    try {
      await ClientService.updateClient(clientId, payload);

      alertService.confirmAlert({
        message: 'Cliente actualizado exitosamente',
        type: 'success',
      });
      navigate('/clients');
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alertService.confirmAlert({
        message: 'Error al actualizar el cliente',
        type: 'error',
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Editar Cliente
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ciudad"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Departamento"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Código Postal"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tipo de Sucursal"
              name="branchType"
              value={formData.branchType}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Logo (URL)"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Número de Empleados"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre del Contacto 1"
              name="contact1Name"
              value={formData.contact1Name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Teléfono del Contacto 1"
              name="contact1Phone"
              value={formData.contact1Phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre del Contacto 2"
              name="contact2Name"
              value={formData.contact2Name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Teléfono del Contacto 2"
              name="contact2Phone"
              value={formData.contact2Phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" type="submit">
              ACTUALIZAR CLIENTE
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default EditClientForm;
