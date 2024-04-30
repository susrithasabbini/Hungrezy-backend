import { Schema, model } from "mongoose";

const adminSchema = new Schema({
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
  superAdmin: {
    type: Boolean,
    default: false
  },
  active : {
    type: Boolean,
    default: true
  } 
},{
  timestamps: true
});


const Admin = model("Admin", adminSchema);

export default Admin;
