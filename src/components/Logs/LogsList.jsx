import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogService from '../../services/apiService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import './LogsList.css'; // Crea este CSS si quieres estilos
import Layout from '../../shared/components/Layout/Layout';
function LogsList() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await LogService.getLogs();
        console.log(logsData);
        setLogs(logsData);
        setFiltered(logsData);
      } catch (error) {
        console.error('Error al cargar logs:', error);
      }
    };

    fetchLogs();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...logs];

    if (value.trim() !== '') {
      result = result.filter((log) => {
        const logValue = log[field];
        const fieldValue = logValue !== null && logValue !== undefined
          ? String(logValue).toLowerCase()
          : '';
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === 'createdAt') {
        const timestampA = new Date(aVal).getTime();
        const timestampB = new Date(bVal).getTime();

        if (isNaN(timestampA) || isNaN(timestampB)) {
          return 0;
        }

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

  const handleActionChange = (e, logId) => {
    const action = e.target.value;

    if (action === 'ver') {
      navigate(`/log/${logId}`);
    }

    e.target.selectedIndex = 0; // Reset selección
  };

  return (
    <Layout>
    <div className="card">
      <h2>Lista de Logs</h2>

      <TableFilter
        fields={['id', 'summary', 'createdAt']}
        onFilter={handleFilterChange}
      />

      <table className="logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resumen</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noResults ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: 'red' }}>
                No se encontraron resultados.
              </td>
            </tr>
          ) : (
            paginated.map((log) => (
              <tr key={log.id}>
                <td>{log.userId}</td>
                <td>{log.summary}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>
                  <select onChange={(e) => handleActionChange(e, log.id)}>
                    <option value="">Acción</option>
                    <option value="ver" disabled>Ver</option>
                  </select>
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

export default LogsList;
