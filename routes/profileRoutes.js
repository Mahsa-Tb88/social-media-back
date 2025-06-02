import express from "express";
import {
  updateBackground,
  updateProfileImg,
  editUserById,
  getGalleryByUserId,
} from "../controllers/profileController.js";
import { logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/background", updateBackground);
router.post("/profileImg", updateProfileImg);
router.put("/edit/:id", editUserById);
router.get("/gallery/:id", getGalleryByUserId);

export default router;
