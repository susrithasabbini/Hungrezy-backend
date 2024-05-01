import {
  sendVerificationCode,
  verifyCode,
  signup,
} from "../controllers/authController.js";
import { UserVerification } from "../models/index.js";
import { passwordUtils, authUtils } from "../utils/index.js";

// Mock request and response objects
const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock data for testing
const mockUser = {
  email: "test@example.com",
  password: "testPassword",
  firstName: "Test",
  lastName: "User",
  mobileNumber: "1234567890",
};

// Mock UserVerification model methods
jest.mock("../models", () => ({
  UserVerification: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));

// Mock passwordUtils.generateRandomOTP
jest.mock("../utils", () => ({
  passwordUtils: {
    generateRandomOTP: jest.fn().mockReturnValue("123456"), // Mocked OTP
    hashPassword: jest.fn(),
  },
  authUtils: {
    generateAccessToken: jest.fn(),
  },
}));

// Mock authUtils.verifyJWT
jest.mock("../utils/authUtils", () => ({
  verifyJWT: jest.fn(),
}));

describe("Authentication Controller", () => {
  describe("sendVerificationCode", () => {
    it("should send a verification code successfully", async () => {
      const req = mockRequest({ email: mockUser.email, user_role: "user" });
      const res = mockResponse();

      // Mock UserVerification.findOne to return null (user not found)
      UserVerification.findOne.mockResolvedValueOnce(null);

      await sendVerificationCode(req, res);

      expect(UserVerification.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
        user_role: "user",
      });
      expect(UserVerification.save).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Verification code sent successfully.",
      });
    });

    it("should handle internal server error", async () => {
      const req = mockRequest({ email: mockUser.email, user_role: "user" });
      const res = mockResponse();

      // Mock UserVerification.findOne to throw an error
      UserVerification.findOne.mockRejectedValueOnce("Error");

      await sendVerificationCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("verifyCode", () => {
    it("should verify the code successfully", async () => {
      const req = mockRequest({
        email: mockUser.email,
        verificationCode: "123456",
        user_role: "user",
      });
      const res = mockResponse();

      // Mock UserVerification.findOne to return userVerification
      UserVerification.findOne.mockResolvedValueOnce({
        email: mockUser.email,
        otp: "123456",
      });

      // Mock authUtils.generateAccessToken
      authUtils.generateAccessToken.mockResolvedValueOnce("mockAccessToken");

      await verifyCode(req, res);

      expect(UserVerification.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
        user_role: "user",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Verification successful!",
        token: "mockAccessToken",
      });
    });

    it("should handle invalid verification code", async () => {
      const req = mockRequest({
        email: mockUser.email,
        verificationCode: "654321",
        user_role: "user",
      });
      const res = mockResponse();

      // Mock UserVerification.findOne to return userVerification with different otp
      UserVerification.findOne.mockResolvedValueOnce({
        email: mockUser.email,
        otp: "123456",
      });

      await verifyCode(req, res);

      expect(UserVerification.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
        user_role: "user",
      });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid verification code.",
      });
    });

    it("should handle internal server error", async () => {
      const req = mockRequest({
        email: mockUser.email,
        verificationCode: "123456",
        user_role: "user",
      });
      const res = mockResponse();

      // Mock UserVerification.findOne to throw an error
      UserVerification.findOne.mockRejectedValueOnce("Error");

      await verifyCode(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("signup", () => {
    it("should sign up a new user successfully", async () => {
      const req = mockRequest(mockUser);
      const res = mockResponse();

      // Mock authUtils.verifyJWT to return mock decode
      authUtils.verifyJWT.mockResolvedValueOnce("mockDecode");

      // Mock passwordUtils.hashPassword
      passwordUtils.hashPassword.mockResolvedValueOnce("hashedPassword");

      // Mock User.save
      User.prototype.save = jest.fn();

      // Mock authUtils.generateAccessToken
      authUtils.generateAccessToken.mockResolvedValueOnce("mockAccessToken");

      // Mock authUtils.generateRefreshToken
      authUtils.generateRefreshToken.mockResolvedValueOnce("mockRefreshToken");

      const result = await signup(req.body);

      expect(result.status).toBe(200);
      expect(result.message).toBe("Sign up successfull!");
      expect(result.token.accessToken).toBeDefined();
      expect(result.token.refreshToken).toBeDefined();
      expect(result.token.user.email).toEqual(mockUser.email);
    });

    it("should handle signup failure", async () => {
      const req = mockRequest(mockUser);
      const res = mockResponse();

      // Mock authUtils.verifyJWT to return null
      authUtils.verifyJWT.mockResolvedValueOnce(null);

      const result = await signup(req.body);

      expect(result.message).toBe("Signup failed! Please try again.");
      expect(result.status).toBe(400);
    });
  });
});
