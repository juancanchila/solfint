import React, { useEffect, useState } from 'react';
import UserService from '../../../services/userService';
import './RolesCard.css';

function RolesCard() {
  const [roles, setRoles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await UserService.getRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error al cargar los roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="card">
      <div className="card-header" onClick={toggleCollapse}>
        <h2 className="card-title">Listado de Roles</h2>
        <span className={`arrow ${isOpen ? 'rotate' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <table className="roles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RolesCard;
