import {
  USER_ROLE,
  USER_ROLE_RESTAURANT,
  USER_ROLE_ADMIN,
  USER_ROLE_SUPERADMIN,
} from "../constants/userRoleConstants.js";

const isRestaurant = async (req, res, next) => {
  try {
    if (req.user_role != USER_ROLE_RESTAURANT)
      res.status(403).send({
        message: "Access denied",
      });
    else next();
  } catch (error) {
    next(error);
  }
};

const isUser = async (req, res, next) => {
  try {
    if (req.user_role != USER_ROLE)
      res.status(403).send({
        message: "Access denied",
      });
    else next();
  } catch (error) {
    next(error);
  }
};

const isAuthorized = async (req, res, next) => {
  try {
    if (req.user_role !== USER_ROLE_ADMIN && req.user_mongo_id !== req.params.id) {
      res.status(403).send({
        message: "Access denied",
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (
      req.user_role != USER_ROLE_ADMIN &&
      req.user_role != USER_ROLE_SUPERADMIN
    )
      res.status(403).send({
        message: "Access denied",
      });
    else next();
  } catch (error) {
    next(error);
  }
};

export { isRestaurant, isUser, isAdmin, isAuthorized };
