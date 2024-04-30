import express from "express";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { multerUploads } from "../middleware/multerMiddleware.js";
import { userController } from "../controllers/index.js";
import { isUser } from "../middleware/permissionsMiddleware.js";
import * as validations from "../middleware/validations/userValidations.js";

const initUserRoutes = () => {
  const userRoutes = express.Router();
  userRoutes
    .route("/:id/upload/image")
    .post(isAuthenticated, isUser, multerUploads, userController.uploadImage);
  userRoutes.route("/all").post(userController.getAllUsers);
  userRoutes.route("/count").get(userController.getCustomerCount);
  userRoutes.route("/:id").get(userController.getUserDetails);

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
