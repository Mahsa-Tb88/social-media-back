import Comment from "../models/commentSchema.js";
import Friend from "../models/friendSchema.js";
import Notification from "../models/notificationSchema.js";
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
  const { postId, userId, text, replyTo, mentionUser } = req.body;

  try {
    const post = await Post.findById(id);
    const findFriend = await Friend.findOne({ userId: post.userId.toString() });
    const isFriend = findFriend.listFriend.find(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    const isFriendMentionUser = findFriend.listFriend.find(
      (f) => f.id == mentionUser && f.status == "accepted"
    );
    const isOwner = post.userId.toString() == req.userId ? true : false;
    if (userId != req.userId) {
      res.fail("You are not authorized to leave this comment!");
      return;
    }
    if (!isOwner) {
      if (
        (post.viewer == "friends" && !isFriend) ||
        (post.viewer == "friends" && !isFriendMentionUser) ||
        post.viewer == "private"
      ) {
        res.fail("You are not authorized to leave this comment!");
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

      // notification
      const comment = await Comment.findById(replyTo);

      if (
        comment.userId != post.userId.toString() &&
        userId != comment.userId
      ) {
        await Notification.create({
          text,
          postId,
          userId,
          userGetReply: comment.userId,
          type: "comment",
        });
      }
      if (userId != post.userId.toString()) {
        await Notification.create({
          text,
          postId,
          userId,
          userGetReply: post.userId.toString(),
          type: "comment",
        });
      }
    } else {
      await Comment.create({
        postId,
        userId,
        text,
      });

      // notification
      if (userId != post.userId.toString()) {
        await Notification.create({
          text,
          postId,
          userId,
          userGetReply: post.userId.toString(),
          type: "comment",
        });
      }
      if (mentionUser && userId != mentionUser) {
        await Notification.create({
          text,
          postId,
          userId,
          mentionUser,
          type: "comment",
        });
      }
    }

    res.success("commnent was added successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

// export async function leaveMentionComment(req, res) {
//   const id = req.params.id;
//   const { postId, userId, text, mentionUser } = req.body;

//   try {
//     const post = await Post.findById(id);
//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });
//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == req.userId && f.status == "accepted"
//     );
//     const isFriendMentionUser = findFriend.listFriend.find(
//       (f) => f.id == mentionUser && f.status == "accepted"
//     );
//     const isOwner = post.userId.toString() == req.userId ? true : false;
//     if (userId != req.userId) {
//       res.fail("You are not authorized to see comments!");
//       return;
//     }
//     if (!isOwner) {
//       if (
//         (post.viewer == "friends" && !isFriend) ||
//         (post.viewer == "friends" && !isFriendMentionUser) ||
//         post.viewer == "private"
//       ) {
//         res.fail("You are not authorized to leave a comments!");
//         return;
//       }
//     }

//     await Comment.create({
//       postId,
//       userId,
//       text,
//       mentionUser,
//     });

//     // notification
//     if (userId != post.userId.toString()) {
//       await Notification.create({
//         text,
//         postId,
//         userId,
//         userGetComment: post.userId.toString(),
//         type: "comment",
//       });
//     }

//     if (userId != mentionUser) {
//       await Notification.create({
//         text,
//         postId,
//         userId,
//         mentionUser,
//         type: "comment",
//       });
//     }

//     res.success("commnent was added successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);
//     res.fail(error.message);
//   }
// }

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
      if (req.userId !== comment.userId._id.toString()) {
        await Notification.create({
          postId: id,
          userId,
          userGetReply: comment.userId._id.toString(),
          type: "like",
          text: comment.text,
        });
      }

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
  const { postId, replyTo, userId } = req.body;

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
    if (replyTo) {
      // delete from database
      await Comment.findByIdAndDelete(id);
      // delete from replies in parent
      const comment = await Comment.findById(replyTo);
      const replies = comment.replies.filter((c) => c._id != id);
      await Comment.findByIdAndUpdate(replyTo, { replies });
    } else {
      //delete all replies of this parent
      const comment = await Comment.findById(id);
      if (comment.replies.length) {
        await Comment.deleteMany({ replyTo: id });
      }
      // delete from database
      await Comment.findByIdAndDelete(id);
    }

    res.success("likes was updated successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}

export async function seenNotification(req, res) {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    if (userId != req.userId) {
      res.fail("You are not authorized!");
      return;
    }
    await Notification.findByIdAndUpdate(id, { isSeen: true });

    res.success("Unseen Notification was updated successfully!", 200);
  } catch (error) {
    console.log("erorrr", error);
    res.fail(error.message);
  }
}
