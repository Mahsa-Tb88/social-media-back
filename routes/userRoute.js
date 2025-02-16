import express from "express";
import {
  getUserById,
  updateOverview,
  getOverview,
  deleteItemOverview,
  updateConatctUserInfo,
  getContacUserInfo,
  deleteConatctUserInfo,
  getWork,
  updateWork,
  deleteWork,
  getEducation,
  updateEducation,
  deleteEducation,
  addNewWork,
  updateRelationship,
  addEducation,
  getFamilyRel,
  findUser,
  getAllUsers,
  deleteRelationship,
  deleteFamilyMember,
  addFamily,
  editFamily,
  getPlaceLived,
  addPlace,
  deletePlace,
  editPlace,
  makeFriend,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/search/findUser", findUser);

router.get("/overview/:id", getOverview);
router.put("/editOverview/:id", updateOverview);
router.put("/deleteOverview/:id", deleteItemOverview);

router.get("/contactBaseInfo/:id", getContacUserInfo);
router.put("/editContactBaseInfo/:id", updateConatctUserInfo);
router.put("/deleteContactBaseInfo/:id", deleteConatctUserInfo);

router.get("/work/:id", getWork);
router.put("/newWork/:id", addNewWork);
router.put("/editWork/:id", updateWork);
router.delete("/deleteWork/:id", deleteWork);

router.get("/education/:id", getEducation);
router.put("/newEducation/:id", addEducation);
router.put("/editEducation/:id", updateEducation);
router.put("/deleteEducation/:id", deleteEducation);

router.get("/familyRel/:id", getFamilyRel);

router.put("/editRelationship/:id", updateRelationship);
router.delete("/deleteRelationship/:id", deleteRelationship);

router.put("/deleteFamilyMember/:id", deleteFamilyMember);
router.put("/addFamily/:id", addFamily);
router.put("/editFamily/:id", editFamily);

router.get("/userPlaces/:id", getPlaceLived);
router.put("/addPlace/:id", addPlace);
router.put("/deletePlace/:id", deletePlace);
router.put("/editPlace/:id", editPlace);

router.put("/addFriend/:userId", makeFriend);

export default router;
