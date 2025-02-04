import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Overview from "../models/overviewSchema.js";
import ContactBasicInfo from "../models/contactBaseInfoSchema.js";

import Work from "../models/workSchema.js";
import Education from "../models/educationSchema.js";
import FamilyRel from "../models/familyRelationship.js";

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
  try {
    console.log("paramsss", req.params);
  } catch (error) {}
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

//work

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
    const work = await Work.find({ userId: req.params.id });

    res.success("workEducation was found successfully!", work);
  } catch (error) {
    console.log("error");
    res.fail(error.message);
  }
}
export async function addNewWork(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }
  const { position, company, city, startYear, endYear, isCurrently } = req.body;
  console.log(req.body);

  try {
    const work = await Work.create({
      userId: req.params.id,
      position,
      company,
      city,
      startYear,
      endYear,
      isCurrently,
      viewer: "friends",
    });
    res.success("work updated successfully");
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}
export async function updateWork(req, res) {
  const { city, company, position, startYear, endYear, isCurrently, userId } =
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
    const updatedWork = await Work.findOneAndUpdate(
      { _id: req.params.id },
      {
        city,
        company,
        position,
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
export async function deleteWork(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const findWork = await Work.findById(req.params.id);
    if (findWork.userId != req.userId) {
      res.fail("You are not authorized");
      return;
    }
    await Work.findByIdAndDelete(req.params.id);
    res.success("This work was deleted successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}

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
    const education = await Education.find({ userId: req.params.id });
    res.success("workEducation was found successfully!", education);
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
  console.log(req.body);

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
  console.log("req.params", req.params.id);
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

//family relationship

export async function getFamilyRel(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const familyRel = await FamilyRel.findOne({ userId: req.params.id });
    res.success("it was found successfully!", familyRel);
  } catch (error) {
    res.fail(error.message);
  }
}
