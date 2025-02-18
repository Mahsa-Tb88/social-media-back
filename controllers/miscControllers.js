import Category from "../models/categoryScheme.js";
import Friend from "../models/friendSchema.js";
import User from "../models/userSchema.js";

export async function initialize(req, res) {
  let user, categories;

  try {
    categories = await Category.find();

    if (req.username) {
      user = await User.findOne({ username: req.username });
      user.password = undefined;
      //find user's friends
      let friends;
      friends = await Friend.findOne({ userId: user._id.toString() });
      if (!friends) {
        friends = { listFriend: [], viewer: "friends" };
      }
      res.success("Initialized successfully!", { categories, user, friends });
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
