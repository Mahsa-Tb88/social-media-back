import express from "express";
import { updateBackground } from "../controllers/profileController.js";

const router = express.Router();

router.post("/background", updateBackground);

export default router;
