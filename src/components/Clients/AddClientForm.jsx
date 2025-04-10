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
import ClientService from '../../services/clientService';
import './AddClientPage.css';
function AddClientForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    centroDeCosto: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    description: '',
    branchType: '飽ursal',
    contact1Name: '',
    contact1Phone: '',
    contact2Name: '',
    contact2Phone: '',
    parentClientId: '',
    subClientLimit: 1,
    logo: '',
    employeeCount: '',
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
    temp.nit = formData.nit ? '' : 'El NIT es requerido';
    temp.email = /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Email inválido';
    temp.phone = formData.phone.length === 10 ? '' : 'Teléfono debe tener 10 dígitos';
    temp.contact1Phone = !formData.contact1Phone || formData.contact1Phone.length === 10 ? '' : 'Teléfono debe tener 10 dígitos';
    temp.contact2Phone = !formData.contact2Phone || formData.contact2Phone.length === 10 ? '' : 'Teléfono debe tener 10 dígitos';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await ClientService.addClient(formData);
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
        {/* Información General - Exactamente 4 filas, 2 campos por fila */}
        <Typography variant="subtitle1" gutterBottom>
          Información General
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {/* Fila 1: Nombre y NIT */}
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="nit"
              label="NIT"
              value={formData.nit}
              onChange={handleChange}
              error={!!errors.nit}
              helperText={errors.nit}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Fila 2: Descripción y Tipo de Sucursal */}
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>

            <TextField
              fullWidth
              name="description"
              label="Descripción"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth> {/* Añade fullWidth aquí */}
    <InputLabel id="branchType-label">Tipo de Sucursal</InputLabel>
    <Select
      fullWidth // Añade esta propiedad
      labelId="branchType-label"
      name="branchType"
      value={formData.branchType}
      label="Tipo de Sucursal"
      onChange={handleChange}
      sx={{
        height: '56px' // Ajusta la altura si es necesario
      }}
    >
      <MenuItem value="principal">Principal</MenuItem>
      <MenuItem value="sucursal">Sucursal</MenuItem>
    </Select>
  </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Fila 3: Centro de Costo y Cliente Padre */}
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="centroDeCosto"
              label="Centro de Costo"
              value={formData.centroDeCosto}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="parentClientId-label">Cliente Padre</InputLabel>
              <Select
                labelId="parentClientId-label"
                name="parentClientId"
                value={formData.parentClientId}
                onChange={handleChange}
                label="Cliente Padre"
              >
                <MenuItem value="">Sin Cliente Padre</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Fila 4: Límite de Subclientes y Logo */}
        <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              type="number"
              name="subClientLimit"
              label="Límite de Subclientes"
              value={formData.subClientLimit}
              onChange={handleChange}
              slotProps={{
                htmlInput: {  // Reemplaza inputProps por slotProps.htmlInput
                  min: 3,    // Valor mínimo
                  max: 10,   // Valor máximo
                  step: 1,   // Incremento/decremento de 1 en 1
                },
              }}
              error={!!errors.subClientLimit}
              helperText={errors.subClientLimit}
            />
          </Grid>


        </Grid>

        {/* Datos de Contacto */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
          Datos de Contacto
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contact1Name"
              label="Nombre Contacto 1"
              value={formData.contact1Name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contact1Phone"
              label="Teléfono Contacto 1"
              value={formData.contact1Phone}
              onChange={handleChange}
              error={!!errors.contact1Phone}
              helperText={errors.contact1Phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contact2Name"
              label="Nombre Contacto 2"
              value={formData.contact2Name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contact2Phone"
              label="Teléfono Contacto 2"
              value={formData.contact2Phone}
              onChange={handleChange}
              error={!!errors.contact2Phone}
              helperText={errors.contact2Phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              name="employeeCount"
              label="Cantidad de Empleados"
              value={formData.employeeCount}
              onChange={handleChange}
              inputProps={{ min: 0 }}
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="city"
              label="Ciudad"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="department"
              label="Departamento"
              value={formData.department}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
