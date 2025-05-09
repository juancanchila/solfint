import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import './Catalogs.css';
import ErrorService from '../../services/errorService';
import CatalogUpdateModal from './CatalogUpdateModal';
import CatalogCreateModal from './CreateExamModal';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import translateService from '../../services/translateService';
import Layout from '../../shared/components/Layout/Layout';
import Button from '@mui/material/Button';

function Catalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const [selectedCatalogEdit, setSelectedCatalogEdit] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const data = await apiService.getCatalogListExam();
        setCatalogs(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
        ErrorService.handle(error);
      }
    };

    fetchCatalogs();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...catalogs];

    if (value.trim() !== '') {
      result = result.filter((cat) => {
        const fieldValue = cat[field] !== null && cat[field] !== undefined
          ? String(cat[field]).toLowerCase()
          : '';
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

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

  const handleActionChange = (e, catalog) => {
    const action = e.target.value;

    if (action === 'ver') {
      console.log('Detalle del catálogo:', catalog);
    } else if (action === 'editar') {
      setSelectedCatalogEdit(catalog);
    }

    e.target.selectedIndex = 0;
  };

  const handleCatalogUpdated = async (updatedCatalog) => {
    console.log(updatedCatalog, "ready to update");
    setModalLoading(true);

    try {
      if (updatedCatalog.translationId === null) {
        await translateService.createTranslation({
          original: updatedCatalog.original,
          translated: updatedCatalog.examName,
        });
      } else {
        await translateService.updateTranslation(updatedCatalog.translationId, {
          original: updatedCatalog.original,
          translated: updatedCatalog.examName,
        });
      }

      const refreshedCatalogs = await apiService.getCatalogList();
      setCatalogs(refreshedCatalogs);
      setFiltered(refreshedCatalogs);
    } catch (error) {
      console.error("Error al actualizar el catálogo:", error);
    } finally {
      setModalLoading(false);
      closeEditModal();
    }
  };

  const closeEditModal = () => {
    setSelectedCatalogEdit(null);
  };

  const paginated = paginate(filtered);

  return (
    <Layout>
      <div className="card">
        <h2>Gestión de Catálogos</h2>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateModal(true)}
        >
          Crear Nuevo Examen
        </Button>

        <TableFilter
          fields={[
            { field: 'tipoDePrueba', label: 'Tipo de Prueba' },
            { field: 'templateId', label: 'Template ID' },
            { field: 'clientId', label: 'Cliente' },
            { field: 'userId', label: 'Usuario' }
          ]}
          onFilter={handleFilterChange}
        />

        <table className="queues-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Template ID</th>
              <th>Tipo de Prueba</th>
              <th>Cliente</th>
              <th>Usuario</th>
              <th>Área</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noResults ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'red' }}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              paginated.map((catalog, idx) => (
                <tr key={idx}>
                  <td>{catalog.id}</td>
                  <td>{catalog.templateId}</td>
                  <td>{catalog.tipoDePrueba}</td>
                  <td>{catalog.clientId}</td>
                  <td>{catalog.userId}</td>
                  <td>{catalog.areaId ?? 'N/A'}</td>
                  <td>{new Date(catalog.createdAt).toLocaleString()}</td>
                  <td>{new Date(catalog.updatedAt).toLocaleString()}</td>
                  <td>
                    <select onChange={(e) => handleActionChange(e, catalog)}>
                      <option value="">Acción</option>
                      <option value="ver">Ver</option>
                      <option value="editar">Editar</option>
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
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={i + 1 === currentPage ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
        )}

        <Dialog open={Boolean(selectedCatalogEdit)} onClose={closeEditModal} maxWidth="sm" fullWidth>
          {modalLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <CircularProgress />
              <p>Guardando cambios...</p>
            </div>
          ) : (
            selectedCatalogEdit && (
              <CatalogUpdateModal
                catalog={selectedCatalogEdit}
                onClose={closeEditModal}
                onUpdate={handleCatalogUpdated}
              />
            )
          )}
        </Dialog>

        <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
          <CatalogCreateModal onClose={() => setOpenCreateModal(false)} onUpdate={handleCatalogUpdated} />
        </Dialog>
      </div>
    </Layout>
  );
}

export default Catalogs;
