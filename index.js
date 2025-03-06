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
import overviewRoutes from "./routes/overviewRoutes.js";
import workRoutes from "./routes/workRoutes.js";
import infoRoutes from "./routes/infoRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import relationshipRoutes from "./routes/relationshipRoutes.js";
import familyRoutes from "./routes/familyRoutes.js";

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
app.use("/overviews", overviewRoutes);
app.use("/infos", infoRoutes);
app.use("/works", workRoutes);
app.use("/educations", educationRoutes);
app.use("/relationships", relationshipRoutes);
app.use("/families", familyRoutes);
app.use("/places", placeRoutes);
app.use("/friends", friendRoutes);

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to database");
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
} catch (error) {
  console.log(error.message);
}
