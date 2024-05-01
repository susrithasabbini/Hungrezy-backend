import express from "express";
import {
  verificationController,
  authController,
} from "../controllers/index.js";
import * as validations from "../middleware/validations/authValidation.js";

const initAuthRoutes = () => {
  const authRoutes = express.Router();

  authRoutes.post("/refresh-token", authController.refresh_Token);
  authRoutes.post(
    "/signin-otp/send-verification-code",
    validations.signinSendOtp,
    authController.signinSendOtp
  );
  authRoutes.post(
    "/signin-otp/verify-code",
    validations.signinVerifyOtp,
    authController.signinVerifyOtp
  );

  /**
   * @swagger
   * tags:
   *  - name: Auth
   */

  /**
   * @swagger
   * /api/auth/send-verification-code:
   *   post:
   *     summary: Send verification code
   *     description: Send verification code
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the user
   *               user_role:
   *                 description: User role
   *                 type: string
   *                 enum:
   *                   - user
   *                   - restaurant
   *                 example: user
   *                 x-enum-descriptions:
   *                   user: A regular user.
   *                   restaurant: A restaurant owner or manager.
   *     responses:
   *       '200':
   *         description: Verification code sent successfully
   *       '400':
   *         description: Bad request or missing email
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   */

  authRoutes.post(
    "/send-verification-code",
    verificationController.sendVerificationCode
  );

  /**
   * @swagger
   * /api/auth/verify-code:
   *   post:
   *     summary: Verify code
   *     description: Verify code
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the user
   *               verificationCode:
   *                 type: string
   *                 description: Verification code
   *               user_role:
   *                 type: string
   *                 description: User role
   *     responses:
   *       '200':
   *         description: Verification successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Success message
   *                 token:
   *                   type: string
   *                   description: Access token
   *       '400':
   *         description: Bad request or missing email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message
   */

  authRoutes.post("/verify-code", verificationController.verifyCode);

  /**
   * @swagger
   * /api/auth/user/signup:
   *   post:
   *     summary: User Signup
   *     description: User signup
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the user
   *               password:
   *                 type: string
   *                 description: Password of the user
   *               firstName:
   *                type: string
   *                description: First name of the user
   *               lastName:
   *                type: string
   *                description: Last name of the user
   *               mobileNumber:
   *                type: string
   *                description: Mobile number of the user
   *               accessToken:
   *                type: string
   *                description: Access token
   *     responses:
   *      '200':
   *        description: User login successfully
   *
   *      '400':
   *         description: Bad request or missing email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *
   *      '500':
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                error:
   *                  type: string
   *                  description: Error message
   *
   */

  authRoutes.post("/user/signup", validations.signup, authController.signup);

  /**
   * @swagger
   * /api/auth/restaurant/signup:
   *   post:
   *     summary: Restaurant Signup
   *     description: Restaurant signup
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the Restaurant
   *               password:
   *                 type: string
   *                 description: Password of the Restaurant
   *               name:
   *                type: string
   *                description: Name of the Restaurant
   *               accessToken:
   *                type: string
   *                description: Access token
   *     responses:
   *      '200':
   *        description: Restaurant login successfully
   *
   *      '400':
   *         description: Bad request or missing email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *
   *      '500':
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                error:
   *                  type: string
   *                  description: Error message
   *
   */
  authRoutes.post(
    "/restaurant/signup",
    validations.restaurantSignup,
    authController.restaurantSignup
  );
  authRoutes.post(
    "/admin/signup",
    validations.adminSignup,
    authController.adminSignup
  );

  /**
   * @swagger
   * /api/auth/user/signin:
   *   post:
   *     summary: User login
   *     description: User login
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the user
   *               password:
   *                 type: string
   *                 description: Password of the user
   *     responses:
   *      '200':
   *        description: User login successfully
   *
   *      '400':
   *         description: Bad request or missing email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *
   *      '500':
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                error:
   *                  type: string
   *                  description: Error message
   *
   */
  authRoutes.post("/user/signin", validations.signin, authController.signin);

  /**
   * @swagger
   * /api/auth/restaurant/signin:
   *   post:
   *     summary: Restaurant login
   *     description: Restaurant login
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the restaurant
   *               password:
   *                 type: string
   *                 description: Password of the restaurant
   *     responses:
   *      '200':
   *        description: Restaurant login successfully
   *
   *      '400':
   *         description: Bad request or missing email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *
   *      '500':
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                error:
   *                  type: string
   *                  description: Error message
   *
   */

  authRoutes.post(
    "/restaurant/signin",
    validations.restaurantSignin,
    authController.restaurantSignin
  );

  /**
   * @swagger
   * /api/auth/admin/signin:
   *   post:
   *     summary: Admin login
   *     description: Admin login
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email of the admin
   *               password:
   *                 type: string
   *                 description: Password of the admin
   *     responses:
   *      '200':
   *        description: Admin login successfully
   *
   *      '400':
   *         description: Bad request or missing email/password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Error message
   *
   *      '500':
   *        description: Internal server error
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                error:
   *                  type: string
   *                  description: Error message
   *
   */

  authRoutes.post(
    "/admin/signin",
    validations.adminSignin,
    authController.adminSignin
  );

  return authRoutes;
};

export default initAuthRoutes;
