import mongoose, { Schema } from "mongoose";

const overviewSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    school: { type: String, default: "" },
    location: { type: String, default: "" },
    bornIn: { type: String, default: "" },
    status: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    viewer: { type: String, default: "private" },
  },
  { timestamps: true }
);

const Overview = mongoose.model("Overview", overviewSchema);

export default Overview;
