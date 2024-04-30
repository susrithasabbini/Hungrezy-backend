import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantReviewSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  helpfulVotes: {
    type: Number,
    default: 0,
  },
},{
    timestamps: true
  });

const RestaurantReview = mongoose.model('RestaurantReview', restaurantReviewSchema);

export default RestaurantReview;
