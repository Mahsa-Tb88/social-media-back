import express from "express";
import {
  getUserById,
  findUser,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/search/findUser", findUser);



export default router;
