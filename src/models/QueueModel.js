class QueueModel {
    constructor({
      customerId,
      examId,
      examLocale,
      examQueued,
      examStatus,
      examStep,
      examUrl,
      subjectId,
      templateId
    }) {
      this.customerId = customerId;
      this.examId = examId;
      this.examLocale = examLocale;
      this.examQueued = examQueued;
      this.examStatus = examStatus;
      this.examStep = examStep;
      this.examUrl = examUrl;
      this.subjectId = subjectId;
      this.templateId = templateId;
    }

    get summary() {
      return `Examen ${this.examId} para ${this.customerId} (${this.examLocale})`;
    }

    get examLink() {
      return this.examUrl;
    }

    get isCompleted() {
      return this.examStatus === "2";
    }
  }

  export default QueueModel;
