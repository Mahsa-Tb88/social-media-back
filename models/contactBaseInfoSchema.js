import mongoose, { Schema } from "mongoose";

const contactBasicInfoSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    Mobile: { type: Object },
    Email: { type: Object },
    Website: { type: Object },
    Linkedin: { type: Object },
    Github: { type: Object },
    Gender: { type: Object },
    Pronouns: { type: Object },
    Birthday: { type: Object },
    Language: { type: Object },
  },

  { timestamps: true }
);

const ContactBasicInfo = mongoose.model(
  "ContactBasicInfo",
  contactBasicInfoSchema
);

export default ContactBasicInfo;
