import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import responseMiddleware from "./middlewares/responseMiddleWare.js";
import { checkToken } from "./middlewares/authMiddleWare.js";

import miscRoutes from "./routes/miscRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profleRoutes.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(responseMiddleware);
app.use(checkToken);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/misc", miscRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/users", userRoute);

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to database");
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
} catch (error) {
  console.log(error.message);
}
