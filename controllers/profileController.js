import User from "../models/userSchema.js";

export async function updateBackground(req, res) {
  const { image, id } = req.body;
  if (req.userId !== id) {
    res.fail("You are not authorized to change picture", 400);
  }
  try {
    const user = await User.findByIdAndUpdate(id, { backgroundImg: image });
    res.success("updated Image Successfully!", 200);
  } catch (error) {
    res.fail(error.message, 500);
  }
}

export async function updateProfileImg(req, res) {
  const { image, id } = req.body;
  if (req.userId !== id) {
    res.fail("You are not authorized to change image", 400);
  }
  try {
    const user = await User.findByIdAndUpdate(id, { profileImg: image });
    res.success("updated Image Successfully!", 200);
  } catch (error) {
    res.fail(error.message, 500);
  }
}
