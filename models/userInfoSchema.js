import mongoose, { Schema } from "mongoose";

const userInfoSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    overview: { type: [Object], default: [] },
    contact: { type: [Object], default: [] },
    websites: { type: [Object], default: [] },
    baseInfo: { type: [Object], default: [] },
    work: { type: [Object], default: [] },
    education: { type: [Object], default: [] },
    relationship: { type: Object, default: {} },
    family: { type: [Object], default: [] },
    placeLived: { type: [Object], default: [] },
  },

  { timestamps: true }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

export default UserInfo;
