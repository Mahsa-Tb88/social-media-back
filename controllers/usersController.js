import User from "../models/userSchema.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    const selectedUsers = users.filter((user) => user._id != req.userId);
    res.success("get all users successfully", selectedUsers);
  } catch (error) {
    res.fail(error.message);
  }
}
