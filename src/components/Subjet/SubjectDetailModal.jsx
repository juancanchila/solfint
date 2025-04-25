// src/components/Subjects/SubjectDetailModal.js
import React from "react";
import "./SubjectDetailModal.css";

const SubjectDetailModal = ({ subject, onClose }) => {
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
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default SubjectDetailModal;