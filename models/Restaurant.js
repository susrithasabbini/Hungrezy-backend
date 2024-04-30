import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  imageId: {
    type: String,
  },
  rating: {
    type: String, 
  },
  rating_count: {
    type: String, 
  },
  cost: {
    type: String,
  },
  address: {
    type: String,
  },
  cuisine: {
    type: String,
  },
  lic_no: {
    type: String,
  },
  city: {
    type: String,
  },
  area: {
    type: String,
  },
  menu_id: {
    type: Schema.Types.ObjectId,
    ref: 'Menu',
  },
  isopen: {
    type: Boolean,
    default: true, 
  },
  status: {
    type: String,
    enum: ['approved', 'rejected', 'suspended', 'inprogress'],
    default: 'inprogress',
  },
},{
  timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
