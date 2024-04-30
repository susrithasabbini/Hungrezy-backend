import express from "express";
import * as validations from "../middleware/validations/menuValidations.js";
import { menuController } from "../controllers/index.js";
import { isAuthenticated } from "../middleware/authenticationMiddleware.js";
import { isRestaurant } from "../middleware/permissionsMiddleware.js";

const initMenuRoutes = () => {
  const menuRoutes = express.Router();
  menuRoutes.route("/:id").get(menuController.getMenuById);
  menuRoutes
    .route("/addMenu")
    .post(
      isAuthenticated,
      isRestaurant,
      validations.addMenu,
      menuController.addMenu
    );
  menuRoutes
    .route("/updateMenu")
    .put(
      isAuthenticated,
      isRestaurant,
      validations.updateMenu,
      menuController.updateMenu
    );
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
