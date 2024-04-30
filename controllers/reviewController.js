import { reviewService } from "../services/index.js";

const TAG = "controller.review";

const sendReviewMessage = async (req, res, next) => {
  try {
    const result = await reviewService.sendReviewMessage(req.body);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in sendReviewMessage() => ${error.message}`);
    next(error);
  }
};

const addRestaurantReview = async (req, res, next) => {
  try {
    const result = await reviewService.addRestaurantReview(req);
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in addRestaurantReview() => ${error.message}`);
    next(error);
  }
};

const getReviewMessages = async (req, res, next) => {
  try {
    const result = await reviewService.getReviewMessages();
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getReviewMessages() => ${error.message}`);
    next(error);
  }
};

const getTopReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getTopReviews();
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getTopReviews() => ${error.message}`);
    next(error);
  }
};

const getRestaurantReviews = async (req, res, next) => {
  try {
    const result = await reviewService.getRestaurantReviews(
      req.params.restaurantId
    );
    res.status(result.status).send({
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error(`${TAG} ERROR in getRestaurantReviews() => ${error.message}`);
    next(error);
  }
};

export {
  sendReviewMessage,
  getReviewMessages,
  addRestaurantReview,
  getRestaurantReviews,
  getTopReviews,
};
