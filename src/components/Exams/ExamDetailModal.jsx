import React from 'react';
import './ExamDetailModal.css';

const ExamDetailModal = ({ exam, onClose }) => {
  // Función para convertir Hex a Base64
  const hexToBase64 = (hexString) => {
    const byteArray = new Uint8Array(hexString.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
    return btoa(String.fromCharCode.apply(null, byteArray));
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>{exam.examName}</h2>
        <p><strong>Cliente:</strong> {exam.customerName}</p>
        <p><strong>Resultado:</strong> {exam.examResult1}, {exam.examResult2}, {exam.examResult3}</p>
        <p><strong>Fecha de Evaluación:</strong> {new Date(exam.examScored).toLocaleString()}</p>


        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ExamDetailModal;