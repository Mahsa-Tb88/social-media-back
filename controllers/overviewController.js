import mongoose from "mongoose";
import Overview from "../models/overviewSchema.js";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";

export async function getOverview(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.fail("This userId is not valid!");
      return;
    }
    const userFriend = await Friend.findOne({ userId: req.params.id });
    let isFriend;
    if (userFriend) {
      isFriend = userFriend.listFriend.find(
        (friend) => friend.id == req.userId && friend.status == "accepted"
      );
    }

    isFriend = isFriend ? true : false;
    const isOwner = req.userId == req.params.id ? true : false;

    const findOverview = await Overview.findOne({
      userId: req.params.id,
    });
    let overview = {};
    if (findOverview) {
      const data = findOverview.toObject();
      Object.keys(data).forEach((item) => {
        if (
          data[item].viewer == "public" ||
          (data[item].viewer == "friends" && isFriend)
        ) {
          overview[item] = data[item];
        }

        if (isOwner) {
          overview[item] = data[item];
        }
      });
    }
    res.success("UserInfo was found successfully", {
      overview,
      isFriend,
      isOwner,
    });
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

export async function editIntro(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (req.params.id != req.userId) {
    res.fail("You are not authorized");
    return;
  }
  const { Pronounce, School, Location, Hometown, Status } = req.body;
  try {
    const overview = await Overview.findOne({ userId: req.params.id });

    if (overview) {
      await Overview.findOneAndUpdate(
        { userId: req.params.id },
        {
          Pronounce: Pronounce ? Pronounce : overview.Pronounce,
          School: School ? School : overview.School,
          Location: Location ? Location : overview.Location,
          Hometown: Hometown ? Hometown : overview.Hometown,
          Status: Status ? Status : overview.Status,
        }
      );
    } else {
      await Overview.create({
        userId: req.params.id,
        Pronounce,
        School,
        Location,
        Hometown,
        Status,
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
    const overview = await Overview.findOne({ userId: id });
    const overview2 = await Overview.findOneAndUpdate(
      { userId: id },
      { [subject]: { ...overview[subject], viewer } }
    );
    res.success("Filter viewer is applied successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
