import Comment from "../models/commentSchema.js";
import Friend from "../models/friendSchema.js";
import Post from "../models/postSchema.js";

export async function getcommentsPost(req, res) {
  const id = req.params.id;

  try {
    const post = await Post.findById(id);
    const findFriend = await Friend.findOne({ userId: post.userId.toString() });
    const isFriend = findFriend.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    const isOwner = post.userId.toString() == req.userId ? true : false;
    if (!isOwner) {
      if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
        res.fail("You are not authorized to see comments!");
        return;
      }
    }

    const comments = await Comment.find({ postId: id, replyTo: null })
      .populate({
        path: "replies",
        populate: [
          {
            path: "userId",
            select: "username profileImg _id",
          },
        ],
      })
      .populate({
        path: "userId",
        select: "username profileImg _id", // only include these fields
      })
      .populate({
        path: "likes",
        select: "username profileImg _id",
      })
      .populate({
        path: "replies",
        populate: [
          {
            path: "likes",
            select: "username profileImg _id",
          },
        ],
      });

    res.success("commnets was found successfully!", comments);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

export async function leaveComment(req, res) {
  const id = req.params.id;
  const { postId, userId, text, replyTo } = req.body;

  try {
    const post = await Post.findById(id);
    const findFriend = await Friend.findOne({ userId: post.userId.toString() });
    const isFriend = findFriend.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    const isOwner = post.userId.toString() == req.userId ? true : false;
    if (userId != req.userId) {
      res.fail("You are not authorized to see comments!");
      return;
    }
    if (!isOwner) {
      if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
        res.fail("You are not authorized to see comments!");
        return;
      }
    }

    if (replyTo) {
      const newComment = await Comment.create({
        postId,
        userId,
        text,
        replyTo,
      });
      await Comment.findByIdAndUpdate(replyTo, {
        $push: { replies: newComment._id },
      });
    } else {
      await Comment.create({
        postId,
        userId,
        text,
      });
    }

    res.success("commnent was added successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

export async function likeComment(req, res) {
  const id = req.params.id;
  const { userId, commentId } = req.body;

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

    const comment = await Comment.findById(commentId).populate("userId");
    const findUser = comment.likes.find((user) => user._id == userId);
    if (findUser) {
      const likes = comment.likes.filter((user) => user._id != userId);
      await Comment.findByIdAndUpdate(commentId, { likes });
    } else {
      await Comment.findByIdAndUpdate(commentId, { $push: { likes: userId } });
    }

    res.success("likes was updated successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

export async function deleteComment(req, res) {
  const id = req.params.id;
  const { postId, replyTo } = req.body;

  try {
    const post = await Post.findById(postId);
    const findFriend = await Friend.findOne({ userId: post.userId.toString() });
    const isFriend = findFriend.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    const isOwner = post.userId.toString() == req.userId ? true : false;
    if (userId != req.userId) {
      res.fail("You are not authorized to delete comments!");
      return;
    }
    if (!isOwner) {
      if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
        res.fail("You are not authorized to delete comments!");
        return;
      }
    }
    //delete comment
    await Comment.findByIdAndDelete(id);
    if (replyTo) {
      const comment = await Comment.findById(replyTo);
      const replies = comment.replies.filter((c) => c._id != id);
      await Comment.findByIdAndUpdate(replyTo, replies);
    }

    res.success("likes was updated successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}
