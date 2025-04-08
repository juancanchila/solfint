// src/services/clientService.js
import axios from 'axios';

const API_URL = 'http://161.35.233.204:3000';
const CLIENTS_ENDPOINT = '/api/v1/clients';

const ClientService = {
  getClients: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}${CLIENTS_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw error;
    }
  },

  addClient: async (clientData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_URL}${CLIENTS_ENDPOINT}`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar cliente:', error.response?.data || error);
      throw error;
    }
  },
  deleteClient: async (clientId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.delete(`${API_URL}${CLIENTS_ENDPOINT}/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cliente:', error.response?.data || error);
      throw error;
    }
  },
};

export default ClientService;
