import React, { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

function CatalogUpdate({ catalog, onClose, onUpdate }) {
  const [examName, setExamName] = useState(catalog.examName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedCatalog = {
        customerId: catalog.customerId,
        examLocale: catalog.examLocale,
        templateId: catalog.templateId,
        examName: examName,
        translationId: catalog.translationId,
        original: catalog.original,
      };

      await onUpdate(updatedCatalog);
    } catch (error) {
      console.error("Error al guardar el catálogo:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DialogTitle>Editar Nombre del Catálogo</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre del examen"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </>
  );
}

export default CatalogUpdate;
