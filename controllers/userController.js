import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";



export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    const selectedUsers = users.filter((user) => user._id != req.userId);
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

  try {
    const user = await User.findById(req.params.id);
    res.success(" User was found successfully!", user);
  } catch (error) {
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
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }

  try {
    let friends;
    friends = await Friend.findOne({ userId: req.params.id });
    if (!friends) {
      friends = [];
    }
    res.success("Friends were found successfully!", friends);
  } catch (error) {
    res.fail(error.message);
  }
}






