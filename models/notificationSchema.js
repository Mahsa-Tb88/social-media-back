import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    username: { type: String, required: true },
    profileImg: { type: String },
    type: { type: String, default: "comment" },
    isSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
