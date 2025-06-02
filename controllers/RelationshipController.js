import mongoose from "mongoose";
import FamilyRel from "../models/familyRelationship.js";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";

export async function getFamilyRel(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.fail("This id is not valid!");
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
    const findFamilyRel = await FamilyRel.findOne({ userId: req.params.id });

    let relationship = {};
    let family = [];
    if (findFamilyRel) {
      findFamilyRel?.family.forEach((w) => {
        if (w.viewer == "public" || (w.viewer == "friends" && isFriend)) {
          family.push(w);
        }
      });

      if (
        findFamilyRel?.relationship.viewer == "public" ||
        (findFamilyRel?.relationship.viewer == "friends" && isFriend)
      ) {
        relationship = findFamilyRel.relationship;
      }

      if (isOwner) {
        family = findFamilyRel?.family || [];
        relationship = findFamilyRel?.relationship || {};
      }
    }

    res.success("workEducation was found successfully!", [
      { relationship, family },
      isFriend,
      isOwner,
    ]);
  } catch (error) {
    console.log("error", error);
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
  const { viewer } = req.body;
  try {
    const user = await FamilyRel.findOne({ userId: id });
    await FamilyRel.findOneAndUpdate(
      { userId: id },
      { relationship: { ...user.relationship, viewer } }
    );
    res.success("Filter viewer is applied successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
