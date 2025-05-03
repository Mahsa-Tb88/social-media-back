import express from "express";
import {
  createNewPost,
  deletePost,
  editPostById,
  getPostsUserById,
  getPostById,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/:id", getPostsUserById);
router.get("/single/:id", getPostById);
router.post("/new", createNewPost);
router.delete("/:id", deletePost);

router.put("/edit/:id", editPostById);

// router.put("/comment/:id", commentOnPost);
router.put("/like/:id", likePost);
// router.put("/notification/:id", updateIsSeenNotifi);
// router.put("/comment/delete/:id", deleteComment);
// router.get("/comments/:id", getAllCommentsOfPost);
// router.put("/comment/like/:id", likeOnComment);
// router.put("/reply/like/:id", likeOnReplyComment);

export default router;
