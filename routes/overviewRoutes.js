import express from "express";
import {
  deleteItemOverview,
  getOverview,
  updateOverview,
} from "../controllers/overviewController.js";

const router = express.Router();

router.get("/:id", getOverview);
router.put("/edit/:id", updateOverview);
router.put("/delete/:id", deleteItemOverview);
export default router;
