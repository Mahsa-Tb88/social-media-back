import User from "../models/userSchema.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.success("get all users successfully", users);
  } catch (error) {
    res.fail(error.message);
  }
}
