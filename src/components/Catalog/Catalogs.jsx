import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout/Layout";
import apiService from "../../services/apiService";
import CatalogDetailModal from "./CatalogDetailModal";
import CatalogUpdate from "./CatalogUpdate";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import "./Catalogs.css";
import translateService from "../../services/translateService";

function Catalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCatalogDetail, setSelectedCatalogDetail] = useState(null);
  const [selectedCatalogEdit, setSelectedCatalogEdit] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const data = await apiService.getCatalogList();
        console.log(data);
        setCatalogs(data);
      } catch (error) {
        console.error("Error al obtener los catálogos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  const handleDetailClick = (catalog) => {
    setSelectedCatalogDetail(catalog);
  };

  const handleEditClick = (event, catalog) => {
    event.stopPropagation();
    setSelectedCatalogEdit(catalog);
  };

  const closeDetailModal = () => {
    setSelectedCatalogDetail(null);
  };

  const closeEditModal = () => {
    setSelectedCatalogEdit(null);
  };

  const handleCatalogUpdated = async (updatedCatalog) => {
    console.log(updatedCatalog, "ready to update");
    setModalLoading(true);

    try {
      // Si translationId es null, se crea una nueva traducción
      if (updatedCatalog.translationId === null) {
        await translateService.createTranslation({
          original: updatedCatalog.original,
          translated: updatedCatalog.examName,
        });
        console.log("Traducción creada con éxito");
      } else {
        // Si hay un translationId, se actualiza la traducción existente
        await translateService.updateTranslation(updatedCatalog.translationId, {
          original: updatedCatalog.original,
          translated: updatedCatalog.examName,
        });
        console.log("Traducción actualizada con éxito");
      }

      // Refrescar la lista de catálogos
      const refreshedCatalogs = await apiService.getCatalogList();
      setCatalogs(refreshedCatalogs);
    } catch (error) {
      console.error("Error al actualizar el catálogo:", error);
    } finally {
      setModalLoading(false);
      closeEditModal();
    }
  };

  return (
    <Layout>
      <h1>Gestión de Catálogos</h1>
      <p>Este es el contenido de la página de catálogos.</p>
      <hr />
      <h3>Listado de catálogos</h3>

      {loading ? (
        <p>Cargando catálogos...</p>
      ) : catalogs.length > 0 ? (
        <div className="catalog-list">
          {catalogs.map((catalog, index) => (
            <div
              key={index}
              className="catalog-item"
              onClick={() => handleDetailClick(catalog)}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>{catalog.examName}</h2>
                <IconButton onClick={(e) => handleEditClick(e, catalog)}>
                  <EditIcon />
                </IconButton>
              </div>
              <p>
                <strong>Idioma:</strong> {catalog.examLocale}
              </p>
              <p>
                <strong>Customer ID:</strong> {catalog.customerId}
              </p>
              <p>
                <strong>Template ID:</strong> {catalog.templateId}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron catálogos.</p>
      )}

      {selectedCatalogDetail && (
        <CatalogDetailModal
          catalog={selectedCatalogDetail}
          onClose={closeDetailModal}
          onUpdate={handleCatalogUpdated}
          loading={modalLoading}
        />
      )}

      <Dialog
        open={Boolean(selectedCatalogEdit)}
        onClose={closeEditModal}
        maxWidth="sm"
        fullWidth
      >
        {modalLoading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <CircularProgress />
            <p>Guardando cambios...</p>
          </div>
        ) : (
          selectedCatalogEdit && (
            <CatalogUpdate
              catalog={selectedCatalogEdit}
              onClose={closeEditModal}
              onUpdate={handleCatalogUpdated}
            />
          )
        )}
      </Dialog>
    </Layout>
  );
}

export default Catalogs;
