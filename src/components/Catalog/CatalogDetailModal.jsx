import React from "react";
import "./CatalogDetailModal.css"; // Estilos para el modal

const CatalogDetailModal = ({ catalog, onClose }) => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>{catalog.examName}</h2>
        <p>
          <strong>Customer ID:</strong> {catalog.customerId}
        </p>
        <p>
          <strong>Idioma del examen:</strong> {catalog.examLocale}
        </p>
        <p>
          <strong>ID del Template:</strong> {catalog.templateId}
        </p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default CatalogDetailModal;
