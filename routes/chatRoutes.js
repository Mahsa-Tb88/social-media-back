import express from "express";
import { getChats, sendChats } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:id", getChats);
router.post("/:id", sendChats);

export default router;
