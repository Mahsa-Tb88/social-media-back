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
  console.log("id", req.params.id);
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

    if (findItem) {
      const updatedOverview = userInfo.overview.map((i) => {
        if (i.subject == subject) {
          return { subject, value, viewer };
        } else {
          return i;
        }
      });
      await UserInfo.findByIdAndUpdate(
        { userId: req.params.id },
        {
          overview: updatedOverview,
        }
      );
    } else {
      const overview = userInfo.overview;
      const updatedOverview = [...overview, { subject, value, viewer }];
      await UserInfo.findOneAndUpdate(
        { userId: req.params.id },
        {
          overview: updatedOverview,
        }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}
