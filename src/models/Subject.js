class Subject {
  constructor({
    customerId,
    subjectCreated,
    subjectEmail,
    subjectId,
    subjectMobile,
    subjectModified,
    subjectName,
    subjectPhoto,
    subjectToken,
    clientId,      // Agregar clientId
    areaId,        // Agregar areaId
    // Nuevos campos agregados
    subjectNameFromAPI,
    subjectEmailFromAPI,
    subjectMobileFromAPI,
    subjectCreatedFromAPI,
    subjectModifiedFromAPI,
  }) {
    this.customerId = customerId;
    this.subjectCreated = subjectCreated;
    this.subjectEmail = subjectEmail;
    this.subjectId = subjectId;
    this.subjectMobile = subjectMobile;
    this.subjectModified = subjectModified;
    this.subjectName = subjectName;
    this.subjectPhoto = subjectPhoto;
    this.subjectToken = subjectToken;

    // Agregar clientId y areaId
    this.clientId = clientId;
    this.areaId = areaId;

    // Nuevos campos recibidos de la API (solo si no son undefined)
    this.subjectNameFromAPI = subjectNameFromAPI || null;
    this.subjectEmailFromAPI = subjectEmailFromAPI || null;
    this.subjectMobileFromAPI = subjectMobileFromAPI || null;
    this.subjectCreatedFromAPI = subjectCreatedFromAPI || null;
    this.subjectModifiedFromAPI = subjectModifiedFromAPI || null;
  }

  // Método getter de ejemplo para combinar información básica
  get fullInfo() {
    return `${this.subjectName} - Email: ${this.subjectEmail}, Mobile: ${this.subjectMobile}`;
  }

  // Método que devuelve la información completa de la API si está disponible
  get fullInfoFromAPI() {
    return `${this.subjectNameFromAPI || 'No name'} - Email: ${this.subjectEmailFromAPI || 'No email'}, Mobile: ${this.subjectMobileFromAPI || 'No mobile'}`;
  }

  // Método para combinar la información de la base de datos y la API
  get combinedInfo() {
    return {
      subjectName: this.subjectNameFromAPI || this.subjectName,
      subjectEmail: this.subjectEmailFromAPI || this.subjectEmail,
      subjectMobile: this.subjectMobileFromAPI || this.subjectMobile,
      subjectCreated: this.subjectCreatedFromAPI || this.subjectCreated,
      subjectModified: this.subjectModifiedFromAPI || this.subjectModified,
      clientId: this.clientId,   // Incluir clientId
      areaId: this.areaId,       // Incluir areaId
    };
  }
}

export default Subject;
