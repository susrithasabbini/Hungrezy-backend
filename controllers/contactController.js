import { contactService } from "../services/index.js";

const TAG = "controller.contact";

const sendContactMessage = async (req, res, next) => {
  try {
    const result = await contactService.sendContactMessage(req.body);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in sendContactMessage() => ${error.message}`);
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const result = await contactService.getContactMessages();
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getContactMessages() => ${error.message}`);
    next(error);
  }
};

const updateContactMessage = async (req, res, next) => {
  try {
    const result = await contactService.updateContactMessage(req)
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in updateContactMessage() => ${error.message}`);
    next(error);
  }
};

export { sendContactMessage, getContactMessages, updateContactMessage };
