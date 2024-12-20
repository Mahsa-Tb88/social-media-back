import Category from "../models/categoryScheme.js";
import User from "../models/userSchema.js";

export async function initialize(req, res) {
  let user, categories;

  try {
    categories = await Category.find();

    if (req.username) {
      user = await User.findOne({ username: req.username });
      user.password = undefined;
      res.success("Initialized successfully!", { categories, user });
    } else {
      res.success("Initialized successfully!", { categories });
    }
  } catch (error) {
    res.fail(error.message, 500);
  }
}
export async function uploadFile(req, res) {
  const filename = req.file.filename;

  const body = {
    filename: filename,
    url: "/uploads" + "/" + filename,
  };
  res.success("The file was uploaded successfully!", body);
}
