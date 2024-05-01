import express from "express";
import { restaurantController } from "../controllers/index.js";
import { isRestaurant } from "../middleware/permissionsMiddleware.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { multerUploads } from "../middleware/multerMiddleware.js";
import * as validations from "../middleware/validations/restaurantValidations.js";

const initRestaurantRoutes = () => {
  const restaurantRoutes = express.Router();

  /**
   * @swagger
   * tags:
   *  - name: Restaurant
   */

  /**
   * @swagger
   * /api/restaurant:
   *   get:
   *     summary: Get restaurants
   *     description: Endpoint to retrieve restaurants based on city and area
   *     tags: [Restaurant]
   *     parameters:
   *       - in: query
   *         name: city
   *         required: true
   *         schema:
   *           type: string
   *         description: City to search for restaurants
   *       - in: query
   *         name: area
   *         required: true
   *         schema:
   *           type: string
   *         description: Area within the city to search for restaurants
   *     responses:
   *       '200':
   *         description: Restaurants retrieved successfully
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
   *                     description: Restaurant details
   */
  restaurantRoutes.route("/").get(restaurantController.getRestaurants);

  /**
   * @swagger
   * /api/restaurant/all:
   *   get:
   *     summary: Get all restaurants
   *     description: Endpoint to retrieve all restaurants
   *     tags: [Restaurant]
   *     responses:
   *       '200':
   *         description: All restaurants retrieved successfully
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
   *                     description: Restaurant details
   */
  restaurantRoutes.route("/all").get(restaurantController.getAllRestaurants);

  /**
   * @swagger
   * /api/restaurant/count:
   *   get:
   *     summary: Get restaurants count
   *     description: Endpoint to retrieve the count of restaurants
   *     tags: [Restaurant]
   *     responses:
   *       '200':
   *         description: Restaurants count retrieved successfully
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
   *                   description: Restaurant count details
   */
  restaurantRoutes
    .route("/count")
    .get(restaurantController.getRestaurantsCount);

  /**
   * @swagger
   * /api/restaurant/locations:
   *   get:
   *     summary: Get restaurant locations
   *     description: Endpoint to retrieve locations of all restaurants
   *     tags: [Restaurant]
   *     responses:
   *       '200':
   *         description: Restaurant locations retrieved successfully
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
   *                   description: Locations of restaurants
   */
  restaurantRoutes.route("/locations").get(restaurantController.getLocations);

  /**
   * @swagger
   * /api/restaurant/id:
   *   get:
   *     summary: Get restaurant ID
   *     description: Endpoint to retrieve the ID of a restaurant by email
   *     tags: [Restaurant]
   *     parameters:
   *       - in: query
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *         description: Email of the restaurant to retrieve ID
   *     responses:
   *       '200':
   *         description: Restaurant ID retrieved successfully
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
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: ID of the restaurant
   */
  restaurantRoutes.route("/id").get(restaurantController.getRestaurantId);

  /**
   * @swagger
   * /api/restaurant/{id}/updateStatus:
   *   put:
   *     summary: Update restaurant status
   *     description: Endpoint to update the status of a restaurant by ID
   *     tags: [Restaurant]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to update status
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 description: New status for the restaurant
   *     responses:
   *       '200':
   *         description: Restaurant status updated successfully
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
   *                   description: Updated restaurant details
   */
  restaurantRoutes
    .route("/:id/updateStatus")
    .put(
      restaurantController.updateRestaurantStatus,
      validations.updateRestaurantStatus,
      restaurantController.updateRestaurantStatus
    );

  /**
   * @swagger
   * /api/restaurant/menu/{menu_id}:
   *   get:
   *     summary: Get restaurant menu
   *     description: Endpoint to retrieve the menu of a restaurant by menu ID
   *     tags: [Restaurant]
   *     parameters:
   *       - in: path
   *         name: menu_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the menu to retrieve
   *     responses:
   *       '200':
   *         description: Restaurant menu retrieved successfully
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
   *                     description: Menu item details
   */

  restaurantRoutes.route("/menu/:menu_id").get(restaurantController.getMenu);

  /**
   * @swagger
   * /api/restaurant/{id}:
   *   get:
   *     summary: Get restaurant by ID
   *     description: Endpoint to retrieve a restaurant by ID
   *     tags: [Restaurant]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to retrieve
   *     responses:
   *       '200':
   *         description: Restaurant retrieved successfully
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
   *                   description: Restaurant details
   *   put:
   *     summary: Update restaurant details
   *     description: Endpoint to update details of a restaurant by ID
   *     tags: [Restaurant]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to update
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               city:
   *                 type: string
   *                 description: City of the restaurant
   *               area:
   *                 type: string
   *                 description: Area of the restaurant
   *               address:
   *                 type: string
   *                 description: Address of the restaurant
   *     responses:
   *       '200':
   *         description: Restaurant details updated successfully
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
   *                   description: Updated restaurant details
   */
  restaurantRoutes
    .route("/:id")
    .get(restaurantController.getRestaurantById)
    .put(
      isAuthenticated,
      isRestaurant,
      validations.restaurantUpdateDetails,
      restaurantController.updateRestaurant
    );

  /**
   * @swagger
   * /api/restaurant/{id}/upload/image:
   *   post:
   *     summary: Upload restaurant image
   *     description: Endpoint to upload an image for a restaurant
   *     tags: [Restaurant]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to upload image
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Image file to upload
   *     responses:
   *       '200':
   *         description: Image uploaded successfully
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
   *                   description: Uploaded image details
   */
  restaurantRoutes
    .route("/:id/upload/image")
    .post(
      isAuthenticated,
      isRestaurant,
      multerUploads,
      restaurantController.uploadImage
    );
  return restaurantRoutes;
};

export default initRestaurantRoutes;
