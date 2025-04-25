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
    subjectToken
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
  }

  // Método getter de ejemplo para combinar información básica
  get fullInfo() {
    return `${this.subjectName} - Email: ${this.subjectEmail}, Mobile: ${this.subjectMobile}`;
  }
}

export default Subject;