import Category from "../models/categoryScheme.js";

export async function initialize(req, res) {
  console.log("initialize...");
  let user, categories;
  try {
    categories = await Category.find();
  } catch (error) {
    res.fail("Something is wrong", 500);
  }
  try {
    if (req.username) {
    } else {
      res.success("Initialized successfully!", { categories });
    }
  } catch (error) {
    res.fail(error.message, 400);
  }
}
