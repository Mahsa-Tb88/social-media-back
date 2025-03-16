import express from "express";
import {
  confirmFriend,
  makeFriend,
  removeRequestFriend,
  removeFriend
} from "../controllers/friendController.js";
import { findUserFriedns } from "../controllers/userController.js";
const router = express.Router();

router.put("/add/:userId", makeFriend);
router.put("/confirm/:userId", confirmFriend);
router.put("/delete/request/:userId", removeRequestFriend);
router.put("/delete/:userId", removeFriend);
export default router;
