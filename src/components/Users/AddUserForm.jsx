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
    cargo: '',
    fullName: '',
    clientId: '',
    roleIds: [],
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

    if (name === 'roleIds') {
      setFormData((prev) => ({ ...prev, roleIds: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    let temp = {};
    temp.username = formData.username ? '' : 'Nombre de usuario requerido';
    temp.fullName = formData.fullName ? '' : 'Nombre completo requerido';
    temp.email = /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Correo inválido';
    temp.password = formData.password.length >= 6 ? '' : 'Mínimo 6 caracteres';
    temp.telefono = /^\d{10}$/.test(formData.telefono) ? '' : 'Teléfono debe tener 10 dígitos';
    temp.roleIds = formData.roleIds.length > 0 ? '' : 'Seleccione un rol';
    temp.clientId = formData.clientId ? '' : 'Seleccione un cliente';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        whatsapp: formData.whatsapp,
        cargo: formData.cargo,
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

      console.log(error);
      alertService.confirmAlert({
        message: `Error al agregar el usuario`,
        type: 'error',
      });
    }
  };


  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Nuevo Usuario
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Fila 1 */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
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
              type="password"
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          {/* Fila 2 */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="WhatsApp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nombre Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              name="roleIds"
              label="Rol"
              value={formData.roleIds[0] || ''}
              onChange={handleChange}
              error={!!errors.roleIds}
              helperText={errors.roleIds}
            >
              <MenuItem value="">Seleccione un rol</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Fila 4 */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              name="clientId"
              label="Cliente"
              value={formData.clientId}
              onChange={handleChange}
              error={!!errors.clientId}
              helperText={errors.clientId}
            >
              <MenuItem value="">Seleccione un cliente</MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>




          {/* Botón */}
          <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" type="submit">
              GUARDAR USUARIO
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default AddUserForm;
