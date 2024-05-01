import express from "express";
import { orderController } from "../controllers/index.js";
import * as validations from "../middleware/validations/orderValidations.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isUser, isRestaurant } from "../middleware/permissionsMiddleware.js";

const initOrderRoutes = () => {
  const orderRoutes = express.Router();

  /**
   * @swagger
   * tags:
   *  - name: Order
   */

  /**
   * @swagger
   * /order/place:
   *   post:
   *     summary: Place an order
   *     description: Endpoint to place a new order
   *     tags: [Order]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 description: ID of the user placing the order
   *               restaurantId:
   *                 type: string
   *                 description: ID of the restaurant
   *               foodItems:
   *                 type: array
   *                 description: List of food items in the order
   *                 items:
   *                   type: object
   *               address:
   *                 type: object
   *                 description: Address details for delivery
   *               paymentDetails:
   *                 type: object
   *                 description: Payment details for the order
   *     responses:
   *       '200':
   *         description: Order placed successfully
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
   *                   description: Order details
   */
  orderRoutes
    .route("/place")
    .post(
      isAuthenticated,
      isUser,
      validations.placeOrder,
      orderController.placeOrder
    );

  /**
   * @swagger
   * /order/count:
   *   get:
   *     summary: Get order count
   *     description: Endpoint to get the total count of orders and delivered orders
   *     tags: [Order]
   *     responses:
   *       '200':
   *         description: Order count retrieved successfully
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
   *                     totalOrders:
   *                       type: integer
   *                       description: Total number of orders
   *                     deliveredOrders:
   *                       type: integer
   *                       description: Total number of delivered orders
   */
  orderRoutes.route("/count").get(orderController.getOrderCount);

  /**
   * @swagger
   * /order/{orderId}:
   *   get:
   *     summary: Get order details
   *     description: Endpoint to retrieve details of a specific order by ID
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the order to retrieve
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Order retrieved successfully
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
   *                   description: Order details
   * */
  orderRoutes.route("/:orderId").get(isAuthenticated, orderController.getOrder);

  /**
   * @swagger
   * /order/status/{orderId}:
   *   post:
   *     summary: Update order status
   *     description: Endpoint to update the status of a specific order by ID
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the order to update status
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
   *                 description: New status for the order
   *     responses:
   *       '200':
   *         description: Order status updated successfully
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
   *                   description: Updated order details
   */
  orderRoutes
    .route("/status/:orderId")
    .post(
      isAuthenticated,
      isRestaurant,
      validations.updateOrderStatus,
      orderController.updateOrderStatus
    );

  /**
   * @swagger
   * /order/user/{user_id}:
   *   get:
   *     summary: Get orders by user ID
   *     description: Endpoint to retrieve orders placed by a specific user
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: user_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user to retrieve orders
   *     responses:
   *       '200':
   *         description: Orders retrieved successfully
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
   *                     description: Order details
   */
  orderRoutes.route("/user/:user_id").get(orderController.getUserOrders);

  /**
   * @swagger
   * /order/user/cancel/{orderId}:
   *   post:
   *     summary: Cancel user order
   *     description: Endpoint to cancel an order placed by a user
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the order to cancel
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Order cancelled successfully
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
   *                   description: Cancelled order details
   */
  orderRoutes
    .route("/user/cancel/:orderId")
    .post(isAuthenticated, isUser, orderController.cancelUserOrder);

  /**
   * @swagger
   * /order/restaurant/{restaurant_id}:
   *   get:
   *     summary: Get orders by restaurant ID
   *     description: Endpoint to retrieve orders for a specific restaurant
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: restaurant_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to retrieve orders
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Orders retrieved successfully
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
   *                     description: Order details
   */
  orderRoutes
    .route("/restaurant/:restaurant_id")
    .get(isAuthenticated, isRestaurant, orderController.getRestaurantOrders);

  /**
   * @swagger
   * /order/restaurant/stats/{restaurant_id}:
   *   get:
   *     summary: Get order statistics for a restaurant
   *     description: Endpoint to retrieve order statistics for a specific restaurant
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: restaurant_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to retrieve statistics
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Order statistics retrieved successfully
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
   *                   description: Order statistics
   */
  orderRoutes
    .route("/restaurant/stats/:restaurant_id")
    .get(
      isAuthenticated,
      isRestaurant,
      orderController.getRestaurantOrderStats
    );

  /**
   * @swagger
   * /order/restaurant/stats/filters/{restaurant_id}:
   *   get:
   *     summary: Get filtered order statistics for a restaurant
   *     description: Endpoint to retrieve filtered order statistics for a specific restaurant
   *     tags: [Order]
   *     parameters:
   *       - in: path
   *         name: restaurant_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the restaurant to retrieve filtered statistics
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *         description: Status of orders to filter by
   *       - in: query
   *         name: date
   *         schema:
   *           type: string
   *         description: Date range of orders to filter by
   *       - in: query
   *         name: customerId
   *         schema:
   *           type: string
   *         description: ID of the customer to filter orders by
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Filtered order statistics retrieved successfully
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
   *                   description: Filtered order statistics
   */
  orderRoutes
    .route("/restaurant/stats/filters/:restaurant_id")
    .get(
      isAuthenticated,
      isRestaurant,
      orderController.getRestaurantOrderStatsWithFilters
    );

  return orderRoutes;
};

export default initOrderRoutes;
