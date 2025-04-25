import axios from "axios";
import Translate from "../models/Translate"; // Asegúrate de tener este modelo

const API_URL = "http://161.35.233.204:3000";
const TRANSLATE_ENDPOINT = "/api/v1/translate";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const translateService = {
  // Obtener lista de traducciones
  getAllTranslations: async () => {
    try {
      const response = await axios.get(`${API_URL}${TRANSLATE_ENDPOINT}`, {
        headers: getAuthHeaders(),
      });

      const translations = response.data.map(
        (item) => new Translate(item)
      );
      return translations;
    } catch (error) {
      console.error("Error al obtener traducciones:", error);
      throw error;
    }
  },

  // Obtener una traducción por ID
  getTranslationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${TRANSLATE_ENDPOINT}/${id}`, {
        headers: getAuthHeaders(),
      });

      return new Translate(response.data);
    } catch (error) {
      console.error("Error al obtener la traducción:", error);
      throw error;
    }
  },

  // Crear una nueva traducción
  createTranslation: async (translationData) => {
    try {
      const response = await axios.post(
        `${API_URL}${TRANSLATE_ENDPOINT}`,
        translationData,
        { headers: getAuthHeaders() }
      );

      return new Translate(response.data);
    } catch (error) {
      console.error("Error al crear la traducción:", error);
      throw error;
    }
  },

  // Actualizar una traducción
  updateTranslation: async (id, translationData) => {
    console.log(id);
    console.log(translationData);
    try {
      const response = await axios.put(
        `${API_URL}${TRANSLATE_ENDPOINT}/${id}`,
        translationData,
        { headers: getAuthHeaders() }
      );

      return new Translate(response.data);
    } catch (error) {
      console.error("Error al actualizar la traducción:", error);
      throw error;
    }
  },

  // Eliminar una traducción
  deleteTranslation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}${TRANSLATE_ENDPOINT}/${id}`, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error al eliminar la traducción:", error);
      throw error;
    }
  },
};

export default translateService;
