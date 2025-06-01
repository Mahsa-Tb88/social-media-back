import Friend from "../models/friendSchema.js";
import Notification from "../models/notificationSchema.js";
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

    const findPosts = await Post.find({ userId: req.params.id }).populate({
      path: "likes",
      select: "username profileImg _id",
    });
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
    const post = await Post.findById(req.params.id)
      .populate("userId")
      .populate({ path: "likes", select: "username profileImg _id" });

    const user = await Friend.findOne({ userId: post.userId._id });

    const isFriend = user.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );

    if (
      req.userId != post.userId._id &&
      !isFriend &&
      post.viewer == "private"
    ) {
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
      likes: [],
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

    await Post.findByIdAndUpdate(id, {
      title,
      desc,
      image,
      video,
      feeling,
      viewer,
    });
    res.success("Post was updated successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}
export async function likePost(req, res) {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    const findFriend = await Friend.findOne({ userId: post.userId.toString() });
    const isFriend = findFriend.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    const isOwner = post.userId.toString() == req.userId ? true : false;
    if (userId != req.userId) {
      res.fail("You are not authorized to like comments!");
      return;
    }

    if (!isOwner) {
      if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
        res.fail("You are not authorized to see comments!");
        return;
      }
    }

    const findUser = post.likes.find((u) => u == userId);
    let likes;
    if (findUser) {
      likes = post.likes.filter((u) => u != userId);
    } else {
      likes = [...post.likes, userId];

      if (req.userId !== post.userId.toString()) {
        await Notification.create({
          postId: id,
          userId,
          userGetNotifi: post.userId.toString(),
          type: "post",
          text: post.title ? post.title : post.desc,
        });
      }
    }
    await Post.findByIdAndUpdate(id, { likes });

    res.success("Post was updated successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

export async function homePosts(req, res) {
  const { userId } = req.query;
  try {
    let postsList = [];
    if (userId) {
      let friends;
      if (userId == req.userId) {
        const userFrineds = await Friend.findOne({ userId });
        friends = userFrineds.listFriend.filter((f) => f.status == "accepted");
        const userIds = friends.map((f) => f.id);
        let posts = await Post.find({ userId: { $in: userIds } })
          .populate({
            path: "userId",
            select: "username profileImg _id",
          })
          .populate({ path: "likes", select: "username profileImg _id" });
        posts = posts.filter((post) => post.viewer == "friends");
        postsList = [...posts];
      }
    }
    const posts = await Post.find({ viewer: "public" })
      .populate({
        path: "userId",
        select: "username profileImg _id",
      })
      .populate({ path: "likes", select: "username profileImg _id" });

    postsList = [...postsList, ...posts];
    res.success("Posts has found successfully!", postsList);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}
