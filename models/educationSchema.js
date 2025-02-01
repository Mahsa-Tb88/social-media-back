import mongoose, { Schema } from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    isCurrently: { type: Boolean, default: false },
    university: { type: String, default: "" },
    viewer: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" },
  },

  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);

export default Education;
