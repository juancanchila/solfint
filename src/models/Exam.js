class Exam {
    constructor(data) {
      Object.assign(this, data);
    }

    get summary() {
      return `${this.examName} - Resultado: ${this.examResult1}, ${this.examResult2}, ${this.examResult3}`;
    }
  }

  export default Exam;
