import { Schema, model } from "mongoose";

const announcementSchema = new Schema(
  {
    announcement: {
      type: String,
      required: true,
    },
    to: {
        type: String,
        enum: ['all', 'customers', 'restaurants'],
        default: 'all',
    }
  },
  {
    timestamps: true,
  }
);

const Announcement = model("Announcement", announcementSchema);

export default Announcement;
