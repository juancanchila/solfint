import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import alertService from '../../services/alertService';
import ClientService from '../../services/clientService'; // Asegúrate de tener este servicio creado

function AddClientForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    description: '',
    branchType: 'sucursal',
    contact1Name: '',
    contact1Phone: '',
    contact2Name: '',
    contact2Phone: '',
    parentClientId: '',
    subClientLimit: 1,
  });

  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await ClientService.getClients();
        setClients(res);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let temp = {};
    temp.name = formData.name ? '' : 'El nombre es requerido';
    temp.email = /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Email inválido';
    temp.phone = formData.phone.length >= 7 ? '' : 'Teléfono inválido';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await ClientService.addClient(formData); // Aquí agregamos el cliente

      alertService.confirmAlert({
        message: 'Cliente agregado exitosamente',
        type: 'success',
      });

      navigate('/clients');
    } catch (error) {
      console.error('Error al crear cliente:', error);
      alertService.confirmAlert({
        message: 'Error al agregar cliente. Intente nuevamente.',
        type: 'error',
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Nuevo Cliente
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Información General */}
        <Typography variant="subtitle1" gutterBottom>
          Información General
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Nombre"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Descripción"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="branchType-label">Tipo de Sucursal</InputLabel>
              <Select
                labelId="branchType-label"
                name="branchType"
                value={formData.branchType}
                label="Tipo de Sucursal"
                onChange={handleChange}
              >
                <MenuItem value="principal">Principal</MenuItem>
                <MenuItem value="sucursal">Sucursal</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Cliente Padre */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="parentClientId-label">Cliente Padre</InputLabel>
              <Select
                labelId="parentClientId-label"
                name="parentClientId"
                value={formData.parentClientId}
                onChange={handleChange}
                label="Cliente Padre"
              >
                <MenuItem value="null">Sin Cliente Padre</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Límite de Subclientes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              name="subClientLimit"
              label="Límite de Subclientes"
              value={formData.subClientLimit}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </Grid>
        </Grid>

        {/* Datos de Contacto */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
          Datos de Contacto
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="email"
              label="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="phone"
              label="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="contact1Name"
              label="Nombre Contacto 1"
              value={formData.contact1Name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="contact1Phone"
              label="Teléfono Contacto 1"
              value={formData.contact1Phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="contact2Name"
              label="Nombre Contacto 2"
              value={formData.contact2Name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="contact2Phone"
              label="Teléfono Contacto 2"
              value={formData.contact2Phone}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Dirección */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
          Dirección
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Dirección"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="city"
              label="Ciudad"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="department"
              label="Departamento"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="postalCode"
              label="Código Postal"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Botón Guardar */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Guardar Cliente
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default AddClientForm;
