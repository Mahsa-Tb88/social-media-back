import express from "express";
const router = express.Router();
import { addFamily, deleteFamilyMember, editFamily } from "../controllers/familyController.js";

router.put("/delete/:id", deleteFamilyMember);
router.put("/new/:id", addFamily);
router.put("/edit/:id", editFamily);
export default router;