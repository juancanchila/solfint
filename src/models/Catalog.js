class Catalog {
    constructor({
      customerId,
      examLocale,
      examName,
      templateId,
      translationId,
      original
    }) {
      this.customerId = customerId;
      this.examLocale = examLocale;
      this.examName = examName;
      this.templateId = templateId;
      this.translationId = translationId;
      this.original = original;
    }

    // Método getter de ejemplo para mostrar información resumida
    get summary() {
      return `${this.examName} (${this.examLocale}) - Template ID: ${this.templateId}`;
    }
  }

  export default Catalog;
