import express from "express";
import {
  deleteItemOverview,
  getOverview,
  updateOverview,
  filterViewer,
  editIntro,
} from "../controllers/overviewController.js";

const router = express.Router();


router.get("/:id", getOverview);
router.put("/edit/:id", updateOverview);
router.put("/edit/intro/:id", editIntro);
router.put("/delete/:id", deleteItemOverview);
router.put("/viewer/:id", filterViewer);

export default router;
