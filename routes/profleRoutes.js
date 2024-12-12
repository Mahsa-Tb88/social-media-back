import express from "express";
import { updateBackground,updateProfileImg } from "../controllers/profileController.js";

const router = express.Router();

router.post("/background", updateBackground);
router.post("/profileImg", updateProfileImg);

export default router;
