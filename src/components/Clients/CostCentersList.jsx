import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Importa useParams para extraer los parámetros de la URL
import ClientService from '../../services/clientService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import './ClientsList.css';
import Layout from '../../shared/components/Layout/Layout';

function CostCentersList() {
  const { clientId } = useParams();  // Obtén el clientId de la URL
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
        console.error('Error al cargar centros de costos:', error);
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
      await ClientService.deleteItem(id);
      const updated = centers.filter((c) => c.id !== id);
      setCenters(updated);
      setFiltered(updated);
      alert('Eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar');
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
      alert('Centro de costo agregado');
    } catch (error) {
      console.error('Error al agregar:', error);
      alert('No se pudo agregar');
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

        <TableFilter fields={['id', 'description']} onFilter={handleFilterChange} />

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
                    <button onClick={() => handleDelete(center.id)}>🗑️ Eliminar</button>
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
