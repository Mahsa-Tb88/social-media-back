import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import Post from "../models/postSchema.js";

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

export async function editUserById(req, res) {
  const { username, work, livesIn, password, email } = req.body;
  const id = req.params.id;

  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  console.log(id, req.userId);
  if (id != req.userId) {
    res.fail("You are not athorize to edit");
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.findByIdAndUpdate(id, {
      username,
      work,
      livesIn,
      password: hashPassword,
      email,
    });

    res.success("user info updated Successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}

export async function getGalleryById(req, res) {
  const id = req.params.id;
 
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  

  try {
    const posts = await Post.find({ userId: id });
    const photos = [];
    posts.forEach((p) => {
      if (p.image) {
        photos.push({ image: p.image, id: p._id.toString() });
      }
    });

    const videos = [];
    posts.forEach((v) => {
      if (v.video) {
        videos.push({ video: v.video, id: p._id.toString() });
      }
    });
    res.success("user info updated Successfully!", { photos, videos });
  } catch (error) {
    res.fail(error.message);
  }
}
