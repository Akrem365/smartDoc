import express from "express";
import authenticateUser from "../middleware/Auth.js";
const router = express.Router();
import {
  getNotificationByUser,
  deleteAllnotifications,
} from "../controller/NotificationsController.js";
router.route("/").get(authenticateUser, getNotificationByUser);
router.route("/delete").delete(deleteAllnotifications);

export default router;
