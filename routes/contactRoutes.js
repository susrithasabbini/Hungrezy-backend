import express from "express";
import { contactController } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isUser } from "../middleware/permissionsMiddleware.js";
import * as validations from "../middleware/validations/contactValidation.js";

const initContactRoutes = () => {
  const contactRoutes = express.Router();
  contactRoutes
    .route("/")
    .post(
      isAuthenticated,
      isUser,
      validations.sendContactMessage,
      contactController.sendContactMessage
    );
  contactRoutes.route("/").get(contactController.getContactMessages);
  contactRoutes
    .route("/:id")
    .put(
      validations.updateContactMessage,
      contactController.updateContactMessage
    );
  return contactRoutes;
};

export default initContactRoutes;
