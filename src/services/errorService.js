import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ErrorService {
  handle(error) {
    console.error('Error capturado:', error);

    // Mostrar popup con el mensaje de error
    toast.error(error.response?.data?.message || 'Ocurrió un error inesperado');

    // Redirigir al login si es un error de autenticación (401 o 403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Ocurrió un error. Será redirigido al login.');

    localStorage.clear();
      window.location.href = '/login';
    }
  }
}

export default new ErrorService();
