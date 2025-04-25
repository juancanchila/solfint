import React, { useEffect, useState } from "react";
import translateService from "../../services/translateService";
import Translate from "./Translate";
import Layout from '../../shared/components/Layout/Layout';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function TranslateList() {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [newOriginal, setNewOriginal] = useState("");
  const [newTranslated, setNewTranslated] = useState("");

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const data = await translateService.getAllTranslations();
      console.log(data);
      setTranslations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await translateService.deleteTranslation(id);
      setSnackbarMessage("Traducción eliminada exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchTranslations();
    } catch (error) {
      console.log(error);
      setSnackbarMessage("Error al eliminar la traducción");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleUpdated = () => {
    fetchTranslations();
    setSnackbarMessage("Traducción actualizada exitosamente");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleCreate = async () => {
    try {
      await translateService.createTranslation({
        original: newOriginal,
        translated: newTranslated,
      });
      setSnackbarMessage("Traducción creada exitosamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDialog(false);
      setNewOriginal("");
      setNewTranslated("");
      fetchTranslations();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error al crear la traducción");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Lista de Traducciones</Typography>
          <IconButton color="primary" onClick={() => setOpenDialog(true)}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          translations.map((translation) => (
            <Translate
              key={translation.id}
              data={translation}
              onDelete={handleDelete}
              onUpdated={handleUpdated}
            />
          ))
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Nueva Traducción</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Texto Original"
              value={newOriginal}
              onChange={(e) => setNewOriginal(e.target.value)}
              fullWidth
            />
            <TextField
              label="Texto Traducido"
              value={newTranslated}
              onChange={(e) => setNewTranslated(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate}>Crear</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default TranslateList;
