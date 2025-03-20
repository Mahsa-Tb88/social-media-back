import mongoose from "mongoose";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";

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
export async function editPostById(req, res) {
  const { title, desc, image, video, feeling, viewer, userId, id } = req.body;
  if (req.userId !== userId) {
    res.fail("You are not authorized to edit this post");
  }
  try {
    const post = await Post.findById(id);
    await Post.findByIdAndUpdate(id, {
      title: title ? title : post.title,
      desc: desc ? desc : post.desc,
      image: image == "noImage" ? "" : image != "noImage" ? image : post.image,
      video: video ? video : post.video,
      feeling: feeling ? feeling : post.feeling,
      viewer: viewer ? viewer : post.viewer,
    });

    res.success("Post was updated successfully!", 200);
  } catch (error) {
    res.fail(error.message);
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
