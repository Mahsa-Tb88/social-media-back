import mongoose from "mongoose";
import FamilyRel from "../models/familyRelationship.js";

export async function addFamily(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const findUser = await FamilyRel.findOne({ userId });

    if (findUser) {
      await FamilyRel.findOneAndUpdate(
        { userId },
        { family: [...findUser.family, req.body.family] }
      );
    } else {
      await FamilyRel.create({ userId, family: req.body.family });
    }
    res.success("new family was added successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}

export async function editFamily(req, res) {
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
    const findUser = await FamilyRel.findOne({ userId });
    const updatedFamilyMembers = findUser.family.map((m) => {
      if (m.id == req.body.userUpdatedId) {
        return { ...m, status: req.body.status };
      } else {
        return m;
      }
    });

    await FamilyRel.findOneAndUpdate(
      { userId },
      { family: updatedFamilyMembers }
    );
    res.success("Family member was updated successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}

export async function deleteFamilyMember(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  try {
    const findUser = await FamilyRel.findOne({ userId });

    const updatedFamilyMember = findUser.family.filter(
      (user) => user.id != req.body.userDeleteId
    );
    await FamilyRel.findOneAndUpdate(
      { userId },
      { family: updatedFamilyMember }
    );
    res.success(" The family member was deleted successfully");
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
  const { viewer, itemId } = req.body;
  try {
    const family = await FamilyRel.findOne({ userId: id });
    const updatedFamily = family.family.map((f) => {
      if (f.id == itemId) {
        return { ...f, viewer };
      } else {
        return f;
      }
    });
    await FamilyRel.findOneAndUpdate({ userId: id }, { family: updatedFamily });
    res.success("Filter viewer is applied successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
