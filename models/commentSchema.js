import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, require: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, require: true },
    mentionUser: { type: Schema.Types.ObjectId, ref: "User" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Comment" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
