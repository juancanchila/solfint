import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout/Layout";
import apiService from "../../services/apiService";
import subjectService from "../../services/subjectService";
import SubjectDetailModal from "./SubjectDetailModal";
import SubjectCreateModal from "./CreateSubjectModal";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import TableFilter from "../../shared/components/TableFilter/TableFilter";
import "./Subjects.css";
import ErrorService from '../../services/errorService';

function Subjects() {
  const fields = [
    { field: "subjectId", label: "ID del Sujeto" },
    { field: "subjectName", label: "Nombre del Sujeto" },
    { field: "subjectEmail", label: "Correo Electrónico" },
    { field: "subjectMobile", label: "Teléfono Móvil" },
    { field: "subjectToken", label: "Token de Autenticación" },
    { field: "subjectCreated", label: "Fecha de Creación" }
  ];

  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [catalogList, setCatalogList] = useState([]);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await apiService.getSubjectList();
        setSubjects(data);
        setFilteredSubjects(data);
      } catch (error) {
        console.error("Error al obtener los sujetos:", error);
        ErrorService.handle(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCatalogList = async () => {
      try {
        const catalog = await apiService.getCatalogList();
        setCatalogList(catalog);
      } catch (error) {
        console.error("Error al obtener el catálogo de exámenes:", error);
      }
    };

    fetchSubjects();
    fetchCatalogList();
  }, []);

  const handleFilterChange = ({ field, value, ascending }) => {
    let result = [...subjects];

    if (value.trim() !== "") {
      result = result.filter((subject) => {
        const subjectValue = subject[field];
        const fieldValue =
          subjectValue !== null && subjectValue !== undefined
            ? String(subjectValue).toLowerCase()
            : "";
        return fieldValue.includes(value.toLowerCase());
      });
    }

    result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === "subjectCreated") {
        const timestampA = new Date(aVal).getTime();
        const timestampB = new Date(bVal).getTime();
        return ascending ? timestampA - timestampB : timestampB - timestampA;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return ascending ? aVal - bVal : bVal - aVal;
    });

    setFilteredSubjects(result);
    setCurrentPage(1);
    setNoResults(result.length === 0);
  };

  const paginate = (data) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  const paginatedSubjects = paginate(filteredSubjects);

  const handleSubjectClick = async (subject) => {
    setModalLoading(true);
    try {
      const detailedSubject = await apiService.getSubjetDetail(subject.subjectId);
      setSelectedSubject(detailedSubject);
    } catch (error) {
      console.error("Error al obtener el detalle del sujeto:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedSubject(null);
  };

  const openCreateSubjectModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateSubjectModal = () => {
    setShowCreateModal(false);
  };

  const handleSubjectCreated = async () => {
    const data = await apiService.getSubjectList();
    setSubjects(data);
    setFilteredSubjects(data);
  };

  const handleCSVImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await subjectService.importSubjectsCSV(file);
      alert("CSV importado correctamente");
      const updatedList = await apiService.getSubjectList();
      setSubjects(updatedList);
      setFilteredSubjects(updatedList);
    } catch (error) {
      console.error("Error al importar CSV:", error);
      alert("Error al importar CSV");
    }
  };

  return (
    <Layout>
      <div className="card">
        <h2>Sujetos Registrados</h2>

        <div className="subjects-toolbar">
          <Tooltip title="Crear nuevo sujeto">
            <IconButton onClick={openCreateSubjectModal}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Importar CSV">
            <IconButton component="label">
              <UploadFileIcon />
              <input type="file" accept=".csv" hidden onChange={handleCSVImport} />
            </IconButton>
          </Tooltip>
        </div>

        <TableFilter fields={fields} onFilter={handleFilterChange} />

        <table className="subjects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Token</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noResults ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "red" }}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              paginatedSubjects.map((subject) => (
                <tr key={subject.subjectId}>
                  <td>{subject.subjectId}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.subjectEmail}</td>
                  <td>{subject.subjectMobile}</td>
                  <td>{subject.subjectToken}</td>
                  <td>{new Date(subject.subjectCreated).toLocaleString()}</td>
                  <td>
                    <button onClick={() => handleSubjectClick(subject)}>Ver</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!noResults && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE) }, (_, i) => (
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

      {selectedSubject && (
        <SubjectDetailModal
          open={!!selectedSubject}
          onClose={closeModal}
          subject={selectedSubject}
          loading={modalLoading}
        />
      )}

      {showCreateModal && (
        <SubjectCreateModal
          open={showCreateModal}
          onClose={closeCreateSubjectModal}
          onCreated={handleSubjectCreated}
        />
      )}
    </Layout>
  );
}

export default Subjects;
