import express from "express";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { multerUploads } from "../middleware/multerMiddleware.js";
import { userController } from "../controllers/index.js";
import {
  isAdmin,
  isAuthorized,
  isUser,
} from "../middleware/permissionsMiddleware.js";
import * as validations from "../middleware/validations/userValidations.js";

const initUserRoutes = () => {
  const userRoutes = express.Router();

  /**
   * @swagger
   * /api/user:
   *   get:
   *     summary: Get all users
   *     description: Fetch all users from the database
   *     tags: [Users]
   *     security:
   *       - bearerAuth: [] # Requires authentication token
   *       - adminAuth: []  # Requires admin privileges
   *     responses:
   *       '200':
   *         description: Users fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   example: Users fetched successfully
   *                   description: Success message
   *                 data:
   *                   type: array
   *       '401':
   *         description: Unauthorized, authentication failed or insufficient privileges
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   */
  userRoutes.route("/").get(isAuthenticated, isAdmin, userController.getUsers);

  /**
   * @swagger
   * /api/user/all:
   *   post:
   *     summary: Get all users with filters
   *     description: Fetch all users from the database with optional filters
   *     tags: [Users]
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               date:
   *                 type: string
   *                 format: date
   *                 description: Filter users by creation date (YYYY-MM-DD)
   *               status:
   *                 type: string
   *                 enum: [active, inactive, all]
   *                 description: Filter users by status
   *     responses:
   *       '200':
   *         description: Users fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   example: Users fetched successfully
   *                   description: Success message
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   */
  userRoutes.route("/all").post(userController.getAllUsers);

  /**
   * @swagger
   * /api/user/count:
   *   get:
   *     summary: Get user count statistics
   *     description: Fetch statistics about the total number of users, active users, inactive users, and monthly user counts
   *     tags: [Users]
   *     responses:
   *       '200':
   *         description: User count statistics fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   example: Customer count fetched successfully
   *                   description: Success message
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalUsers:
   *                       type: integer
   *                       example: 100
   *                       description: Total number of users
   *                     activeUsers:
   *                       type: integer
   *                       example: 80
   *                       description: Number of active users
   *                     inActiveUsers:
   *                       type: integer
   *                       example: 20
   *                       description: Number of inactive users
   *                     monthlyUsers:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           month:
   *                             type: string
   *                             example: January
   *                             description: Name of the month
   *                           customers:
   *                             type: integer
   *                             example: 10
   *                             description: Number of users registered in the month
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   */
  userRoutes.route("/count").get(userController.getCustomerCount);
  userRoutes
    .route("/:id/upload/image")
    .post(isAuthenticated, isUser, multerUploads, userController.uploadImage);

  /**
   * @swagger
   * /api/user/{id}:
   *   get:
   *     summary: Get user details
   *     description: Fetch user details by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *       - adminAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: User details fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 200
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   example: User details fetched successfully
   *                   description: Success message
   *                 data:
   *                   type: object
   *       '401':
   *         description: Unauthorized, authentication failed or insufficient privileges
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   *   put:
   *     summary: Update user details
   *     description: Update user details by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               mobileNumber:
   *                 type: string
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               image:
   *                 type: string
   *               imageId:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [active, inactive]
   *     responses:
   *       '200':
   *         description: User details updated successfully
   *       '401':
   *         description: Unauthorized, authentication failed
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   *   delete:
   *     summary: Delete user
   *     description: Delete user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: User deleted successfully
   *       '401':
   *         description: Unauthorized, authentication failed
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   */
  userRoutes
    .route("/:id")
    .get(isAuthenticated, isAuthorized, userController.getUserDetails)
    .put(isAuthenticated, isAuthorized, userController.updateUser)
    .delete(isAuthenticated, isAuthorized, userController.deleteUser);

  /**
   * @swagger
   * /api/user/{id}/updateStatus:
   *   put:
   *     summary: Update user status
   *     description: Update user status by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: User ID
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [active, inactive]
   *                 description: New status for the user
   *     responses:
   *       '200':
   *         description: User status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Internal Server Error
   *                   description: Error message
   */
  userRoutes
    .route("/:id/updateStatus")
    .put(
      userController.updateCustomerStatus,
      validations.updateCustomerStatus,
      userController.updateCustomerStatus
    );
  return userRoutes;
};

export default initUserRoutes;
