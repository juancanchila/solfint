// src/services/alertService.js

const alertService = {
    confirmAlert: ({ message = 'Algo salió mal', type = 'info' }) => {
        console.log(type);
      // Aquí puedes hacer que el mensaje tenga formato bonito si quieres
      window.alert(message); // o reemplazar por un modal custom si usas una librería
    }
  };

  export default alertService;
