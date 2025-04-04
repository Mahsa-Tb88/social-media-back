import Friend from "../models/friendSchema.js";
import Post from "../models/postSchema.js";
import mongoose from "mongoose";

export async function getPostsUserById(req, res) {
  const id = req.params.id;
  const isValid = mongoose.isValidObjectId(id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  try {
    const userFriends = await Friend.findOne({ userId: id });

    const findFriend = userFriends.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    const isFriend = findFriend ? true : false;
    const isOwner = req.userId == id ? true : false;

    const findPosts = await Post.find({ userId: req.params.id });
    let posts = [];
    findPosts.forEach((p) => {
      if (p.viewer == "public" || (p.viewer == "friends" && isFriend)) {
        posts.push(p);
      }
    });
    if (isOwner) {
      posts = findPosts;
    }

    res.success("found posts of user successfully!", posts);
  } catch (error) {
    res.fail(error.message, 500);
  }
}
export async function getPostById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This Id is not valid!");
    return;
  }
  try {
    const post = await Post.findById(req.params.id).populate("userId");

    const user = await Friend.findOne({ userId: post.userId._id });

    const isFriend = user.listFriend.filter(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    if (req.userId != post.userId._id && !isFriend.length) {
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
  console.log("req.body", req.body);
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
