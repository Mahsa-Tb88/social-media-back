import express from "express";
import {
  getUserById,
  getAllUsers,
  findUserFriedns,
  getUserIntro,
  getSearchUser,
  findUser,
  findMutualUserFriedns
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/intro/:id", getUserIntro);
router.get("/:id", getUserById);
router.get("/username/search/", getSearchUser);
router.get("/search/findUser", findUser);
router.get("/friends/:id", findUserFriedns);
router.get("/mutual/friend/:id", findMutualUserFriedns);

export default router;
