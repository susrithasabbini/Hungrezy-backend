import { Schema, model } from "mongoose";

const userSchema = new Schema({
  mobileNumber: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
},{
  timestamps: true
});


const User = model("User", userSchema);

export default User;
