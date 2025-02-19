import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Overview from "../models/overviewSchema.js";
import ContactBasicInfo from "../models/contactBaseInfoSchema.js";

import Work from "../models/workSchema.js";
import Education from "../models/educationSchema.js";
import FamilyRel from "../models/familyRelationship.js";
import PlaceLived from "../models/placeLived.js";
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

export async function makeFriend(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { userId, id, username, profileImg, status } = req.body;
  try {
    const findUser = await Friend.findOne({ userId });
    if (findUser) {
      const findFriend = findUser.listFriend.find((f) => f.id == id);

      let updatedListFriend;
      if (findFriend) {
        updatedListFriend = Friend.listFriend.map((f) => {
          if (f.id == id) {
            return { ...f, status };
          } else {
            f;
          }
        });
      } else {
        updatedListFriend = [
          ...findUser.listFriend,
          { id, username, profileImg, status },
        ];
      }

      await Friend.findOneAndUpdate(
        { userId },
        { listFriend: updatedListFriend }
      );
    } else {
      await Friend.create({
        userId,
        listFriend: [{ id, username, profileImg, status }],
        viewer: "friends",
      });
    }
    res.success("user was added to list of friends successfully!");
  } catch (error) {
    console.log("errorrrr", error.message);
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

//place lived
export async function getPlaceLived(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  try {
    const places = await PlaceLived.findOne({ userId });
    res.success("Place was found successfully!", places);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function addPlace(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { hometown, currentCity, usedToLiveCity } = req.body;
  try {
    const places = await PlaceLived.findOne({ userId });

    if (places) {
      if (hometown) {
        await PlaceLived.findOneAndUpdate({ userId }, { hometown });
      } else if (currentCity) {
        await PlaceLived.findOneAndUpdate({ userId }, { currentCity });
      } else {
        await PlaceLived.findOneAndUpdate(
          { userId },
          { usedToLiveCity: [...places.usedToLiveCity, usedToLiveCity] }
        );
      }
    } else {
      await PlaceLived.create({
        userId,
        hometown,
        currentCity,
        usedToLiveCity: usedToLiveCity ? [usedToLiveCity] : [],
      });
    }

    res.success("Place was found successfully!", places);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function editPlace(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { hometown, currentCity, usedToLiveCity } = req.body;
  try {
    const places = await PlaceLived.findOne({ userId });

    if (hometown) {
      await PlaceLived.findOneAndUpdate(
        { userId },
        { hometown: { ...places.hometown, value: hometown.value } }
      );
    }
    if (currentCity) {
      await PlaceLived.findOneAndUpdate(
        { userId },
        { hometown: { ...places.currentCity, value: currentCity.value } }
      );
    }
    if (usedToLiveCity) {
      const updatedUsedToLiveCity = places.usedToLiveCity.map((c) => {
        if (c.id == usedToLiveCity.id) {
          return { ...c, value: usedToLiveCity.value };
        } else {
          return c;
        }
      });

      await PlaceLived.findOneAndUpdate(
        { userId },
        { usedToLiveCity: updatedUsedToLiveCity }
      );
    }
    res.success("Place was found successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}

export async function deletePlace(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const places = await PlaceLived.findOne({ userId });
    if (req.body.title == "hometown") {
      await PlaceLived.findOneAndUpdate({ userId }, { hometown: {} });
    } else if (req.body.title == "currentCity") {
      await PlaceLived.findOneAndUpdate({ userId }, { currentCity: {} });
    } else {
      const updatedPlace = places.usedToLiveCity.filter(
        (item) => req.body.titleId != item.id
      );
      await PlaceLived.findOneAndUpdate(
        { userId },
        { usedToLiveCity: updatedPlace }
      );
    }
    res.success("Place was found successfully!", places);
  } catch (error) {
    res.fail(error.message);
  }
}
