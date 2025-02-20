import express from "express";

import {
  addNewWork,
  deleteWork,
  getWork,
  updateWork,
} from "../controllers/workController.js";

const router = express.Router();

router.get("/:id", getWork);
router.put("/new/:id", addNewWork);
router.put("/edit/:id", updateWork);
router.delete("/delete/:id", deleteWork);
export default router;
