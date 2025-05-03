import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout/Layout";
import apiService from "../../services/apiService";
import ErrorService from '../../services/errorService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import { Box, Typography, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "./Exams.css";

function Exams() {
  const [exams, setExams] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const data = await apiService.getExamList();
        setExams(data);
        setFiltered(data);
      } catch (error) {
        ErrorService.handle(error);
        console.error("Error al obtener los exámenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...exams];

    if (value.trim() !== '') {
      result = result.filter((exam) => {
        const examValue = exam[field];
        const fieldValue = examValue !== null && examValue !== undefined ? String(examValue).toLowerCase() : '';
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === 'examScored' || field === 'examQueued') {
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

  const handleActionChange = (e, examId) => {
    const action = e.target.value;

    if (action === "ver") {
      handleExamClick(examId);
    }
    // Reset the select value
    e.target.value = "";
  };

  const handleExamClick = async (examId) => {
    try {
      const examDetail = await apiService.getExamDetail(examId);
      setSelectedExam(examDetail);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener los detalles del examen:", error);
      setSnackbarMessage("Error al obtener los detalles del examen");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const closeModal = () => {
    setOpenDialog(false);
    setSelectedExam(null);
  };

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Gestión de Exámenes</Typography>
        <Typography variant="subtitle1" gutterBottom>Listado de exámenes completados</Typography>

        <TableFilter
          fields={[
            { field: 'examName', label: 'Nombre del Examen' },
            { field: 'examTopic', label: 'Tema' },
            { field: 'customerId', label: 'ID Cliente' },
            { field: 'examScored', label: 'Fecha de Evaluación' }
          ]}
          onFilter={handleFilterChange}
        />

        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : (
          <table className="exams-table">
            <thead>
              <tr>
                <th>Nombre del Examen</th>
                <th>Tema</th>
                <th>Resultados</th>
                <th>Fecha de Evaluación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {noResults ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                paginated.map((exam) => (
                  <tr key={exam.examId}>
                    <td>{exam.examName}</td>
                    <td>{exam.examTopic}</td>
                    <td>
                      <ul className="exam-results">
                        <li>{exam.examResult1} ({exam.examScore1})</li>
                        <li>{exam.examResult2} ({exam.examScore2})</li>
                        <li>{exam.examResult3} ({exam.examScore3})</li>
                      </ul>
                    </td>
                    <td>{new Date(exam.examScored).toLocaleString()}</td>
                    <td>
                      <select onChange={(e) => handleActionChange(e, exam.examId)}>
                        <option value="">Acción</option>
                        <option value="ver">Ver Detalles</option>
                        <option value="eliminar" disabled>Eliminar</option>
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

        {selectedExam && (
          <Dialog open={openDialog} onClose={closeModal} maxWidth="md" fullWidth>
            <DialogTitle>Detalles del Examen</DialogTitle>
            <DialogContent>
              <div className="exam-detail">
                <h2>{selectedExam.examName}</h2>
                <p><strong>ID del Examen:</strong> {selectedExam.examId}</p>
                <p><strong>ID del Cliente:</strong> {selectedExam.customerId}</p>
                <p><strong>Modelo:</strong> {selectedExam.examModel}</p>
                <p><strong>Idioma:</strong> {selectedExam.examLocale}</p>
                <p><strong>Tema:</strong> {selectedExam.examTopic}</p>
                <p><strong>Fecha de Cola:</strong> {new Date(selectedExam.examQueued).toLocaleString()}</p>
                <p><strong>Fecha de Evaluación:</strong> {new Date(selectedExam.examScored).toLocaleString()}</p>

                <h3>Resultados:</h3>
                <ul className="exam-results">
                  <li><strong>{selectedExam.examResult1}:</strong> {selectedExam.examScore1}</li>
                  <li><strong>{selectedExam.examResult2}:</strong> {selectedExam.examScore2}</li>
                  <li><strong>{selectedExam.examResult3}:</strong> {selectedExam.examScore3}</li>
                </ul>

                <h3>Estadísticas:</h3>
                <p><strong>Preguntas:</strong> {selectedExam.examQuestions}</p>
                <p><strong>Errores:</strong> {selectedExam.examErrors}</p>
                <p><strong>Timeouts:</strong> {selectedExam.examTimeouts}</p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal}>Cerrar</Button>
            </DialogActions>
          </Dialog>
        )}

        <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}

export default Exams;