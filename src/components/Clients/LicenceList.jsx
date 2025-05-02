import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientService from '../../services/clientService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import Layout from '../../shared/components/Layout/Layout';
import ErrorService from '../../services/errorService';
import './LicenseList.css';

function LicenseList() {
  const { clientId } = useParams();
  const [licenses, setLicenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [licenseToAssign, setLicenseToAssign] = useState(null);
  const [licenseCount, setLicenseCount] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLicenseCount, setNewLicenseCount] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        if (clientId) {
          const data = await ClientService.getLicenses(clientId);
          setLicenses(data);
          setFiltered(data);
        }
      } catch (error) {
        ErrorService.handle(error);
        console.error('Error al cargar licencias:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const data = await ClientService.getClients();
        setClients(data);
      } catch (error) {
        ErrorService.handle(error);
        console.error('Error al cargar clientes:', error);
      }
    };

    fetchLicenses();
    fetchClients();
  }, [clientId]);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...licenses];

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

  const handleAssignLicense = async () => {
    const available = licenseToAssign?.available || 0;

    if (!selectedClient || !licenseCount || isNaN(licenseCount)) {
      alert('Por favor ingrese un número válido de licencias y seleccione un cliente.');
      return;
    }

    const count = parseInt(licenseCount);
    if (count <= 0 || count > available) {
      alert(`La cantidad debe ser mayor a 0 y menor o igual a ${available}.`);
      return;
    }

    const requestData = {
      targetClientId: selectedClient,
      licenseCount: count,
    };

    try {
      await ClientService.assignLicenses(clientId, licenseToAssign.id, requestData);
      const data = await ClientService.getLicenses(clientId);
      setLicenses(data);
      setFiltered(data);
      alert('Licencia asignada');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al asignar licencia:', error);
      alert('No se pudo asignar la licencia');
    }
  };

  const handleOpenAssignModal = (license) => {
    setLicenseToAssign(license);
    setLicenseCount('');
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (id, currentCount, currentStartDate, currentExpiryDate) => {
    const newCount = prompt('Nuevo número de licencias:', currentCount);
    const newStartDate = prompt('Nueva fecha de inicio (YYYY-MM-DD):', currentStartDate);
    const newExpiryDate = prompt('Nueva fecha de vencimiento (YYYY-MM-DD):', currentExpiryDate);

    if (!newCount || !newStartDate || !newExpiryDate) return;
    if (isNaN(newCount)) return;

    try {
      await ClientService.updateLicense(clientId, id, {
        licenseCount: parseInt(newCount),
        startDate: newStartDate,
        expiryDate: newExpiryDate,
      });
      const data = await ClientService.getLicenses(clientId);
      setLicenses(data);
      setFiltered(data);
      alert('Licencia actualizada');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('No se pudo actualizar');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Eliminar esta licencia?');
    if (!confirmed) return;

    try {
      await ClientService.deleteLicenses(clientId, id);
      const updated = licenses.filter((l) => l.id !== id);
      setLicenses(updated);
      setFiltered(updated);
      alert('Licencia eliminada');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar');
    }
  };

  const handleAdd = async () => {
    if (!newLicenseCount || !newStartDate || !newExpiryDate || isNaN(newLicenseCount)) {
      alert('Por favor complete todos los campos con valores válidos.');
      return;
    }

    try {
      await ClientService.addLicencia(
        parseInt(clientId),
        {
          licenseCount: parseInt(newLicenseCount),
          startDate: newStartDate,
          expiryDate: newExpiryDate,
          available: parseInt(newLicenseCount),
        }
      );
      const data = await ClientService.getLicenses(clientId);
      setLicenses(data);
      setFiltered(data);
      alert('Licencia agregada');
      setIsAddModalOpen(false);
      setNewLicenseCount('');
      setNewStartDate('');
      setNewExpiryDate('');
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
          {clientId === "1" && (
            <button onClick={() => setIsAddModalOpen(true)}>➕ Agregar Licencia</button>
          )}
        </div>

        <TableFilter
          fields={[
            { field: 'id', label: 'ID' },
            { field: 'licenseCount', label: 'Cantidad' },
            { field: 'available', label: 'Disponible' }
          ]}
          onFilter={handleFilterChange}
        />

        <table className="clients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cantidad</th>
              <th>Disponible</th>
              <th>Inicio</th>
              <th>Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noResults ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              paginate(filtered).map((license) => (
                <tr key={license.id}>
                  <td>{license.id}</td>
                  <td>{license.licenseCount}</td>
                  <td>{license.available}</td>
                  <td>{new Date(license.startDate).toLocaleDateString()}</td>
                  <td>{new Date(license.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(license.id, license.licenseCount, license.startDate, license.expiryDate)}
                    >
                      ✏️
                    </button>{' '}
                    <button onClick={() => handleDelete(license.id)}>🗑️</button>{' '}
                    <button onClick={() => handleOpenAssignModal(license)}>📤 Asignar</button>
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

      {/* Modal para asignar */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Asignar Licencia</h2>
              <label>Seleccionar Cliente:</label>
              <select value={selectedClient || ''} onChange={(e) => setSelectedClient(e.target.value)}>
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <label>Cantidad de Licencias (máximo {licenseToAssign?.available}):</label>
              <input
                type="number"
                value={licenseCount}
                onChange={(e) => setLicenseCount(e.target.value)}
                min="1"
                max={licenseToAssign?.available}
              />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button onClick={handleAssignLicense}>✅ Asignar</button>
                <button onClick={() => setIsModalOpen(false)}>❌ Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar licencia */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Agregar Licencia</h2>
              <label>Cantidad:</label>
              <input
                type="number"
                value={newLicenseCount}
                onChange={(e) => setNewLicenseCount(e.target.value)}
                min="1"
              />
              <label>Fecha de Inicio:</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
              <label>Fecha de Vencimiento:</label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
              />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button onClick={handleAdd}>✅ Agregar</button>
                <button onClick={() => setIsAddModalOpen(false)}>❌ Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default LicenseList;
