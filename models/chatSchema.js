import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String },
    sender: { type: Object, default: {} },
    receiver: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
