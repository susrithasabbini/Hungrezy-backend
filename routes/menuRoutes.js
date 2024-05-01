import express from "express";
import * as validations from "../middleware/validations/menuValidations.js";
import { menuController } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isRestaurant } from "../middleware/permissionsMiddleware.js";

const initMenuRoutes = () => {
  const menuRoutes = express.Router();

  /**
   * @swagger
   * tags:
   *  - name: Order
   */

  /**
   * @swagger
   * /api/menu/{id}:
   *   get:
   *     summary: Get menu by ID
   *     description: Endpoint to retrieve a menu by ID
   *     tags: [Menu]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the menu to retrieve
   *     responses:
   *       '200':
   *         description: Menu retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer==
   *                   description: HTTP status code
   *                 message:
   *                   type: string
   *                   description: Response message
   *                 data:
   *                   type: object
   *                   description: Menu details
   */
  menuRoutes.route("/:id").get(menuController.getMenuById);

  /**
   * @swagger
   * /api/menu/addMenu:
   *   post:
   *     summary: Add menu
   *     description: Endpoint to add a new menu
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               restaurantId:
   *                 type: string
   *                 description: ID of the restaurant to add the menu
   *               menuItem:
   *                 type: object
   *                 description: Details of the menu item to add
   *     responses:
   *       '201':
   *         description: Menu added successfully
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
   *                   description: Added menu details
   */
  menuRoutes
    .route("/addMenu")
    .post(
      isAuthenticated,
      isRestaurant,
      validations.addMenu,
      menuController.addMenu
    );

  /**
   * @swagger
   * /api/menu/updateMenu:
   *   put:
   *     summary: Update menu
   *     description: Endpoint to update a menu
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               restaurantId:
   *                 type: string
   *                 description: ID of the restaurant to update the menu
   *               menuItem:
   *                 type: object
   *                 description: Details of the menu item to update
   *     responses:
   *       '200':
   *         description: Menu updated successfully
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
   *                   description: Updated menu details
   */
  menuRoutes
    .route("/updateMenu")
    .put(
      isAuthenticated,
      isRestaurant,
      validations.updateMenu,
      menuController.updateMenu
    );

  /**
   * @swagger
   * /api/menu/deleteMenu:
   *   put:
   *     summary: Delete menu item
   *     description: Endpoint to delete a menu item
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               restaurantId:
   *                 type: string
   *                 description: ID of the restaurant to delete the menu item
   *               menuItem:
   *                 type: object
   *                 description: Details of the menu item to delete
   *     responses:
   *       '200':
   *         description: Menu item deleted successfully
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
   *                   description: Updated menu details
   */
  menuRoutes
    .route("/deleteMenu")
    .put(
      isAuthenticated,
      isRestaurant,
      validations.deleteMenu,
      menuController.deleteMenu
    );
  return menuRoutes;
};

export default initMenuRoutes;
