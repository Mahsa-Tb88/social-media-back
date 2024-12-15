import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    img: { type: String, default: "" },
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
