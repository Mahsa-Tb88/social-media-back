import express from "express";
import { getOverview, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);

router.get("/overview/:id", getOverview);

export default router;
