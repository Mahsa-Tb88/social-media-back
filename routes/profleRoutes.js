import express from "express";
import {
  updateBackground,
  updateProfileImg,
  getPostsUserById,
  createNewPost,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/background", updateBackground);
router.post("/profileImg", updateProfileImg);
router.get("/posts/:id", getPostsUserById);
router.post("/post", createNewPost);

export default router;
