import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fallowers: { type: Array, default: [] },
    fallowing: { type: Array, default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
