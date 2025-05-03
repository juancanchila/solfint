import React, { useEffect, useState } from "react";
import translateService from "../../services/translateService";
import Layout from '../../shared/components/Layout/Layout';
import ErrorService from '../../services/errorService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import './TranslateList.css';
import { Box, Typography, IconButton, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from 'react-router-dom';

function TranslateList() {
  const [translations, setTranslations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [newOriginal, setNewOriginal] = useState("");
  const [newTranslated, setNewTranslated] = useState("");
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const data = await translateService.getAllTranslations();
      setTranslations(data);
      setFiltered(data);
    } catch (error) {
      ErrorService.handle(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...translations];

    if (value.trim() !== '') {
      result = result.filter((translation) => {
        const logValue = translation[field];
        const fieldValue = logValue !== null && logValue !== undefined ? String(logValue).toLowerCase() : '';
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === 'createdAt') {
        const timestampA = new Date(aVal).getTime();
        const timestampB = new Date(bVal).getTime();
        return ascending ? timestampA - timestampB : timestampB - timestampA;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return ascending ? aVal - bVal : bVal - aVal;
    });

    setFiltered(result);
    setCurrentPage(1);
    setNoResults(result.length === 0);
  };

  const paginate = (data) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const paginated = paginate(filtered);

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

  const handleUpdate = async () => {
    if (selectedTranslation) {
      try {
        await translateService.updateTranslation({
          id: selectedTranslation.id,
          original: newOriginal,
          translated: newTranslated,
        });
        setSnackbarMessage("Traducción actualizada exitosamente");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenDialog(false);
        setNewOriginal("");
        setNewTranslated("");
        setSelectedTranslation(null);
        fetchTranslations();
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Error al actualizar la traducción");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleActionChange = (e, id) => {
    const action = e.target.value;

    if (action === "ver") {
      const translation = translations.find(t => t.id === id);
      if (translation) {
        setSelectedTranslation(translation);
        setNewOriginal(translation.original);
        setNewTranslated(translation.translated);
        setOpenDialog(true);
      }
    }
    // Reset the select value
    e.target.value = "";
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

        <TableFilter
          fields={[{ field: 'original', label: 'Original' }, { field: 'translated', label: 'Traducido' }, { field: 'createdAt', label: 'Fecha de Creación' }]}
          onFilter={handleFilterChange}
        />

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <table className="translations-table">
            <thead>
              <tr>
                <th>Original</th>
                <th>Traducido</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noResults ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'red' }}>
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((translation) => (
                  <tr key={translation.id}>
                    <td>{translation.original}</td>
                    <td>{translation.translated}</td>
                    <td>{new Date(translation.createdAt).toLocaleString()}</td>
                    <td>
                      <select onChange={(e) => handleActionChange(e, translation.id)}>
                        <option value="">Acción</option>
                        <option value="ver">Ver/Editar</option>
                        <option value="eliminar" >Eliminar</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="pagination">
          {Array.from({ length: Math.ceil(filtered.length / ITEMS_PER_PAGE) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{selectedTranslation ? "Editar Traducción" : "Nueva Traducción"}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Texto Original" value={newOriginal} onChange={(e) => setNewOriginal(e.target.value)} fullWidth />
            <TextField label="Texto Traducido" value={newTranslated} onChange={(e) => setNewTranslated(e.target.value)} fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button variant="contained" onClick={selectedTranslation ? handleUpdate : handleCreate}>
              {selectedTranslation ? "Actualizar" : "Crear"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

export default TranslateList;