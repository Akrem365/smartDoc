import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "2m",
  },
});

const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
