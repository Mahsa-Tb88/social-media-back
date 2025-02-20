import mongoose from "mongoose";
import ContactBasicInfo from "../models/contactBaseInfoSchema.js";


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