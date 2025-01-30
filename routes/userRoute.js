import express from "express";
import {
  getUserById,
  updateOverview,
  getOverview,
  deleteItemOverview,
  updateConatctUserInfo,
  getContacUserInfo,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);

router.get("/overview/:id", getOverview);
router.put("/editOverview/:id", updateOverview);
router.put("/deleteOverview/:id", deleteItemOverview);

router.get("/contactBaseInfo/:id", getContacUserInfo);
router.put("/editContactBaseInfo/:id", updateConatctUserInfo);

export default router;
