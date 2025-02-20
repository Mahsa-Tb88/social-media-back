import express from "express";
import {
  deleteConatctUserInfo,
  getContacUserInfo,
  updateConatctUserInfo,
} from "../controllers/infosController.js";

const router = express.Router();

router.get("/:id", getContacUserInfo);
router.put("/edit/:id", updateConatctUserInfo);
router.put("/delete/:id", deleteConatctUserInfo);
export default router;