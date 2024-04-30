import express from "express";
import * as validations from "../middleware/validations/reviewValidation.js";
import { reviewController } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isUser } from "../middleware/permissionsMiddleware.js";

const initReviewRoutes = () => {
  const reviewRoutes = express.Router();
  reviewRoutes
    .route("/")
    .post(validations.sendReviewMessage, reviewController.sendReviewMessage);
  reviewRoutes.route("/").get(reviewController.getReviewMessages);
  reviewRoutes.route("/top").get(reviewController.getTopReviews);
  reviewRoutes.route("/restaurant/:restaurantId").post(isAuthenticated,isUser,validations.addRestaurantReview,reviewController.addRestaurantReview);
  reviewRoutes.route("/restaurant/:restaurantId").get(reviewController.getRestaurantReviews)
  return reviewRoutes;
};

export default initReviewRoutes;
