import mongoose from "mongoose";
import ContactBasicInfo from "../models/contactBaseInfoSchema.js";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";

export async function getContacUserInfo(req, res) {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.fail("This user id is not valid!");
      return;
    }

    let fidnFriend = await Friend.findOne({ userId: id });
    if (fidnFriend) {
      fidnFriend = fidnFriend.listFriend.find(
        (f) => f.id == req.userId && f.status == "accepted"
      );
    }

    const isFriend = fidnFriend ? true : false;
    const isOwner = req.userId == id ? true : false;

    const findContactBaseInfo = await ContactBasicInfo.findOne({
      userId: id,
    });
    let contactBaseInfo = {};
    if (findContactBaseInfo) {
      const data = findContactBaseInfo.toObject();
      Object.keys(data).forEach((item) => {
        if (
          data[item].viewer == "public" ||
          (data[item].viewer == "friends" && isFriend)
        ) {
          contactBaseInfo[item] = data[item];
        }

        if (isOwner) {
          contactBaseInfo[item] = data[item];
        }
      });
    }
    res.success("UserInfo was found successfully", [
      contactBaseInfo,
      isFriend,
      isOwner,
    ]);
  } catch (error) {
    console.log("error", error);
    res.fail(error.message);
  }
}
export async function updateConatctUserInfo(req, res) {
  const { subject, viewer, value } = req.body;
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }

  try {
    const findItem = await ContactBasicInfo.findOne({ userId: req.params.id });
    if (findItem) {
      const updatee = await ContactBasicInfo.findOneAndUpdate(
        { userId: req.params.id },
        { [subject]: { value, viewer } }
      );
    } else {
      const newi = await ContactBasicInfo.create({
        userId: req.params.id,
        [subject]: { value, viewer },
      });
    }

    res.success("New update was done successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
export async function deleteConatctUserInfo(req, res) {
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }

  const { subject } = req.body;
  try {
    await ContactBasicInfo.findOneAndUpdate(
      { userId: req.params.id },
      { [subject]: { value: "", viewer: "friends" } }
    );
    res.success(`${subject} was deleted successfully`);
  } catch (error) {
    res.fail(error.message, 500);
  }
}

export async function filterViewer(req, res) {
  const id = req.params.id;

  const isValid = mongoose.isValidObjectId(id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  if (id != req.userId) {
    res.fail("You are not authorized");
    return;
  }
  const { subject, viewer } = req.body;
  try {
    const contactBaseInfo = await ContactBasicInfo.findOne({ userId: id });
    await ContactBasicInfo.findOneAndUpdate(
      { userId: id },
      { [subject]: { ...contactBaseInfo[subject], viewer } }
    );
    res.success("Filter viewer is applied successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
