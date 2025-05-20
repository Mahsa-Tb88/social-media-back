import express from "express";
import {
  createNewPost,
  deletePost,
  editPostById,
  getPostsUserById,
  getPostById,
  likePost,
  homePosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/home", homePosts);
router.get("/:id", getPostsUserById);
router.get("/single/:id", getPostById);
router.post("/new", createNewPost);
router.delete("/:id", deletePost);
router.put("/edit/:id", editPostById);
router.put("/like/:id", likePost);

export default router;
