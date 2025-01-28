import express from "express";
import {
  getUserById,
  updateOverview,
  getUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);
router.get("/about/:id", getUserInfo);
router.put("/editOverview/:id", updateOverview);

export default router;
