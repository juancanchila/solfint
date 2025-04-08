class ValidateResponse {
    constructor(response) {
      this.verified = response.user.verified;
    }
  }

  export default ValidateResponse;
