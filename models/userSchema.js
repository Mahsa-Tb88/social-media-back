import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false },
    backgroundImg: { type: String, default: "" },
    profileImg: { type: String, default: "" },
    bio: { type: String, default: "", viewer: "private" },
    username: { type: String, required: true, unique: true },
    emailRegister: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    viewerProfile: { type: String, default: "privatee" },
    overView: {
      type: [Object],
      default: [
        { school: "", viewer: "private" },
        { location: "", viewer: "privatee" },
        { hometown: "", viewer: "private" },
        { status: "", viewer: "private" },
        { cellphone: "", viewer: "private" },
        { email: "", viewer: "private" },
      ],
    },
    contact: {
      type: [Object],
      default: [
        { mobile: "", viewer: "private" },
        { email: "", viewer: "private" },
      ],
    },
    websites: {
      type: [Object],
      default: [
        { website: "", viewer: "private" },
        { linkedIn: "", viewer: "private" },
        { github: "", viewer: "private" },
      ],
    },
    baseInfo: {
      type: [Object],
      default: [
        { gender: "", viewer: "private" },
        { pronouns: "", viewer: "private" },
        { birthday: "", viewer: "private" },
        { language: "", viewer: "private" },
      ],
    },
    work: {
      type: [Object],
      default: [
        {
          position: "",
          company: "",
          startYear: "",
          endYear: "",
          isCurrently: false,
          city: "",
          viewer: "private",
        },
      ],
    },
    education: {
      type: [Object],
      default: [
        {
          degree: "",
          field: "",
          university: "",
          startYear: "",
          endYear: "",
          isCurrently: false,
          viewer: "private",
        },
      ],
    },
    relationship: {
      type: Object,
      default: { username: "", profileImg: "", status: "", viewer: "private" },
    },
    family: {
      type: [Object],
      default: [
        { username: "", profileImg: "", status: "", viewer: "private" },
      ],
    },
    placeLived: {
      type: [Object],
      default: [
        { city: "", status: "hometown", viewer: "private" },
        { city: "", status: "currently live", viewer: "private" },
        { city: "", status: "used to live", viewer: "private" },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
