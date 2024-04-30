import express from "express";
import { restaurantController } from "../controllers/index.js";
import { isRestaurant } from "../middleware/permissionsMiddleware.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { multerUploads } from "../middleware/multerMiddleware.js";
import * as validations from "../middleware/validations/restaurantValidations.js";

const initRestaurantRoutes = () => {
  const restaurantRoutes = express.Router();
  restaurantRoutes.route("/").get(restaurantController.getRestaurants);
  restaurantRoutes.route("/all").get(restaurantController.getAllRestaurants);
  restaurantRoutes
    .route("/count")
    .get(restaurantController.getRestaurantsCount);
  restaurantRoutes.route("/locations").get(restaurantController.getLocations);
  restaurantRoutes.route("/id").get(restaurantController.getRestaurantId);
  restaurantRoutes
    .route("/:id/updateStatus")
    .put(
      restaurantController.updateRestaurantStatus,
      validations.updateRestaurantStatus,
      restaurantController.updateRestaurantStatus
    );
  restaurantRoutes.route("/menu/:menu_id").get(restaurantController.getMenu);
  restaurantRoutes
    .route("/:id")
    .get(restaurantController.getRestaurantById)
    .put(
      isAuthenticated,
      isRestaurant,
      validations.restaurantUpdateDetails,
      restaurantController.updateRestaurant
    );
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
