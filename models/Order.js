import mongoose from 'mongoose';

const { Schema } = mongoose;

const foodItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  veg_or_non_veg: {
    type: String,
    required: true,
  },
},{ _id: false });

const paymentDetailsSchema = new Schema({
  method: {
    type: String,
    enum: [ 'card', 'upi', 'cash'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
},{ _id: false });

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  foodItems: [foodItemSchema],
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['placed', 'processing', 'delivered', 'cancelled'],
    default: 'placed',
  },
  address: {
    type: String,
    required: true,
  },
  paymentDetails: paymentDetailsSchema,
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;
