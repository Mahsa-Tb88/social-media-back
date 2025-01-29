import express from "express";
import {
  getUserById,
  updateOverview,
  getUserInfo,
  deleteItemOverview,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);
router.get("/about/:id", getUserInfo);
router.put("/editOverview/:id", updateOverview);
router.put("/deleteOverview/:id", deleteItemOverview);

export default router;
