import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/userService';
import TableFilter from '../../shared/components/TableFilter/TableFilter';
import './UsersList.css';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getUsers();
        setUsers(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...users];

    if (value.trim() !== '') {
      result = result.filter((user) => {
        const userValue = user[field];
        const fieldValue =
          userValue !== null && userValue !== undefined
            ? String(userValue).toLowerCase()
            : '';
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === 'createdAt') {
        return ascending
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return ascending
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
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

  const handleActionChange = async (e, userId) => {
    const action = e.target.value;

    if (action === 'ver') {
      navigate(`/profile/${userId}`);
    } else if (action === 'eliminar') {
      const confirmed = window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede revertir.');
      if (confirmed) {
        try {
          await UserService.deleteUser(userId);
          alert('Usuario eliminado correctamente');
          // Aquí asumes que tienes estado setUsers y setFiltered
          setUsers(prev => prev.filter(user => user.id !== userId));
          setFiltered(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      }
    }

    e.target.selectedIndex = 0; // Resetear selección a default
  };


  return (
    <div className="card">
      <TableFilter
        fields={['id', 'name', 'email', 'createdAt']}
        onFilter={handleFilterChange}
      />

      <table className="clients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
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
            paginated.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <select onChange={(e) => handleActionChange(e, user.id)}>
                    <option value="">Acción</option>
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
  );
}

export default UsersList;
