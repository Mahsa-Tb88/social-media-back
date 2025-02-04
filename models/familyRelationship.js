import mongoose, { Schema } from "mongoose";

const familyRelSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    relationship: { type: Object, default: "" },
    family: { type: [Object], default: [] },
  },

  { timestamps: true }
);

const FamilyRel = mongoose.model("FamilyRel", familyRelSchema);

export default FamilyRel;
