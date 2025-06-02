import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    backgroundImg: { type: String, default: "" },
    profileImg: { type: String, default: "" },
    bio: { type: String, default: "", viewer: "private" },
    username: { type: String, required: true, unique: true },
    emailRegister: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    viewerProfile: { type: String, default: "private" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
