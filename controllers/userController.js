import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    let selectedUsers = users.filter((user) => user._id != req.userId);
    selectedUsers = selectedUsers.map((user) => {
      user.password = undefined;
      user.emailRegister = undefined;
      user.bio = undefined;
      return user;
    });
    res.success("get all users successfully", selectedUsers);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function getUserById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  console.log("get user");
  try {
    const user = await User.findById(req.params.id);
    user.password = undefined;
    res.success(" User was found successfully!", user);
  } catch (error) {
    console.log("error", error);
    res.fail(error.message);
  }
}
export async function findUser(req, res) {
  const username = req.query.user;
  const query = {
    $or: [{ username: RegExp(username, "i") }],
  };
  try {
    const findUser = await User.find(query);
    res.success("was found successfully!", findUser);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function findUserFriedns(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    let friends;
    friends = await Friend.findOne({ userId: req.params.id });

    const findFriend = friends.listFriend.filter(
      (f) => f.id == req.userId && f.status == "accepted"
    );

    if (
      friends.viewer == "private" ||
      (friends.viewer == "friends" && !findFriend.length) ||
      !friends
    ) {
      friends = [];
    }
    res.success("Friends were found successfully!", friends);
  } catch (error) {
    res.fail(error.message);
  }
}
