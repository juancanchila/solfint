import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

function EditUserForm() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    jobTitle: '',
    foto: '',
    fullName: '',
    clientId: '',
    roleIds: [],
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesData, clientsData, userData] = await Promise.all([
          UserService.getRoles(),
          ClientService.getClients(),
          UserService.getUserById(userId),
        ]);

        setRoles(rolesData);
        setClients(clientsData);

        const initialData = {
          username: userData.username,
          email: userData.email,
          phone: userData.phone || '',
          whatsapp: userData.whatsapp || '',
          jobTitle: userData.jobTitle || '',
          foto: userData.foto || '',
          fullName: userData.fullName,
          clientId: String(userData.clientId),
          roleIds: userData.roleIds || [],
        };

        setOriginalData(initialData);
        setFormData({ ...initialData, password: '' });
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchInitialData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'roleIds') {
      setFormData((prev) => ({ ...prev, roleIds: [value] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};
    const tempErrors = {};

    Object.keys(originalData).forEach((key) => {
      const newValue = formData[key];
      const oldValue = originalData[key];

      if (newValue !== oldValue) {
        if (key === 'clientId' && !newValue) {
          tempErrors[key] = 'Seleccione un cliente';
        } else if (key === 'roleIds' && (!newValue || newValue.length === 0)) {
          tempErrors[key] = 'Seleccione un rol';
        } else if (key === 'email' && newValue && !/\S+@\S+\.\S+/.test(newValue)) {
          tempErrors[key] = 'Correo inválido';
        } else if (key === 'phone' && newValue && !/^\d{10}$/.test(newValue)) {
          tempErrors[key] = 'Teléfono debe tener 10 dígitos';
        }

        payload[key] = key === 'clientId' ? Number(newValue) : newValue;
      }
    });

    // Solo si se ingresó nueva contraseña
    if (formData.password.trim() !== '') {
      payload.password = formData.password;
    }

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
      await UserService.updateUser(userId, payload);

      alertService.confirmAlert({
        message: 'Usuario actualizado exitosamente',
        type: 'success',
      });
      navigate('/users');
    } catch (error) {
      console.log(error);
      alertService.confirmAlert({
        message: `Error al actualizar el usuario`,
        type: 'error',
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Editar Usuario
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
              label="Contraseña (opcional)"
              name="password"
              value={formData.password}
              onChange={handleChange}
              helperText="Solo llene si desea cambiar la contraseña"
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
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Foto (URL)"
              name="foto"
              value={formData.foto}
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
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" type="submit">
              ACTUALIZAR USUARIO
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default EditUserForm;
