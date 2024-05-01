import express from "express";
import { contactController } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isUser } from "../middleware/permissionsMiddleware.js";
import * as validations from "../middleware/validations/contactValidation.js";

const initContactRoutes = () => {
  const contactRoutes = express.Router();

  /**
   * @swagger
   * tags:
   *  - name: Contact
   */

  /**
   * @swagger
   * /api/contact:
   *   post:
   *     summary: Send contact message
   *     description: Endpoint to send a contact message
   *     tags: [Contact]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the sender
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email of the sender
   *               message:
   *                 type: string
   *                 description: Message content
   *               subject:
   *                 type: string
   *                 description: Subject of the message
   *     responses:
   *       '200':
   *         description: Contact message sent successfully
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
   *                   description: Sent contact message details
   */
  contactRoutes
    .route("/")
    .post(
      isAuthenticated,
      isUser,
      validations.sendContactMessage,
      contactController.sendContactMessage
    );

  /**
   * @swagger
   * /api/contact:
   *   get:
   *     summary: Get contact messages
   *     description: Endpoint to get all contact messages
   *     tags: [Contact]
   *     responses:
   *       '200':
   *         description: Contact messages retrieved successfully
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
   *                         description: Name of the sender
   *                       email:
   *                         type: string
   *                         format: email
   *                         description: Email of the sender
   *                       message:
   *                         type: string
   *                         description: Message content
   *                       subject:
   *                         type: string
   *                         description: Subject of the message
   */
  contactRoutes.route("/").get(contactController.getContactMessages);

  /**
   * @swagger
   * /api/contact/{id}:
   *   put:
   *     summary: Update contact message status
   *     description: Endpoint to update the status of a contact message
   *     tags: [Contact]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the contact message to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 description: Status of the contact message
   *     responses:
   *       '200':
   *         description: Contact message status updated successfully
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
   *                   description: Updated contact message details
   */
  contactRoutes
    .route("/:id")
    .put(
      validations.updateContactMessage,
      contactController.updateContactMessage
    );
  return contactRoutes;
};

export default initContactRoutes;
