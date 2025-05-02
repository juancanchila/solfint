import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import UserService from '../../services/userService';
import ClientService from '../../services/clientService';
import alertService from '../../services/alertService';

function AddUserForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    telefono: '',
    whatsapp: '',
    ciudad:'',
    fullName: '',
    clientId: 1,
    roleIds:  '',
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesData, clientsData] = await Promise.all([
          UserService.getRoles(),
          ClientService.getClients(),
        ]);

        setRoles(rolesData);
        setClients(clientsData);

        const clientData = JSON.parse(localStorage.getItem('client_data'));
        if (clientData?.id) {
          setFormData((prev) => ({ ...prev, clientId: clientData.id }));
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let temp = {};
    temp.username = formData.username ? '' : 'Nombre de usuario requerido';
    temp.fullName = formData.fullName ? '' : 'Nombre completo requerido';
    temp.email = /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Correo inválido';
    temp.password = formData.password.length >= 6 ? '' : 'Mínimo 6 caracteres';
    temp.telefono = /^\d{10}$/.test(formData.telefono) ? '' : 'Teléfono debe tener 10 dígitos';
    temp.roleIds = formData.roleIds ? '' : 'Seleccione un rol';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    console.log(validate());
    if (!validate()) return;

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        whatsapp: formData.whatsapp,
        fullName: formData.fullName,
        clientId: Number(formData.clientId),
        roleIds: formData.roleIds,
      };

      await UserService.addUser(payload);
      alertService.confirmAlert({
        message: 'Usuario agregado exitosamente',
        type: 'success',
      });
      navigate('/users');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alertService.confirmAlert({
        message: 'Error al agregar usuario. Intente nuevamente.',
        type: 'error',
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Nuevo Usuario
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="subtitle1" gutterBottom>
          Información General
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {/* Username */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="username"
              label="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />
          </Grid>

          {/* Full Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fullName"
              label="Nombre Completo"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Email */}
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

          {/* Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Phone and WhatsApp */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="telefono"
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="whatsapp"
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={handleChange}
              error={!!errors.whatsapp}
              helperText={errors.whatsapp}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="ciudad"
              label="Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              error={!!errors.ciudad}
              helperText={errors.ciudad}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Role and Client */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.roleIds}>
  <InputLabel id="roleIds-label">Roles</InputLabel>
  <Select
    labelId="roleIds-label"
    name="roleIds"
    value={formData.roleIds}
    onChange={handleChange}
    label="Roles"
  >
    {roles.map((role) => (
      <MenuItem key={role.id} value={role.id}>
        {role.name}
      </MenuItem>
    ))}
  </Select>
  {errors.roleIds && (
    <Typography variant="caption" color="error">
      {errors.roleIds}
    </Typography>
  )}
</FormControl>

          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="clientId-label">Cliente</InputLabel>
              <Select
  labelId="clientId-label"
  name="clientId"
  value={formData.clientId}
  onChange={handleChange}
  label="Cliente"
>
  <MenuItem value={1} >Sin cliente padre</MenuItem>  {/* Opción con valor '1' */}

  {clients.map((client) => (
    <MenuItem key={client.id} value={client.id}>
      {client.name}
    </MenuItem>
  ))}
</Select>

            </FormControl>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Guardar Usuario
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default AddUserForm;
