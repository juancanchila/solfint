// src/models/Log.js

class Log {
    constructor(data) {
      Object.assign(this, data);
    }

    get summary() {
      return `Acción: ${this.accion} - Tipo: ${this.objectType} - ID del objeto: ${this.objectId}`;
    }
  }

  export default Log;
