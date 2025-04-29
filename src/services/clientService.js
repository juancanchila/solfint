import axios from 'axios';

const API_URL = 'http://161.35.233.204:3000';
const CLIENTS_ENDPOINT = '/api/v1/clients';
const COSST_ENDPOINT = '/api/v1/cost';
const AREAS_ENDPOINT = '/api/v1/areas';
const LICENCE_ENDPOINT = '/api/v1/licenses';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const ClientService = {
  // ---------- CLIENTES ----------
  getClients: async () => {
    try {
      const response = await axios.get(`${API_URL}${CLIENTS_ENDPOINT}`, {
        headers: getAuthHeaders(),
      });
      const filteredClients = response.data.filter(client => client.id !== 1);
      return filteredClients;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw error;
    }
  },

  getClientById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${CLIENTS_ENDPOINT}/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el cliente ${id}:`, error);
      throw error;
    }
  },

  addClient: async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}${CLIENTS_ENDPOINT}`, clientData, {
        headers: getAuthHeaders(),
      });

      localStorage.setItem('created_client',response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error al agregar cliente:', error.response?.data || error);
      throw error;
    }
  },

  updateClient: async (id, updatedData) => {
    try {
      const payload = {};
      for (const key of Object.keys(updatedData)) {
        if (updatedData[key] !== undefined) {
          payload[key] = updatedData[key];
        }
      }

      if (Object.keys(payload).length === 0) return null;

      const response = await axios.put(`${API_URL}${CLIENTS_ENDPOINT}/${id}`, payload, {
        headers: getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error al actualizar cliente:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}${CLIENTS_ENDPOINT}/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cliente:', error.response?.data || error);
      throw error;
    }
  },

  // ---------- ÁREAS ----------
  getAreas: async (clientId) => {
    try {
      const res = await axios.get(`${API_URL}${AREAS_ENDPOINT}/${clientId}`, {
        headers: getAuthHeaders(),  // Se asume que esta función te devuelve los headers necesarios para autenticación
      });
      return res.data;
    } catch (error) {
      console.error('Error al obtener áreas:', error);
      throw error;
    }
  },

  addArea: async (clientId, areaData) => {
    try {
      const res = await axios.post(`${API_URL}${AREAS_ENDPOINT}/${clientId}`, areaData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al agregar área:', error);
      throw error;
    }
  },

  updateArea: async (clientId, areaId, areaData) => {
    try {
      const res = await axios.put(`${API_URL}${AREAS_ENDPOINT}/${clientId}/${areaId}`, areaData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al actualizar área:', error);
      throw error;
    }
  },

  deleteArea: async (clientId, areaId) => {
    try {
      const res = await axios.delete(`${API_URL}${AREAS_ENDPOINT}/${clientId}/${areaId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al eliminar área:', error);
      throw error;
    }
  },

  // ---------- LICENCIAS ----------
  getLicenses: async (clientId) => {
    try {
      const res = await axios.get(`${API_URL}${LICENCE_ENDPOINT}/${clientId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al obtener licencias:', error);
      throw error;
    }
  },

  addLicencia: async (clientId, licenciaData) => {
    try {
      const res = await axios.post(`${API_URL}${CLIENTS_ENDPOINT}/${clientId}/licencias`, licenciaData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al agregar licencia:', error);
      throw error;
    }
  },

  updateLicencia: async (clientId, licenciaId, licenciaData) => {
    try {
      const res = await axios.put(`${API_URL}${CLIENTS_ENDPOINT}/${clientId}/licencias/${licenciaId}`, licenciaData, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al actualizar licencia:', error);
      throw error;
    }
  },

  deleteLicencia: async (clientId, licenciaId) => {
    try {
      const res = await axios.delete(`${API_URL}${CLIENTS_ENDPOINT}/${clientId}/licencias/${licenciaId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al eliminar licencia:', error);
      throw error;
    }
  },

  // ---------- CENTROS DE COSTO ----------
  getCostCenters: async (clientId) => {
    try {
      const res = await axios.get(`${API_URL}${COSST_ENDPOINT}/${clientId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al obtener centros de costo:', error);
      throw error;
    }
  },

  addCostCenter: async (clientId, data) => {
    try {
      const res = await axios.post(`${API_URL}${COSST_ENDPOINT}/${clientId}`, data, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al agregar centro de costo:', error);
      throw error;
    }
  },

  updateCostCenter: async (clientId, costId, data) => {
    try {
      const res = await axios.put(`${API_URL}${COSST_ENDPOINT}/${clientId}/${costId}`, data, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al actualizar centro de costo:', error);
      throw error;
    }
  },

  deleteCostCenter: async (clientId, costId) => {
    try {
      const res = await axios.delete(`${API_URL}${COSST_ENDPOINT}/${clientId}/${costId}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error('Error al eliminar centro de costo:', error);
      throw error;
    }
  },
};

export default ClientService;
