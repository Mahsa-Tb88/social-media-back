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

    const comments = await Comment.find({ postId: id, replyTo: null }).populate(
      "replies"
    );

    res.success("commnets was found successfully!", comments);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

export async function leaveComment(req, res) {
  const id = req.params.id;
  const { postId, userId, text } = req.body;

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

    await Comment.create({
      postId,
      userId,
      text,
    });

    res.success("commnent was added successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}
