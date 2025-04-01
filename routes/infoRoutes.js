import express from "express";
import {
  deleteConatctUserInfo,
  getContacUserInfo,
  updateConatctUserInfo,
  filterViewer,
} from "../controllers/infosController.js";
import { isAuthorized } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/:id", getContacUserInfo);
router.put("/edit/:id", updateConatctUserInfo);
router.put("/delete/:id", deleteConatctUserInfo);
router.put("/viewer/:id", filterViewer);
export default router;
