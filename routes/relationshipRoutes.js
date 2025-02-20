import express from "express";
import {
  deleteRelationship,
  getFamilyRel,
  updateRelationship,
} from "../controllers/RelationshipController.js";
const router = express.Router();

router.get("/:id", getFamilyRel);
router.put("/edit/:id", updateRelationship);
router.delete("/delete/:id", deleteRelationship);

export default router;