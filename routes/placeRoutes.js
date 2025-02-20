import express from "express";
import {
  addPlace,
  deletePlace,
  editPlace,
  getPlaceLived,
} from "../controllers/placeController.js";
const router = express.Router();

router.get("/:id", getPlaceLived);
router.put("/new/:id", addPlace);
router.put("/delete/:id", deletePlace);
router.put("/edit/:id", editPlace);
export default router;