import mongoose from "mongoose";

const NotificationsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    patientLastName: {
      type: String,
      required: true,
    },
    anomalyReason: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notifications", NotificationsSchema);
export default Notification;
