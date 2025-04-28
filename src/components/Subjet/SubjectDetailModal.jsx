import React, { useState } from "react";
import "./SubjectDetailModal.css";
import apiService from "../../services/apiService"; // Asegúrate de importar apiService

const SubjectDetailModal = ({ subject, onClose, catalogList }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleAssignExam = async () => {
    if (selectedValue) {
      const selectedExam = catalogList.find(exam => exam.templateId === selectedValue);
      console.log(`Asignando examen al subjectId: ${subject.subjectId}`);
      console.log(`Examen seleccionado: ${selectedExam.examName}`);
      console.log(`TemplateId: ${selectedValue}`);

      // Llamada al método de apiService para enviar los datos al endpoint /input
      const data = {
        subjectId: subject.subjectId,
        examTemplateId: selectedValue,
        examName: selectedExam.examName,
        name: subject.subjectName
      };

      try {
        await apiService.submitInputData(data);
        alert("Examen asignado correctamente.");
        console.log("Examen asignado correctamente.");
        onClose(); // Cierra el modal después de asignar
      } catch (error) {
        console.error("Error al asignar el examen:", error);
      }
    } else {
      console.log("Por favor, selecciona una opción para asignar.");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>{subject.subjectName}</h2>
        <p>
          <strong>ID del Cliente:</strong> {subject.customerId}
        </p>
        <p>
          <strong>Email:</strong> {subject.subjectEmail}
        </p>
        <p>
          <strong>Móvil:</strong> {subject.subjectMobile}
        </p>
        <p>
          <strong>Token:</strong> {subject.subjectToken}
        </p>
        <p>
          <strong>Creado:</strong>{" "}
          {new Date(subject.subjectCreated).toLocaleString()}
        </p>
        <p>
          <strong>Modificado:</strong>{" "}
          {new Date(subject.subjectModified).toLocaleString()}
        </p>
        {subject.subjectPhoto && (
          <img src={subject.subjectPhoto} alt="Foto del sujeto" />
        )}

        <div className="assign-exam-container">
          <div className="assign-exam-card">
            <h3>Asignar Examen</h3>
            <div className="assign-exam-row">
              <select
                id="subjectSelect"
                value={selectedValue}
                onChange={handleSelectChange}
                className="exam-select"
              >
                <option value="">--Selecciona--</option>
                {catalogList.map((exam) => (
                  <option key={exam.templateId} value={exam.templateId}>
                    {exam.examName}
                  </option>
                ))}
              </select>
              <button className="assign-button" onClick={handleAssignExam}>
                Asignar
              </button>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="close-button">Cerrar</button>
      </div>
    </div>
  );
};

export default SubjectDetailModal;
