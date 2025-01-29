import mongoose from "mongoose";
import User from "../models/userSchema.js";
import UserInfo from "../models/userInfoSchema.js";

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

export async function getUserInfo(req, res) {
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
    const userInfo = await UserInfo.findOne({ userId: req.params.id });
    res.success("UserInfo was found successfully", userInfo);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function updateOverview(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }

  const { subject, value, viewer } = req.body;
  try {
    const userInfo = await UserInfo.findOne({ userId: req.params.id });
    const findItem = userInfo.overview.find((item) => item.subject == subject);
    let updatedOverview;
    if (findItem) {
      updatedOverview = userInfo.overview.map((i) => {
        if (i.subject == subject) {
          return { subject, value, viewer };
        } else {
          return i;
        }
      });
    } else {
      const overview = userInfo.overview;
      updatedOverview = [...overview, { subject, value, viewer }];
    }

    await UserInfo.findOneAndUpdate(
      { userId: req.params.id },
      {
        overview: updatedOverview,
      }
    );
    res.success(" was updated successfully");
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteItemOverview(req, res) {
  console.log("req.body", req.body);
  console.log("id is", req.params.id);
  const { subject } = req.body;

  try {
    const findUserInfo = await UserInfo.findOne({ userId: req.params.id });
    const updatedOverview = findUserInfo.overview.filter(
      (item) => item.subject != subject
    );

    await UserInfo.findOneAndUpdate(
      { userId: req.params.id },
      { overview: updatedOverview }
    );
    res.success("Overview was updated successfully");
  } catch (error) {
    res.fail(error.message, 500);
  }
}
