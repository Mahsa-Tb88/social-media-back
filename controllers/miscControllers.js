import Category from "../models/categoryScheme.js";
import User from "../models/userSchema.js";

export async function initialize(req, res) {
  let user, categories;
  try {
    categories = await Category.find();
  } catch (error) {
    res.fail("Something is wrong", 500);
  }
  try {
    if (req.username) {
      const user = await User.findOne(req.username);
      res.success("Initialized successfully!", { categories, user });
    } else {
      res.success("Initialized successfully!", { categories });
    }
  } catch (error) {
    res.fail(error.message, 400);
  }
}
