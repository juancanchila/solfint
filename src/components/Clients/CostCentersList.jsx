import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientService from '../../services/clientService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import Layout from '../../shared/components/Layout/Layout';
import './ClientsList.css';
import ErrorService from '../../services/errorService';
function CostCentersList() {
  const { clientId } = useParams();
  const [centers, setCenters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        if (clientId) {
          const data = await ClientService.getCostCenters(clientId);
          setCenters(data);
          setFiltered(data);
        }
      } catch (error) {
        ErrorService.handle(error);
        console.error('Error al cargar centros de costo:', error);
      }
    };

    fetchCenters();
  }, [clientId]);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...centers];

    if (value.trim() !== '') {
      result = result.filter((item) =>
        String(item[field] || '').toLowerCase().includes(value.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (typeof aVal === 'string') {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return ascending ? aVal - bVal : bVal - aVal;
    });

    setFiltered(result);
    setCurrentPage(1);
    setNoResults(result.length === 0);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Eliminar este centro de costo?');
    if (!confirmed) return;

    try {
      await ClientService.deleteCostCenter(clientId, id);
      const updated = centers.filter((c) => c.id !== id);
      setCenters(updated);
      setFiltered(updated);
      alert('Centro de costo eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar centro de costo:', error);
      alert('No se pudo eliminar el centro de costo');
    }
  };

  const handleAdd = async () => {
    const description = prompt('Nombre del nuevo centro de costo:');
    if (!description) return;

    try {
      await ClientService.addCostCenter(clientId, {
        description,
        amount: 0,
      });
      const data = await ClientService.getCostCenters(clientId);
      setCenters(data);
      setFiltered(data);
      alert('Centro de costo agregado correctamente');
    } catch (error) {
      console.error('Error al agregar centro de costo:', error);
      alert('No se pudo agregar el centro de costo');
    }
  };

  const handleEdit = async (id, currentDescription) => {
    const newDescription = prompt('Nuevo nombre del centro de costo:', currentDescription);
    if (!newDescription || newDescription.trim() === '') return;

    try {
      await ClientService.updateCostCenter(clientId, id, {
        description: newDescription,
      });
      const data = await ClientService.getCostCenters(clientId);
      setCenters(data);
      setFiltered(data);
      alert('Centro de costo actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar centro de costo:', error);
      alert('No se pudo actualizar el centro de costo');
    }
  };

  const paginate = (data) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  return (
    <Layout>
      <div className="card">
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <button onClick={handleAdd}>➕ Agregar Centro de Costo</button>
        </div>

        <TableFilter
  fields={[
    { field: 'id', label: 'ID del Área' },
    { field: 'description', label: 'Descripción del Área' }
  ]}
  onFilter={handleFilterChange}
/>

        <table className="clients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noResults ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              paginate(filtered).map((center) => (
                <tr key={center.id}>
                  <td>{center.id}</td>
                  <td>{center.description}</td>
                  <td>
                    <button onClick={() => handleEdit(center.id, center.description)}>✏️</button>{' '}
                    <button onClick={() => handleDelete(center.id)}>🗑️ </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!noResults && (
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
        )}
      </div>
    </Layout>
  );
}

export default CostCentersList;
