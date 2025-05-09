import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientService from "../../services/clientService";
import TableFilter from "../../shared/components/TableFilter/TableFilter";
import "./ClientsList.css";
import Swal from "sweetalert2";
import ErrorService from "../../services/errorService";

function ClientsList() {
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Obtenemos el valor del role desde localStorage

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await ClientService.getClients();
        console.log(data, "Listado de clientes");
        setClients(data);

        // Si el rol es "Super Admin", aseguramos que el cliente SOLFINT esté incluido
        if (role === "Super Admin") {
          const solfintClient = data.find(client => client.name === "SOLFINT");
          if (!solfintClient) {
            // Si el cliente SOLFINT no está en la lista, lo agregamos
            data.push({
              id: 1, // Usamos el ID que debe tener SOLFINT
              name: "SOLFINT",
              parentClientId: null,
              createdAt: new Date(),
            });
          }
        }

        const hierarchy = getHierarchicalClients(data);
        setFiltered(hierarchy);
      } catch (error) {
        ErrorService.handle(error);
        console.error("Error al cargar clientes:", error);
      }
    };

    fetchClients();
  }, [role]); // Dependemos del valor del role para que se actualice cuando cambie

  const getHierarchicalClients = (
    list,
    parentId = null,
    level = 0,
    prefix = ""
  ) => {
    let children;

    if (parentId === null) {
      const allIds = list.map((client) => client.id);
      children = list.filter(
        (client) => !allIds.includes(client.parentClientId)
      );
    } else {
      children = list.filter((client) => client.parentClientId === parentId);
    }

    let result = [];

    children.forEach((client, index) => {
      const isLast = index === children.length - 1;
      const linePrefix = prefix + (level > 0 ? (isLast ? "└── " : "├── ") : "");
      result.push({
        ...client,
        displayId: linePrefix + client.name,
        level,
        prefix,
      });

      const newPrefix = prefix + (level > 0 ? (isLast ? "    " : "│   ") : "");
      result = result.concat(
        getHierarchicalClients(list, client.id, level + 1, newPrefix)
      );
    });

    return result;
  };

  const handleFilterChange = ({ field, value, ascending }) => {
    let hierarchy = getHierarchicalClients(clients);

    if (value.trim() !== "") {
      hierarchy = hierarchy.filter((client) => {
        const clientValue = client[field];
        const fieldValue =
          clientValue !== null && clientValue !== undefined
            ? String(clientValue).toLowerCase()
            : "";
        return fieldValue.includes(value.toLowerCase());
      });
    }

    hierarchy.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === "createdAt") {
        const timestampA = new Date(aVal).getTime();
        const timestampB = new Date(bVal).getTime();

        if (isNaN(timestampA) || isNaN(timestampB)) {
          return 0;
        }

        return ascending ? timestampA - timestampB : timestampB - timestampA;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return ascending ? aVal - bVal : bVal - aVal;
    });

    setFiltered(hierarchy);
    setCurrentPage(1);
    setNoResults(hierarchy.length === 0);
  };

  const handleActionChange = async (e, clientId) => {
    const action = e.target.value;
    if (action === "ver") {
      navigate(`/clients/${clientId}`);
    } else if (action === "Licencias") {
      navigate(`/licence/${clientId}`);
    } else if (action === "Centros de Costo") {
      navigate(`/clientscostcenter/${clientId}`);
    } else if (action === "Areas") {
      navigate(`/clientsarea/${clientId}`);
    } else if (action === "editar") {
      navigate(`/editclient/${clientId}`);
    } else if (action === "eliminar") {
      const confirmed = window.confirm(
        "¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer."
      );
      if (confirmed) {
        try {
          await ClientService.deleteClient(clientId);
          alert("Cliente eliminado correctamente");
          const updated = clients.filter((c) => c.id !== clientId);
          setClients(updated);
          setFiltered(getHierarchicalClients(updated));
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
          alert("Error al eliminar el cliente");
        }
      }
    }

    e.target.selectedIndex = 0;
  };

  const paginate = (data) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const paginated = paginate(filtered);

  return (
    <div className="card">
      <TableFilter
        fields={[
          { field: "id", label: "ID" },
          { field: "name", label: "Nombre" },
          { field: "createdAt", label: "Fecha de Creación" },
        ]}
        onFilter={handleFilterChange}
      />
      <table className="clients-table">
        <thead>
          <tr>
            <th>ID / Jerarquía</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noResults ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "red" }}>
                No se encontraron resultados.
              </td>
            </tr>
          ) : (
            paginated.map((client) => (
              <tr key={client.id}>
                <td style={{ fontFamily: "monospace" }}>{client.displayId}</td>
                <td>{client.name}</td>
                <td>
                  <select onChange={(e) => handleActionChange(e, client.id)}>
                    <option value="">Acción</option>
                    <option value="ver">Ver</option>
                    <option value="Centros de Costo">Centros de Costo</option>
                    <option value="Areas">Áreas</option>
                    <option value="editar">Editar</option>
                    <option value="Licencias">Licencias</option>
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
          {Array.from(
            { length: Math.ceil(filtered.length / ITEMS_PER_PAGE) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default ClientsList;
