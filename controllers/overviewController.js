
import mongoose from "mongoose";
import Overview from "../models/overviewSchema.js";


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
