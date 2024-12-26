import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false },
    backgroundImg: { type: String, default: "" },
    profileImg: { type: String, default: "" },
    username: { type: String, required: true, unique: true },
    livesIn: { type: String, default: "" },
    work: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: { type: Array, default: [] },
    viewer: { type: String, default: "private" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
