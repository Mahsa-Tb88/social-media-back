import express from "express";
import { makeFriend, removeFriend } from "../controllers/friendController.js";
const router = express.Router();

router.put("/add/:userId", makeFriend);
router.put("/delete/:userId", removeFriend);
export default router;
