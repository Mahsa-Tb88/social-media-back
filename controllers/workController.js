import mongoose from "mongoose";
import Work from "../models/workSchema.js";

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
    const work = await Work.findOne({ userId: id });
    await Work.findOneAndUpdate(
      { userId: id },
      { [subject]: { ...work[subject], viewer } }
    );
    res.success("Filter viewer is applied successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
