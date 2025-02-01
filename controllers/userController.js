import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Overview from "../models/overviewSchema.js";
import ContactBasicInfo from "../models/contactBaseInfoSchema.js";

import Work from "../models/workSchema.js";
import Education from "../models/educationSchema.js";

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

//overview
export async function getOverview(req, res) {
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
    const overview = await Overview.findOne({ userId: req.params.id });
    res.success("UserInfo was found successfully", overview);
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
    const overview = await Overview.findOne({ userId: req.params.id });

    if (overview) {
      await Overview.findOneAndUpdate(
        { userId: req.params.id },
        { [subject]: { value, viewer } }
      );
    } else {
      await Overview.create({
        userId: req.params.id,
        [subject]: { value, viewer },
      });
    }

    res.success(" was updated successfully");
  } catch (error) {
    console.log(error.message);
  }
}
export async function deleteItemOverview(req, res) {
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }

  const { subject } = req.body;
  try {
    await Overview.findOneAndUpdate(
      { userId: req.params.id },
      { [subject]: { value: "", viewer: "friends" } }
    );
    res.success(`${subject} was deleted successfully`);
  } catch (error) {
    res.fail(error.message, 500);
  }
}

//contactBaseInfo
export async function getContacUserInfo(req, res) {
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
    const contactBaseInfo = await ContactBasicInfo.findOne({
      userId: req.params.id,
    });
    res.success("UserInfo was found successfully", contactBaseInfo);
  } catch (error) {
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

//workEducation

export async function getWork(req, res) {
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
    const workEducation = await Work.find({ userId: req.params.id });
    res.success("workEducation was found successfully!", workEducation);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function updateWork(req, res) {}
export async function deleteWork(req, res) {}

//education
export async function getEducation(req, res) {
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
    const workEducation = await Education.find({ userId: req.params.id });
    res.success("workEducation was found successfully!", Education);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function updateEducation(req, res) {}
export async function deleteEducation(req, res) {}
