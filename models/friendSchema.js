import mongoose, { Schema } from "mongoose";

const friend = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listFriend: { type: Array, default: [] },
    viewer: { type: String, default: "private" },
  },

  { timestamps: true }
);

const Friend = mongoose.model("Friend", friend);

export default Friend;
