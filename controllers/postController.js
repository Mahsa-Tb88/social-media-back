import Friend from "../models/friendSchema.js";
import Post from "../models/postSchema.js";
import mongoose from "mongoose";

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
export async function getPostById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  try {
    const post = await Post.findById(req.params.id).populate("userId");
    const user = await Friend.findOne({ userId: post.userId });

    const isFriend = user.listFriend.filter(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    if (req.userId != post.userId && !isFriend.length) {
      res.fail("Access denied: Not a friend", 400);
      return;
    }

    res.success("found posts of user successfully!", post);
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
export async function deletePost(req, res) {
  try {
    const findPost = await Post.findById(req.params.id);
    if (findPost) {
      if (req.userId != findPost.userId) {
        res.fail("You are not authorized to delete this post");
        return;
      } else {
        await Post.findByIdAndDelete(req.params.id);
        res.success("Post was deleted successfully!", 200);
        return;
      }
    } else {
      res.fail("This Id is not valid!");
      return;
    }
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
    console.log("erorrr", error);
    res.fail(error.message);
  }
}
