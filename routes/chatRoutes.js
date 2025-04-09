import express from "express";
import { getChats } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:id", getChats);

export default router;
