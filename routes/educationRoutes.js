import express from "express";
import {
  addEducation,
  deleteEducation,
  getEducation,
  updateEducation,
} from "../controllers/educationController.js";
const router = express.Router();

router.get("/:id", getEducation);
router.put("/new/:id", addEducation);
router.put("/edit/:id", updateEducation);
router.put("/delete/:id", deleteEducation);

export default router;
