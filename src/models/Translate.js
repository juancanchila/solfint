class Translate {
    constructor(data) {
      Object.assign(this, data);
    }

    get summary() {
      return `Key: ${this.key} | Value: ${this.value} | Lang: ${this.lang}`;
    }
  }

  export default Translate;
