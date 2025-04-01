import express from "express";
import {
  addEducation,
  deleteEducation,
  getEducation,
  updateEducation,
  filterViewer
} from "../controllers/educationController.js";
import { isAuthorized } from "../middlewares/authMiddleWare.js";
const router = express.Router();

router.get("/:id", getEducation);
router.put("/new/:id", addEducation);
router.put("/edit/:id", updateEducation);
router.put("/delete/:id", deleteEducation);
router.put("/viewer/:id", filterViewer);

export default router;
