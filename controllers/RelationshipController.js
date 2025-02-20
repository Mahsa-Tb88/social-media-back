import mongoose from "mongoose";
import FamilyRel from "../models/familyRelationship.js";

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

export async function updateRelationship(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (userId != req.userId) {
    res.fail("You are not authorized");
    return;
  }

  const findUser = await FamilyRel.findOne({ userId });
  if (findUser) {
    await FamilyRel.findOneAndUpdate(
      { userId },
      { relationship: req.body.relationship }
    );
  } else {
    await FamilyRel.create({ userId, relationship: req.body.relationship });
  }

  res.success("Relationship was updated successfully!");
  try {
  } catch (error) {
    console.log(error);
    res.fail(error.message);
  }
}

export async function deleteRelationship(req, res) {
  const userId = req.params.id;
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
    await FamilyRel.findOneAndUpdate({ userId }, { relationship: {} });
    res.success("Relationship was deleted successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
