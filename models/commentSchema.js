import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, require: true },
    notifiId: { type: String, require: true },
    userId: { type: String, require: true },
    text: { type: String, require: true },
    username: { type: String, require: true },
    profileImg: { type: String, require: true },
    like: { type: Array, default: [] },
    reply: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
