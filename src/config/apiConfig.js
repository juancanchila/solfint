const apiConfig = {
    baseURL: 'http://161.35.233.204:3000/', // Usa la variable de entorno o una URL por defecto
    timeout: 10000, // Tiempo máximo de espera en ms
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    getAuthHeaders: () => {
      const token = localStorage.getItem('authToken'); // Recupera el token si está almacenado
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  };

  export default apiConfig;
