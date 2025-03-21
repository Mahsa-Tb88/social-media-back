import express from "express";
import {
  updateBackground,
  updateProfileImg,
  getPostsUserById,
  createNewPost,
  editUserById,
  editPostById,
  deletePost
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/background", updateBackground);
router.post("/profileImg", updateProfileImg);
router.get("/posts/:id", getPostsUserById);
router.post("/post", createNewPost);
router.delete("/post/:id", deletePost);
router.put("/post/edit/:id", editPostById);
router.put("/edit/:id", editUserById);

export default router;
