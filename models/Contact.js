import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      enum: ["technical", "general", "other"],
    },
    status: {
      type: String,
      enum: ["in-progress", "resolved"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema);

export default Contact;
