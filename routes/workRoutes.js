import express from "express";

import {
  addNewWork,
  deleteWork,
  getWork,
  updateWork,
  filterViewer,
} from "../controllers/workController.js";
import { isAuthorized } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/:id", getWork);
router.put("/new/:id", addNewWork);
router.put("/edit/:id", updateWork);
router.delete("/delete/:id", deleteWork);
router.put("/viewer/:id", filterViewer);
export default router;
