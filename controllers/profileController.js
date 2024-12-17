import mongoose from "mongoose";
import Post from "../models/postSchema.js";
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

export async function getPostsUserById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  try {
    const posts = await Post.find({ userId: req.params.id });
    console.log(",,,,", posts);
    res.success("found posts of user successfully!", posts);
  } catch (error) {
    res.fail(error.message, 500);
  }
}

export async function createNewPost(req, res) {
  const { title, desc, image, video, feeling, viewer, id } = req.body;
  if (req.userId !== id) {
    res.fail("You are not authorized to create this post");
  }

  try {
    const newPost = await Post.create({
      title,
      desc,
      userId: id,
      image,
      viewer,
      feeling,
      video,
    });
    res.success("New post created successfully!", newPost, 200);
  } catch (error) {
    res.fail(error.message);
  }
}
