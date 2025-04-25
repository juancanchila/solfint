import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout/Layout";
import apiService from "../../services/apiService";
import ExamDetailModal from "./ExamDetailModal"; // Importa el modal
import "./Exams.css";

function Exams() {
  const [exams, setExams] = useState([]); // Estado para almacenar los exámenes
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [selectedExam, setSelectedExam] = useState(null); // Estado para manejar el examen seleccionado
  const [loadingDetail, setLoadingDetail] = useState(false); // Estado para manejar la carga de detalles

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await apiService.getExamList();
        setExams(data);
      } catch (error) {
        console.error("Error al obtener los exámenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleExamClick = async (examId) => {
    setLoadingDetail(true); // Comienza a cargar los detalles del examen
    try {
      const examDetail = await apiService.getExamDetail(examId); // Llama al servicio para obtener los detalles del examen
      setSelectedExam(examDetail); // Establece el examen detallado en el estado
    } catch (error) {
      console.error("Error al obtener los detalles del examen:", error);
    } finally {
      setLoadingDetail(false); // Termina de cargar los detalles
    }
  };

  const closeModal = () => {
    setSelectedExam(null); // Cierra el modal
  };

  return (
    <Layout>
      <h1>Gestión de Exámenes</h1>
      <p>Este es el contenido de la página principal.</p>

      <br />
      <hr/>
      <h3>Listado de exámenes completados</h3>
      {loading ? (
        <p>Cargando exámenes...</p>
      ) : exams.length > 0 ? (
        <ul className="exam-list">
          {exams.map((exam) => (
            <li
              key={exam.examId}
              className="exam-item"
              onClick={() => handleExamClick(exam.examId)}
            >
              <h2>{exam.examName}</h2>
              <p>
                <strong>Resultado 1:</strong> {exam.examResult1}
              </p>
              <p>
                <strong>Resultado 2:</strong> {exam.examResult2}
              </p>
              <p>
                <strong>Resultado 3:</strong> {exam.examResult3}
              </p>
              <p>
                <strong>Fecha de Evaluación:</strong>{" "}
                {new Date(exam.examScored).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron exámenes.</p>
      )}

      {selectedExam && (
        <ExamDetailModal exam={selectedExam} onClose={closeModal} />
      )}

      {loadingDetail && <p>Cargando detalles del examen...</p>}
    </Layout>
  );
}

export default Exams;
