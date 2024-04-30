import Joi from "joi";
import { validate } from "./common.js";

const addMenu = async (req, res, next) => {
  const schema = Joi.object({
    menuItem: Joi.object({
      category: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      veg_or_non_veg: Joi.string().valid("Veg", "Non-veg").required(),
    }).required(),
    restaurantId: Joi.string().required(),
  });
  await validate(schema, req, res, next);
};

const updateMenu = async (req, res, next) => {
  const schema = Joi.object({
    menuItem: Joi.object({
      category: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      veg_or_non_veg: Joi.string().valid("Veg", "Non-veg").required(),
      available: Joi.boolean().required(),
    }).required(),
    restaurantId: Joi.string().required(),
  });
  await validate(schema, req, res, next);
};

const deleteMenu = async (req, res, next) => {
  const schema = Joi.object({
    restaurantId: Joi.string().required(),
    menuItem: Joi.object({
      name: Joi.string().required(),
      category: Joi.string().required(),
    }).required(),
  });
  await validate(schema, req, res, next);
};

export { addMenu, updateMenu, deleteMenu };
