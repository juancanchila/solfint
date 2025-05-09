import React, { useState, useEffect } from "react";
import "./CatalogCreateModal.css";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import apiService from "../../services/apiService";
import ClientService from "../../services/clientService";

function CatalogCreateModal({ onClose, onUpdate }) {
  const [examOptions, setExamOptions] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [newExamName, setNewExamName] = useState("");
  const [creating, setCreating] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [exams, clients] = await Promise.all([
          apiService.getCatalogList(),
          ClientService.getClients(),
        ]);
        setExamOptions(exams);
        setClientsData(clients);
      } catch (error) {
        console.error("Error cargando exámenes o clientes:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleCreate = async () => {
    const selectedExam = examOptions.find(
      (exam) => String(exam.examName) === selectedExamId
    );

    if (!selectedExam) return;

    const payload = {
      tipoDePrueba: newExamName || selectedExam.examName,
      userId: userId,
      clientId: selectedClientId,
      templateId: selectedExam.templateId,
      examLocale: "es-CO"
    };

    try {
      console.log(payload);
      setCreating(true);
      await apiService.createCatalog(payload);
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Error al crear el catálogo:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <DialogTitle>Crear Nuevo Examen</DialogTitle>
      <DialogContent dividers>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label>Selecciona un examen base</label>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
          >
            <option value="">-- Selecciona un examen --</option>
            {examOptions.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.examName}
              </option>
            ))}
          </select>

          <label>Selecciona un Cliente</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">-- Selecciona un Cliente --</option>
            {clientsData.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <TextField
            label="Nuevo nombre del examen (opcional)"
            variant="outlined"
            fullWidth
            value={newExamName}
            onChange={(e) => setNewExamName(e.target.value)}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={creating}>
          Cancelar
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={
            !selectedExamId || !selectedClientId || creating
          }
        >
          {creating ? "Creando..." : "Crear"}
        </Button>
      </DialogActions>
    </>
  );
}

export default CatalogCreateModal;
