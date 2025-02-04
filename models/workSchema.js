import mongoose, { Schema } from "mongoose";

const workSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    position: { type: String, require: true },
    company: { type: String, default: "" },
    isCurrently: { type: Boolean, default: false },
    city: { type: String, default: "" },
    viewer: { type: String, default: "friends" },
    startYear: { type: Number, default: "" },
    endYear: { type: Number, default: "" },
  },

  { timestamps: true }
);

const Work = mongoose.model("Work", workSchema);

export default Work;
