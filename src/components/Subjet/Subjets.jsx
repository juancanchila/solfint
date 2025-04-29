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
  const [catalogList, setCatalogList] = useState([]); // Catalogo de Exámenes
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
        setCatalogList(catalog); // Asigna el catálogo obtenido
      } catch (error) {
        console.error("Error al obtener el catálogo de exámenes:", error);
      }
    };

    fetchSubjects();
    fetchCatalogList(); // Llama para obtener los datos del catálogo de exámenes
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

    if (file.size > 1024 * 100) {
      console.error("El archivo excede el tamaño máximo permitido (100 KB).");
      return;
    }

    try {
      const jsonSubjects = await subjectService.parseCSVFile(file);
      console.log("Sujetos extraídos del CSV:", jsonSubjects);
    } catch (error) {
      console.error("Error al procesar el archivo CSV:", error.message);
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Gestión de Evaluados</h1>
        <div>
          <Tooltip title="Importar Sujetos CSV">
            <IconButton color="secondary" component="label">
              <UploadFileIcon sx={{ fontSize: 28 }} />
              <input type="file" accept=".csv" hidden onChange={handleCSVImport} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Agregar Sujeto">
            <IconButton color="primary" onClick={openCreateSubjectModal}>
              <AddCircleOutlineIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <p>Este es el contenido de la página de Evaluados.</p>
      <hr />
      <h3>Listado de Evaluados</h3>

      <TableFilter fields={fields} onFilter={handleFilterChange} />

      {loading ? (
        <p>Cargando Evaluados...</p>
      ) : noResults ? (
        <p>No se encontraron evaluados con los criterios de búsqueda.</p>
      ) : (
        <>
          <ul className="subject-list">
            {paginatedSubjects.map((subject) => (
              <li key={subject.subjectId} className="subject-item" onClick={() => handleSubjectClick(subject)}>
                <h2>{subject.subjectName}</h2>
                <p><strong>Email:</strong> {subject.subjectEmail}</p>
                <p><strong>Móvil:</strong> {subject.subjectMobile}</p>
                <p><strong>Token:</strong> {subject.subjectToken}</p>
                <p><strong>Creado:</strong> {new Date(subject.subjectCreated).toLocaleString()}</p>
              </li>
            ))}
          </ul>

          {filteredSubjects.length > ITEMS_PER_PAGE && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE) }, (_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedSubject && (
        <SubjectDetailModal subject={selectedSubject} onClose={closeModal} loading={modalLoading} catalogList={catalogList} />
      )}

      {showCreateModal && (
        <SubjectCreateModal onClose={closeCreateSubjectModal} onSubjectCreated={handleSubjectCreated} />
      )}
    </Layout>
  );
}

export default Subjects;
