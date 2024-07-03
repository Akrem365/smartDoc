import express from "express";
const router = express.Router();
import {
  register,
  login,
  updateUser,
  updateUserApproval,
  getAllUerNotApproved,
  deleteUser,
} from "../controller/authController.js";
import authenticateUser from "../middleware/Auth.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(authenticateUser, updateUser);
router
  .route("/user/:userId/approve")
  .put(authenticateUser, authorizeRoles("admin"), updateUserApproval);
router;
// router.route("/user/:userId/approve").put(authenticateUser, updateUserApproval);
router
  .route("/notApproved")
  .get(authenticateUser, authorizeRoles("admin"), getAllUerNotApproved);
// router.route("/notApproved").get(authenticateUser, getAllUerNotApproved);
router.route("/delete/:userID").delete(authenticateUser, deleteUser);
export default router;
