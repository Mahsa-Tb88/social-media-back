import express from "express";
import {
  deleteComment,
  getcommentsPost,
  leaveComment,
  likeComment,
  seenNotification,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:id", getcommentsPost);
router.post("/:id", leaveComment);
router.put("/like/:id", likeComment);
router.put("/delete/:id", deleteComment);
router.put("/notificationSeen/:id", seenNotification);

export default router;
