import axios from 'axios';
import Swal from 'sweetalert2';
import UserService from './userService';

const API_URL = 'http://161.35.233.204:3000';
const LOGIN_ENDPOINT = '/api/v1/login';
const VITE_VERIFY = '/api/v1/login/verify';
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
        localStorage.setItem('userId', user.userId);
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

    localStorage.clear();
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
       AuthService.logout();
      console.error('Token inválido o expirado', error);
      return false;
    }
  }

  static async verifyCode(code) {
    console.log(code);


    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      throw new Error('Token o ID de usuario faltante');
    }



    try {
      const user = await UserService.getUserById(userId);

      if (!user || !user.phone) {
        throw new Error('No se encontró el número de teléfono del usuario');
      }

      const response = await axios.post(`${API_URL}${VITE_VERIFY}`, {
        code,
        to: user.phone,
        token
      });

      console.log( code, 'dentro del try');

      if (response.data.token) {
        console.log('Almacenando');
        localStorage.setItem('auth_token', response.data.token); // ✅ corrección
        localStorage.setItem('isVerified', true);
        return true;
      }

    } catch (error) {
      console.error('Error verificando código:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Error al verificar el código');
    }
  }

  static async recoverPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/login/reset-password`, {
        email
      });

      const data = response.data;

      if (data.token) {
        console.log('Almacenando');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('phone', data.phone_last4);
        localStorage.setItem('isreset', true);
        return true;
      }else{
        return false;
      }


    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'No se pudo procesar la solicitud');
    }
  }

}
