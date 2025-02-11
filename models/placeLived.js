import mongoose, { Schema } from "mongoose";

const placeLived = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hometown: { type: Object, default: "" },
    currentCity: { type: Object, default: "" },
    usedToLiveCity: { type: Array, default: [] },
  },

  { timestamps: true }
);

const PlaceLived = mongoose.model("PlaceLived", placeLived);

export default PlaceLived;
