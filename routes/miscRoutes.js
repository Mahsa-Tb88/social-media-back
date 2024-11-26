import express from "express";

import { initialize } from "../controllers/miscControllers.js";

const router = express.Router();

router.get("/initialize", initialize);

export default router;
