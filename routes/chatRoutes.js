import express from "express";
import {
  changeToRead,
  getChats,
  sendChats,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/:id", getChats);
router.post("/:id", sendChats);
router.put("/:id", changeToRead);

export default router;
