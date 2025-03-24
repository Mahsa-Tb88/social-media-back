import express from "express";
import {
  updateBackground,
  updateProfileImg,
  editUserById,
  getPhotosById,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/background", updateBackground);
router.post("/profileImg", updateProfileImg);
router.put("/edit/:id", editUserById);
router.get("/gallery/:id", getPhotosById);

export default router;
