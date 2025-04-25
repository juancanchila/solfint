
// Translate.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import translateService from '../../services/translateService';

function Translate({ data, onDelete, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [original, setOriginalText] = useState(data.original);
  const [translated, setTranslatedText] = useState(data.translated);

  const handleUpdate = async () => {
    try {
      await translateService.updateTranslation(data.id, {
        original,
        translated,
      });
      setOpen(false);
      onUpdated();
    } catch (error) {
      console.error('Error actualizando traducción:', error);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1"><strong>Original:</strong> {data.original}</Typography>
            <Typography variant="subtitle1"><strong>Traducción:</strong> {data.translated}</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setOpen(true)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(data.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Editar Traducción</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Texto original"
            margin="normal"
            value={original}
            onChange={(e) => setOriginalText(e.target.value)}
          />
          <TextField
            fullWidth
            label="Texto traducido"
            margin="normal"
            value={translated}
            onChange={(e) => setTranslatedText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Translate;
