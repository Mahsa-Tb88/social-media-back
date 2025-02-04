import mongoose, { Schema } from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    degree: { type: String, default: "" },
    field: { type: String, required: true },
    isCurrently: { type: Boolean, default: false },
    university: { type: String, default: "" },
    viewer: { type: String, default: "" },
    startYear: { type: Number, default: "" },
    endYear: { type: Number, default: "" },
  },

  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);

export default Education;
