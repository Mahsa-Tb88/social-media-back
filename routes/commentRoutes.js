import express from "express";
import { getcommentsPost } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:id", getcommentsPost);

export default router;
