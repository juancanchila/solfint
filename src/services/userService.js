import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const USER_BY_ID_ENDPOINT = import.meta.env.VITE_USER_BY_ID_ENDPOINT;
const ROLES_ENDPOINT = '/api/v1/roles';
const USERS_ENDPOINT = '/api/v1/users';

const UserService = {
  getUserById: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}${USER_BY_ID_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}${USERS_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  getRoles: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}${ROLES_ENDPOINT}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data,'ROles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  },
  addUser: async (userData) => {
    console.log("Almacenando");
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(`${API_URL}${USERS_ENDPOINT}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Usuario creado exitosamente
      const createdUser = response.data;

      return createdUser;
    } catch (error) {
      console.error('Error al agregar usuario:', error.response?.data || error.message);

      // Mostrar alerta de error
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.delete(`${API_URL}${USERS_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
      throw error;
    }
  },
  updateUser: async (id, updatedData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const payload = {};

      // Construir payload solo con campos definidos en updatedData
      for (const key of Object.keys(updatedData)) {
        if (Object.hasOwn(updatedData, key) && updatedData[key] !== undefined) {
          payload[key] = updatedData[key];
        }
      }

      // Si no hay nada que actualizar, retornamos null
      if (Object.keys(payload).length === 0) {
        console.log('No hay campos para actualizar.');
        return null;
      }

      const response = await axios.put(
        `${API_URL}${USERS_ENDPOINT}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error.response?.data || error.message);
      throw error;
    }
  }

};


export default UserService;
