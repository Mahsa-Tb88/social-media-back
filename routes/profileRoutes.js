import express from "express";
import {
  updateBackground,
  updateProfileImg,
  editUserById,
  getGalleryById,
} from "../controllers/profileController.js";
import { isAuthorized } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/background", updateBackground);
router.post("/profileImg", updateProfileImg);
router.put("/edit/:id", editUserById);
router.get("/gallery/:id", isAuthorized, getGalleryById);

export default router;
