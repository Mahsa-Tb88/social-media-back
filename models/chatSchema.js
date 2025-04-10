import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    msg: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
