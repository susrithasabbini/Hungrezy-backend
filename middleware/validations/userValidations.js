import Joi from "joi";
import { validate } from "./common.js";

const updateCustomerStatus = async (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().allow("active", "inactive"),
  });
  await validate(schema, req, res, next);
};

export { updateCustomerStatus };
