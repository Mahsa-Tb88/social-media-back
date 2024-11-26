import { initialize } from "../controllers/miscControllers.js";
import express from "express";

const router = express.Router();

router.get("/initialize", initialize);

export default router;
