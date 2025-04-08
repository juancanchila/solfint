import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../config/apiConfig';
import axios from 'axios';

class HttpService {
  async request(url, method, data = null, Model) {
    try {
      const response = await axios({
        url: `${apiClient.baseURL}${url}`,
        method,
        data,
        headers: { ...apiClient.headers, ...apiClient.getAuthHeaders() },
      });
      return new Model(response.data);
    } catch (error) {
      console.error('HTTP Error:', error);
      toast.error(error.response?.data?.message || 'Ocurrió un error inesperado');

      // Redirigir al login si es un error de autenticación (401 o 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Ocurrió un error. Será redirigido al login.');
        window.location.href = '/login';
      }
      throw error;
    }
  }

  get(url, Model) {
    return this.request(url, 'GET', null, Model);
  }

  post(url, data, Model) {
    return this.request(url, 'POST', data, Model);
  }

  put(url, data, Model) {
    return this.request(url, 'PUT', data, Model);
  }

  delete(url, Model) {
    return this.request(url, 'DELETE', null, Model);
  }
}

export default new HttpService();
