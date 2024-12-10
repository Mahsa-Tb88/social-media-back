import express from "express";

import { initialize } from "../controllers/miscControllers.js";
import uploadMiddileware from "../middlewares/uploadMiddleware.js";
import { uploadFile } from "../controllers/miscControllers.js";

const router = express.Router();

router.get("/initialize", initialize);
router.post("/uploads", uploadMiddileware, uploadFile);

router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.fail("اندازه فایل نباید بیشتر از 1 مگابایت باشد");
  } else if (err.code === "INVALID_EXTENSION") {
    res.fail("نوع فایل مجاز نیست");
  }
});

export default router;
