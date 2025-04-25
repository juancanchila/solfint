import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import apiService from "../../services/apiService";

function SubjectCreateModal({ onClose, onSubjectCreated }) {
  const [subjectName, setSubjectName] = useState('');
  const [subjectToken, setSubjectToken] = useState('');
  const [subjectEmail, setSubjectEmail] = useState('');
  const [subjectMobile, setSubjectMobile] = useState('');

  const [errors, setErrors] = useState({
    subjectName: false,
    subjectToken: false,
    subjectEmail: false,
    subjectMobile: false
  });

  const validateFields = () => {
    const newErrors = {
      subjectName: !subjectName.trim(),
      subjectToken: !subjectToken.trim(),
      subjectEmail: !subjectEmail.trim(),
      subjectMobile: !subjectMobile.trim()
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCreateSubject = async () => {
    if (!validateFields()) return;

    try {
      await apiService.createSubject({
        subjectName,
        subjectToken,
        subjectEmail,
        subjectMobile,
      });
      onSubjectCreated();
      onClose();
    } catch (error) {
      console.error("Error al crear el sujeto:", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nuevo Evaluado</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre del Evaluado"
          fullWidth
          margin="normal"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          error={errors.subjectName}
          helperText={errors.subjectName ? "Este campo es requerido" : ""}
          required
        />
        <TextField
          label="Token del Evaluado"
          fullWidth
          margin="normal"
          value={subjectToken}
          onChange={(e) => setSubjectToken(e.target.value)}
          error={errors.subjectToken}
          helperText={errors.subjectToken ? "Este campo es requerido" : ""}
          required
        />
        <TextField
          label="Correo del Evaluado"
          fullWidth
          margin="normal"
          value={subjectEmail}
          onChange={(e) => setSubjectEmail(e.target.value)}
          error={errors.subjectEmail}
          helperText={errors.subjectEmail ? "Este campo es requerido" : ""}
          required
        />
        <TextField
          label="Móvil del Evaluado"
          fullWidth
          margin="normal"
          value={subjectMobile}
          onChange={(e) => setSubjectMobile(e.target.value)}
          error={errors.subjectMobile}
          helperText={errors.subjectMobile ? "Este campo es requerido" : ""}
          required
        />

        {/* Vista previa de datos */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom>Previsualización</Typography>
        <Box sx={{ backgroundColor: '#f9f9f9', padding: 2, borderRadius: 1 }}>
          <Typography variant="body2"><strong>Nombre:</strong> {subjectName || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Token:</strong> {subjectToken || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Correo:</strong> {subjectEmail || 'N/A'}</Typography>
          <Typography variant="body2"><strong>Móvil:</strong> {subjectMobile || 'N/A'}</Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleCreateSubject} color="primary" variant="contained">Crear</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SubjectCreateModal;
