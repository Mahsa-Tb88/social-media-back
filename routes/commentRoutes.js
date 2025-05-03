import express from "express";
import {
  getcommentsPost,
  leaveComment,
  likeComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:id", getcommentsPost);
router.post("/:id", leaveComment);
router.put("/:id", likeComment);

export default router;
