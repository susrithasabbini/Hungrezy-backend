import Joi from "joi";
import { validate } from "./common.js";

const sendContactMessage = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    message: Joi.string().required(),
    email: Joi.string().email().required(),
    subject: Joi.string().valid("technical", "general", "other"),
  });
  await validate(schema, req, res, next);
};

const updateContactMessage = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().valid("resolved", "in-progress").required(),
  });
  await validate(schema, req, res, next);
};

export { sendContactMessage, updateContactMessage };
