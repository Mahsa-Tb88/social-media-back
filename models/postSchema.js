import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, default: "" },
    video: { type: String, default: "" },
    title: { type: String, default: "" },
    desc: { type: String, default: "" },
    feeling: { type: String, default: "" },
    viewer: { type: String, default: "friends" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
