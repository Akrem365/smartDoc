import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import Notification from "../models/Notifications.js";
const getNotificationByUser = async (req, res) => {
  try {
    const notfi = await Notification.find({ userId: req.user.userId });
    if (!notfi) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `No history  found for user with id ${userId}`,
      });
    }
    res.status(StatusCodes.OK).json(notfi);
  } catch (error) {
    console.error("Error get notifications by user id:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
const deleteAllnotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res
      .status(StatusCodes.OK)
      .json({ message: "All notifications deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
export { getNotificationByUser, deleteAllnotifications };
