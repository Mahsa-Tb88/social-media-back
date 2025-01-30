import mongoose, { Schema } from "mongoose";

const overviewSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    School: { type: Object },
    Location: { type: Object },
    Hometown: { type: Object },
    Status: { type: Object },
    Phone: { type: Object },
    Email: { type: Object },
  },

  { timestamps: true }
);

const Overview = mongoose.model("Overview", overviewSchema);

export default Overview;
