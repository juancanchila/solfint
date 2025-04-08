// src/models/UserModel.js
class UserModel {
    constructor(data) {
      this.id = data.id;
      this.username = data.username;
      this.email = data.email;
      this.password = data.password;
      this.clientId = data.clientId;
      this.isIdentityValidated = data.isIdentityValidated;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.client = data.client ? {
        id: data.client.id,
        name: data.client.name,
        parentClientId: data.client.parentClientId,
        createdAt: data.client.createdAt,
        updatedAt: data.client.updatedAt,
      } : null;

      this.roles = Array.isArray(data.roles) ? data.roles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        userRole: role.UserRoles
      })) : [];

      this.otps = Array.isArray(data.otps) ? data.otps.map(otp => ({
        id: otp.id,
        userId: otp.userId,
        otpCodeHash: otp.otpCodeHash,
        isValidated: otp.isValidated,
        validatedAt: otp.validatedAt,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt,
        updatedAt: otp.updatedAt
      })) : [];
    }
  }

  export default UserModel;
