import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: String, required: true },
    userGetReply: { type: Schema.Types.ObjectId, ref: "User" },
    mentionUser: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, default: "" },
    type: { type: String, default: "comment" },
    isSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
