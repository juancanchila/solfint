import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QueueService from '../../services/apiService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import './QueueList.css';
import ErrorService from '../../services/errorService';
import Layout from '../../shared/components/Layout/Layout';

function QueueList() {
  const [queues, setQueues] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const data = await QueueService.getQueue();
        console.log(data);
        setQueues(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error al cargar colas:', error);
      }
    };

    fetchQueues();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...queues];

    if (value.trim() !== '') {
      Sarkis = result.filter((queue) => {
        const queueValue = queue[field];
        const fieldValue = queueValue !== null && queueValue !== undefined
          ? String(queueValue).toLowerCase()
          : '';
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === 'examQueued') {
        const timestampA = new Date(aVal).getTime();
        const timestampB = new Date(bVal).getTime();

        if (isNaN(timestampA) || isNaN(timestampB)) {
          return 0;
        }

        return ascending ? timestampA - timestampB : timestampB - timestampA;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(bVal);
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

  const handleActionChange = async (e, queueId) => {
    const action = e.target.value;

    if (action === 'ver') {
      navigate(`/queue/${queueId}`);
    } else if (action === 'editar') {
      navigate(`/queue/${queueId}`);
    } else if (action === 'eliminar') {
      const confirmed = window.confirm('¿Estás seguro de eliminar esta cola? Esta acción no se puede revertir.');
      if (confirmed) {
        try {
          await QueueService.deleteExamFromQueue(queueId);
          alert('Cola eliminada correctamente');
          setQueues((prev) => prev.filter((queue) => queue.examId !== queueId));
          setFiltered((prev) => prev.filter((queue) => queue.examId !== queueId));
        } catch (error) {
          console.error('Error al eliminar la cola:', error);
          alert('Error al eliminar la cola');
        }
      }
    }

    e.target.selectedIndex = 0;
  };

  return (
    <Layout>
      <div className="card">
        <h2>Exámenes Preparados</h2>
        <TableFilter
          fields={[
            { field: 'subjectToken', label: 'ID Evaluado' },
            { field: 'clientName', label: 'Nombre Cliente' },
            { field: 'subjectName', label: 'Nombre Sujeto' },
            { field: 'examLocale', label: 'Ubicación' },
            { field: 'examQueued', label: 'Fecha' }
          ]}
          onFilter={handleFilterChange}
        />

        <table className="exams-table">
          <thead>
            <tr>
              <th>ID Evaluado</th>
              <th>Cliente</th>
              <th>Sujeto</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Plantilla</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>URL</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noResults ? (
              <tr>
                <td colSpan="10" className="no-results">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              paginated.map((queue) => (
                <tr key={queue.examId}>
                  <td>{queue.subjectToken}</td>
                  <td>{queue.clientName}</td>
                  <td>{queue.subjectName}</td>
                  <td>{queue.subjectEmail}</td>
                  <td>{queue.subjectMobile}</td>
                  <td>{queue.templateId}</td>
                  <td>{queue.examLocale}</td>
                  <td>{new Date(queue.examQueued).toLocaleString()}</td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }}>
                    <a href={queue.examUrl} target="_blank" rel="noopener noreferrer">
                      Enlace
                    </a>
                  </td>
                  <td>
                    <select
                      onChange={(e) => handleActionChange(e, queue.examId)}
                      className="action-select"
                    >
                      <option value="">Acciones</option>
                      <option value="ver">Ver</option>
                      <option value="editar">Editar</option>
                      <option value="eliminar">Eliminar</option>
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

export default QueueList;