import React, { useState} from 'react';
import './CatalogUpdate.css'; // Asegúrate de tener este archivo CSS

function CatalogUpdate({ catalog, onClose, onUpdate }) {
  const [updatedCatalog, setUpdatedCatalog] = useState({
    ...catalog,
    examName: catalog.examName || '',  // Solo se actualiza el nombre
  });

  // Cambia el nombre del examen al escribir en el campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCatalog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Cuando se envía el formulario, se actualiza el catálogo
  const handleSubmit = async (e) => {
    e.preventDefault();
    onUpdate(updatedCatalog);  // Llamamos al método de actualización del catálogo
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h3>Editar Catálogo</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="examName">Nombre del Examen</label>
            <input
              type="text"
              id="examName"
              name="examName"
              value={updatedCatalog.examName}
              onChange={handleChange}
              placeholder="Introduce el nuevo nombre del examen"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CatalogUpdate;
