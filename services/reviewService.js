import { Review,RestaurantReview } from "../models/index.js";

const TAG = "service.review";

const sendReviewMessage = async (review) => {
  try {
    const newReview = new Review({
      name: review.name,
      message: review.message,
      rating: review.rating,
    });
    await newReview.save();
    return {
      status: 200,
      message: "Success",
      data: newReview,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in sendReviewMessage() => ${error}`);
    throw error;
  }
};


const addRestaurantReview = async (req) => {
  try {
    const {userId,rating,review}=req.body;
    const restaurantId = req.params.restaurantId;
    let newReview = new RestaurantReview({
      restaurantId:restaurantId,
      userId:userId,
      rating:rating,
      review:review
    })
    await newReview.save()
    return {
      status: 200,
      message: "Success",
      data: newReview,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in addRestaurantReview() => ${error}`);
    throw error;
  }
};

const getReviewMessages = async () => {
  try {
    const contacts = await Review.find();
    return {
      status: 200,
      message: "Success",
      data: contacts,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getReviewMessages() => ${error}`);
    throw error;
  }
};

const getTopReviews = async () => {
  try {
    const reviews = await Review.find().sort({rating:-1}).limit(4);
    return {
      status: 200,
      message: "Success",
      data: reviews,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getTopReviews() => ${error}`);
    throw error;
  }
};

const getRestaurantReviews = async (restaurantId) => {
  try {
    const reviews = await RestaurantReview.find({restaurantId}).populate('userId','_id firstName lastName image');
    return {
      status: 200,
      message: "Success",
      data: reviews,
    };
  } catch (error) {
    console.error(`${TAG} ERROR in getRestaurantReviews() => ${error}`);
    throw error;
  }
};

export { sendReviewMessage, getReviewMessages, addRestaurantReview,getRestaurantReviews,getTopReviews };
