import mongoose from "mongoose";
import Education from "../models/educationSchema.js";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";

export async function getEducation(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.fail("This id is not valid");
      return;
    }

    const findUserFriend = await Friend.findOne({ userId: id });
    let friend;
    if (findUserFriend) {
      friend = findUserFriend.listFriend.find(
        (f) => f.id == req.userId && f.status == "accepted"
      );
    }

    const isFriend = friend ? true : false;
    const isOwner = req.userId == id ? true : false;

    const finEducation = await Education.find({ userId: id });

    let education = [];
    finEducation.forEach((w) => {
      if (w.viewer == "public" || (w.viewer == "friends" && isFriend)) {
        education.push(w);
      }
    });
    if (isOwner) {
      education = finEducation;
    }

    res.success("education was found successfully!", [
      education,
      isFriend,
      isOwner,
    ]);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function addEducation(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }
  const { field, degree, university, startYear, endYear, isCurrently } =
    req.body;

  try {
    const work = await Education.create({
      userId: req.params.id,
      field,
      degree,
      university,
      startYear,
      endYear,
      isCurrently,
      viewer: "friends",
    });
    res.success("education was created successfully");
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}
export async function updateEducation(req, res) {
  const { field, degree, university, startYear, endYear, isCurrently, userId } =
    req.body;

  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (userId != req.userId) {
    res.fail("You are not authorized");
    return;
  }
  try {
    const updateEducation = await Education.findOneAndUpdate(
      { _id: req.body.id },
      {
        field,
        degree,
        university,
        startYear,
        endYear,
        isCurrently,
      }
    );
    res.success("Work was updated successfully!");
  } catch (error) {
    res.faile(error.message);
  }
}
export async function deleteEducation(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const findEducation = await Education.findById(req.params.id);
    if (findEducation.userId != req.userId) {
      res.fail("You are not authorized");
      return;
    }
    await Education.findByIdAndDelete(req.params.id);
    res.success("This education was deleted successfully!");
  } catch (error) {
    res.fail(error.message);
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
  const { itemId, viewer } = req.body;
  try {
    await Education.findByIdAndUpdate(itemId, { viewer });

    res.success("Filter viewer is applied successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
