import express from "express";
import {
  createNewPost,
  deletePost,
  editPostById,
  getPostsUserById,
  getPostById,
} from "../controllers/postController.js";
import { isAuthorized } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/:id", getPostsUserById);
router.get("/single/:id", getPostById);
router.post("/new", createNewPost);
router.delete("/:id", deletePost);
router.put("/edit/:id", editPostById);

export default router;
