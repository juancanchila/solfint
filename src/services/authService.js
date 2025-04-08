import axios from 'axios';
import Swal from 'sweetalert2';


const API_URL = 'http://161.35.233.204:3000';
const LOGIN_ENDPOINT = '/api/v1/login';
const VITE_VERIFY = '/api/v1/verify';
const VITE_VALIDATE = '/api/v1/login/validate';


export class AuthService {
  static async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}${LOGIN_ENDPOINT}`, {
        username,
        password
      });

      const user = response.data;
      if (user.token) {
        console.log('Almacenando');
        localStorage.setItem('auth_token', user.token);
        localStorage.setItem('isVerified', user.isVerified);
        localStorage.setItem('userId', user.userid);
        // Asegúrate de que haya al menos un rol en el array
  if (user.role && user.role.length > 0) {
    localStorage.setItem('role', user.role[0].name);
  } else {
    localStorage.setItem('role', 'sin rol'); // o deja vacío
  }
      }
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  }

  static logout() {

    localStorage.removeItem('auth_token');
    localStorage.removeItem('isVerified');
  }

  static isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  static async validateToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const response = await axios.post(`${API_URL}${VITE_VALIDATE}`, {
        token: token // 🔥 Aquí va el token en el body
      });

      return response.status === 200;
    } catch (error) {
      console.error('Token inválido o expirado', error);
      return false;
    }
  }
}
