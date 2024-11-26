import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import responseMiddleware from "./middlewares/responseMiddleWare.js";
import { checkToken } from "./middlewares/authMiddleWare.js";

import miscRoutes from "./routes/miscRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credential: true,
  })
);
app.use(responseMiddleware);
app.use(checkToken);

app.use("/misc", miscRoutes);

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to database");
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
} catch (error) {
  console.log(error.message);
}
