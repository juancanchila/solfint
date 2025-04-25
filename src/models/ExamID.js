class ExamID {
    constructor({
      customerId,
      customerName,
      dataQuality,
      examErrors,
      examFace1,
      examFace1TS,
      examFace2,
      examFace2TS,
      examFace3,
      examFace3TS,
      examFace4,
      examFace4TS,
      examId,
      examLocale,
      examModel,
      examName,
      examQuestions,
      examQueued,
      examResult1,
      examResult2,
      examResult3,
      examScore1,
      examScore2,
      examScore3,
      examScore4,
      examScored,
      examStart,
      examTimeouts,
      examTopic,
      subjectId,
      templateId,
      templateType
    }) {
      this.customerId = customerId;
      this.customerName = customerName;
      this.dataQuality = dataQuality;
      this.examErrors = examErrors;
      this.examFace1 = examFace1;
      this.examFace1TS = examFace1TS;
      this.examFace2 = examFace2;
      this.examFace2TS = examFace2TS;
      this.examFace3 = examFace3;
      this.examFace3TS = examFace3TS;
      this.examFace4 = examFace4;
      this.examFace4TS = examFace4TS;
      this.examId = examId;
      this.examLocale = examLocale;
      this.examModel = examModel;
      this.examName = examName;
      this.examQuestions = examQuestions;
      this.examQueued = examQueued;
      this.examResult1 = examResult1;
      this.examResult2 = examResult2;
      this.examResult3 = examResult3;
      this.examScore1 = examScore1;
      this.examScore2 = examScore2;
      this.examScore3 = examScore3;
      this.examScore4 = examScore4;
      this.examScored = examScored;
      this.examStart = examStart;
      this.examTimeouts = examTimeouts;
      this.examTopic = examTopic;
      this.subjectId = subjectId;
      this.templateId = templateId;
      this.templateType = templateType;
    }

    get summary() {
      return `${this.examName} - Resultados: ${this.examResult1}, ${this.examResult2}, ${this.examResult3}`;
    }

    get mainScores() {
      return [this.examScore1, this.examScore2, this.examScore3].filter(Boolean);
    }

    get base64Faces() {
      return [this.examFace1, this.examFace2, this.examFace3, this.examFace4].filter(Boolean);
    }
  }

  export default ExamID;
