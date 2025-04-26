import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    PostId: { type: String, required: true },
    username: { type: String, required: true },
    UserProfileImg: { type: String, required: true },
    type: { type: String, default: "comment" },
    isSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
