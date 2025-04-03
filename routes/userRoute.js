import express from "express";
import {
  getUserById,
  findUser,
  getAllUsers,
  findUserFriedns,
  getUserIntro,
} from "../controllers/userController.js";


const router = express.Router();

router.get("/", getAllUsers);
router.get("/intro/:id", getUserIntro);
router.get("/:id", getUserById);
router.get("/search/findUser", findUser);
router.get("/friends/:id", findUserFriedns);

export default router;
