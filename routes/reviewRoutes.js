import express from "express";
import * as validations from "../middleware/validations/reviewValidation.js";
import { reviewController } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isUser } from "../middleware/permissionsMiddleware.js";

const initReviewRoutes = () => {
  const reviewRoutes = express.Router();

  /**
   * @swagger
   * tags:
   *  - name: Review
   */

  /**
   * @swagger
   * /api/review:
   *   post:
   *     summary: Send review message
   *     description: Endpoint to send a review message
   *     tags: [Review]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the reviewer
   *               message:
   *                 type: string
   *                 description: Review message
   *               rating:
   *                 type: integer
   *                 description: Rating of the review
   *     responses:
   *       '200':
   *         description: Review message sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Sent review details
   */
  reviewRoutes
    .route("/")
    .post(validations.sendReviewMessage, reviewController.sendReviewMessage);

  /**
   * @swagger
   * /api/review:
   *   get:
   *     summary: Get review messages
   *     description: Endpoint to get all review messages
   *     tags: [Review]
   *     responses:
   *       '200':
   *         description: Review messages retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         description: Name of the reviewer
   *                       message:
   *                         type: string
   *                         description: Review message
   *                       rating:
   *                         type: integer
   *                         description: Rating of the review
   */
  reviewRoutes.route("/").get(reviewController.getReviewMessages);

  /**
   * @swagger
   * /api/review/top:
   *   get:
   *     summary: Get top reviews
   *     description: Endpoint to get top reviews
   *     tags: [Review]
   *     responses:
   *       '200':
   *         description: Top reviews retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         description: Name of the reviewer
   *                       message:
   *                         type: string
   *                         description: Review message
   *                       rating:
   *                         type: integer
   *                         description: Rating of the review
   */
  reviewRoutes.route("/top").get(reviewController.getTopReviews);

  /**
   * @swagger
   * /api/review/restaurant/{restaurantId}:
   *   post:
   *     summary: Add restaurant review
   *     description: Endpoint to add a review for a restaurant
   *     tags: [Review]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to add the review
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 description: ID of the user adding the review
   *               rating:
   *                 type: integer
   *                 description: Rating of the review
   *               review:
   *                 type: string
   *                 description: Review message
   *     responses:
   *       '200':
   *         description: Restaurant review added successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Added review details
   */
  reviewRoutes
    .route("/restaurant/:restaurantId")
    .post(
      isAuthenticated,
      isUser,
      validations.addRestaurantReview,
      reviewController.addRestaurantReview
    );

  /**
   * @swagger
   * /api/review/restaurant/{restaurantId}:
   *   get:
   *     summary: Get restaurant reviews
   *     description: Endpoint to get reviews for a restaurant
   *     tags: [Review]
   *     parameters:
   *       - in: path
   *         name: restaurantId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to get the reviews
   *     responses:
   *       '200':
   *         description: Restaurant reviews retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         description: Name of the reviewer
   *                       message:
   *                         type: string
   *                         description: Review message
   *                       rating:
   *                         type: integer
   *                         description: Rating of the review
   */
  reviewRoutes
    .route("/restaurant/:restaurantId")
    .get(reviewController.getRestaurantReviews);
  return reviewRoutes;
};

export default initReviewRoutes;
