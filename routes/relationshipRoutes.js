import express from "express";
import {
  deleteRelationship,
  getFamilyRel,
  updateRelationship,
  filterViewer,
} from "../controllers/RelationshipController.js";
const router = express.Router();

router.get("/:id", getFamilyRel);
router.put("/edit/:id", updateRelationship);
router.delete("/delete/:id", deleteRelationship);
router.put("/viewer/:id", filterViewer);

export default router;
