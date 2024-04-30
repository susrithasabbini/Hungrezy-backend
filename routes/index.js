import initAuthRoutes from "./authRoutes.js";
import initRestaurantRoutes from "./restaurantRoutes.js";
import initUserRoutes from "./userRoutes.js";
import initAdminRoutes from "./adminRoutes.js";
import express from "express";
import initMenuRoutes from "./menuRoutes.js";
import initOrderRoutes from "./orderRoutes.js";
import initContactRoutes from "./contactRoutes.js";
import initReviewRoutes from "./reviewRoutes.js";

const initRoutes = () => {
  const router = express.Router();

  router.use("/auth", initAuthRoutes());
  router.use("/restaurant", initRestaurantRoutes());
  router.use("/user", initUserRoutes());
  router.use("/admin", initAdminRoutes());
  router.use("/menu", initMenuRoutes());
  router.use("/order",initOrderRoutes());
  router.use("/contact", initContactRoutes())
  router.use("/review", initReviewRoutes());
  
  return router;
};

export default initRoutes;
