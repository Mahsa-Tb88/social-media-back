import express from "express";
import {
  changeToRead,
  getChats,
  sendChats,
  getAllMsgOfUser,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/:id", getChats);
router.get("/messages/:id", getAllMsgOfUser);
router.post("/:id", sendChats);
router.put("/:id", changeToRead);

export default router;
