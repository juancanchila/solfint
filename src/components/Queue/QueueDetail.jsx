import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import "./QueueDetail.css";
import Layout from '../../shared/components/Layout/Layout';
function QueueDetail() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamAndSubject = async () => {
      try {
        const examData = await apiService.getQueueById(examId);
        setExam(examData);

        const subjectData = await apiService.getSubjetDetail(examData.subjectId);
        setSubject(subjectData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamAndSubject();
  }, [examId]);

  if (loading) return <p>Cargando...</p>;
  if (!exam) return <p>Examen no encontrado.</p>;

  return (
       <Layout>
    <div className="queue-detail">
      <h2>Detalle del Examen</h2>
      <div className="exam-details">
        <p><strong>Examen ID:</strong> {exam.examId}</p>
        <p><strong>Cliente ID:</strong> {exam.customerId}</p>
        <p><strong>Localización:</strong> {exam.examLocale}</p>
        <p><strong>Fecha Programada:</strong> {new Date(exam.examQueued).toLocaleString()}</p>
        <p><strong>Status:</strong> {exam.examStatus}</p>
        <p><strong>Step:</strong> {exam.examStep || 'N/A'}</p>
        <p><strong>URL del Examen:</strong> <a href={exam.examUrl} target="_blank" rel="noreferrer">{exam.examUrl}</a></p>
      </div>

      {subject && (
        <div className="subject-details">
          <h3>Información del Sujeto</h3>
          <p><strong>Nombre:</strong> {subject.subjectName}</p>
          <p><strong>ID del Cliente:</strong> {subject.customerId}</p>
          <p><strong>Email:</strong> {subject.subjectEmail}</p>
          <p><strong>Móvil:</strong> {subject.subjectMobile}</p>
          <p><strong>Token:</strong> {subject.subjectToken}</p>
          <p><strong>Creado:</strong> {new Date(subject.subjectCreated).toLocaleString()}</p>
          <p><strong>Modificado:</strong> {new Date(subject.subjectModified).toLocaleString()}</p>
          {subject.subjectPhoto && (
            <img
              src={subject.subjectPhoto}
              alt="Foto del sujeto"
              className="subject-photo"
            />
          )}
        </div>
      )}
    </div>
       </Layout>
  );
}

export default QueueDetail;
