import express from "express";
import {
  getcommentsPost,
  leaveComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:id", getcommentsPost);
router.get("/:id", leaveComment);

export default router;
