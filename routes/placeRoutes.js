import express from "express";
import {
  addPlace,
  deletePlace,
  editPlace,
  getPlaceLived,
  filterViewer,
} from "../controllers/placeController.js";
import { isAuthorized } from "../middlewares/authMiddleWare.js";
const router = express.Router();

router.get("/:id", getPlaceLived);
router.put("/new/:id", addPlace);
router.put("/delete/:id", deletePlace);
router.put("/edit/:id", editPlace);
router.put("/viewer/:id", filterViewer);

export default router;
