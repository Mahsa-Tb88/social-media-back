import Friend from "../models/friendSchema.js";
// import Notification from "../models/notificationSchema.js";
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

// export async function getAllCommentsOfPost(req, res) {
//   const id = req.params.id;

//   try {
//     const post = await Post.findById(id);
//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });
//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == req.userId && f.status == "accepted"
//     );
//     const isOwner = post.userId.toString() == req.userId ? true : false;
//     if (!isOwner) {
//       if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
//         res.fail("You are not authorized to see comments!");
//         return;
//       }
//     }

//     const comments = await Comment.find({ postId: id });

//     res.success("commnets was found successfully!", comments);
//   } catch (error) {
//     console.log("erorrr", error);
//     res.fail(error.message);
//   }
// }

// export async function commentOnPost(req, res) {
//   const postId = req.params.id;
//   const { userId, username, profileImg, comment, type, replyId } = req.body;
//   console.log("...", req.body);
//   try {
//     const post = await Post.findById(postId);
//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });

//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == userId && f.status == "accepted"
//     );
//     const isOwner = post.userId.toString() == userId ? true : false;
//     if (!isOwner) {
//       if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
//         res.fail("You are not authorized to leave a comment!");
//         return;
//       }
//     }

//     // create notification
//     const newNotifi = await Notification.create({
//       postId,
//       userId: post.userId.toString(),
//       profileImg,
//       username,
//       comment,
//       type,
//     });

//     //create comment
//     //we have 2 types of comment, comment in first layer
//     //  and second comment as reply to first layer comment, for first comment using id they identify
//     // so we need notifiId to identify spesific reply comment
//     if (type == "comment") {
//       await Comment.create({
//         postId,
//         userId,
//         notifiId: newNotifi._id.toString(),
//         username,
//         profileImg,
//         text: comment,
//       });
//     } else {
//       const findComment = await Comment.findById(replyId);
//       const replyComment = {
//         replyId,
//         postId,
//         userId,
//         notifiId: newNotifi._id.toString(),
//         username,
//         profileImg,
//         text: comment,
//         createdAt: new Date(),
//       };

//       const updatedReply = [...findComment.reply, replyComment];
//       await Comment.findByIdAndUpdate(replyId, { reply: updatedReply });
//     }

//     res.success("Changes was updated successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);
//     res.fail(error.message);
//   }
// }

// export async function likeOnPost(req, res) {
//   const id = req.params.id;
//   const { userId, username, profileImg, isLike } = req.body;

//   try {
//     const post = await Post.findById(id);
//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });
//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == userId && f.status == "accepted"
//     );

//     const isOwner = post.userId.toString() == userId ? true : false;
//     if (!isOwner) {
//       if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
//         res.fail("You are not authorized to like!");
//         return;
//       }
//     }
//     let updatedLike = [];
//     if (isLike) {
//       let newLike = {
//         username,
//         userId,
//         profileImg,
//       };

//       updatedLike = [...post.like, newLike];
//     } else {
//       updatedLike = post.like.filter((l) => l.userId != userId);
//     }
//     await Post.findByIdAndUpdate(id, {
//       like: updatedLike,
//     });

//     if (isLike) {
//       // create notification
//       await Notification.create({
//         postId: id,
//         userId: post.userId.toString(),
//         profileImg,
//         username,
//         type: "like",
//       });
//     }

//     res.success("like was updated successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);

//     res.fail(error.message);
//   }
// }

// export async function deleteComment(req, res) {
//   const id = req.params.id;
//   const { notifiId, postId } = req.body;

//   try {
//     const post = await Post.findById(postId);

//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });
//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == req.userId && f.status == "accepted"
//     );

//     const isOwner = post.userId.toString() == req.userId ? true : false;
//     if (!isOwner) {
//       if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
//         res.fail("You are not authorized to delete the comment!");
//         return;
//       }
//     }

//     //remove comment
//     await Comment.findByIdAndDelete(id);

//     //remove notification
//     await Notification.findByIdAndDelete(notifiId);

//     res.success("commnet was delete successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);
//     res.fail(error.message);
//   }
// }
// export async function updateIsSeenNotifi(req, res) {
//   const id = req.params.id;
//   const { userId } = req.body;
//   try {
//     if (req.userId != userId) {
//       res.fail("you are not authorized!");
//       return;
//     }
//     await Notification.findByIdAndUpdate(id, { isSeen: true });

//     res.success("notofication was updated successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);
//     res.fail(error.message);
//   }
// }
// export async function likeOnComment(req, res) {
//   const id = req.params.id;
//   const { userId, username, profileImg, isLike, postId } = req.body;
//   console.log("req", req.body);

//   try {
//     const post = await Post.findById(postId);
//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });
//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == userId && f.status == "accepted"
//     );

//     const isOwner = post.userId.toString() == userId ? true : false;
//     if (!isOwner) {
//       if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
//         res.fail("You are not authorized to like!");
//         return;
//       }
//     }

//     const comment = await Comment.findById(id);
//     console.log("comment", comment);
//     let updatedLike = [];
//     if (isLike) {
//       let newLike = {
//         username,
//         userId,
//         profileImg,
//       };

//       updatedLike = [...comment.like, newLike];
//     } else {
//       updatedLike = post.like.filter((l) => l.userId != userId);
//     }
//     await Comment.findByIdAndUpdate(id, {
//       like: updatedLike,
//     });

//     if (isLike) {
//       // create notification
//       await Notification.create({
//         postId: id,
//         userId: post.userId.toString(),
//         profileImg,
//         username,
//         type: "like",
//       });
//     }

//     res.success("like was updated successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);

//     res.fail(error.message);
//   }
// }

// export async function likeOnReplyComment(req, res) {
//   // id is for comment modal
//   const id = req.params.id;
//   const { userId, username, profileImg, postId, notifiId } = req.body;
//   console.log("req", req.body);

//   try {
//     const post = await Post.findById(postId);
//     const findFriend = await Friend.findOne({ userId: post.userId.toString() });
//     const isFriend = findFriend.listFriend.find(
//       (f) => f.id == userId && f.status == "accepted"
//     );

//     const isOwner = post.userId.toString() == userId ? true : false;
//     if (!isOwner) {
//       if ((post.viewer == "friends" && !isFriend) || post.viewer == "private") {
//         res.fail("You are not authorized to like!");
//         return;
//       }
//     }
//     //first find comment
//     const comment = await Comment.findById(id);
//     console.log("comment", comment);
//     let updatedReply = [];
//     let updatedLike;
//     // second find reply
//     const findReply = comment.reply.find((r) => r.notifiId == notifiId);
//     //third find like
//     const findLike = findReply.like.find((r) => r.userId == req.userId);

//     if (!findLike) {
//       const newLike = {
//         userId,
//         username,
//         profileImg,
//         postId,
//         // notifiId:create notifiid for shwing notification
//       };

//       updatedReply = comment.reply.map((r) => {
//         if (r.notifiId == notifiId) {
//           const updatedLike = [...r.like, newLike];
//           return { ...r, like: updatedLike };
//         } else {
//           return r;
//         }
//       });
//     } else {
//       const updatedLike = findReply.like.filter((l) => l.userId != req.userId);
//       updatedReply = comment.reply.map((r) => {
//         if (r.notifiId == notifiId) {
//           return { ...r, like: updatedLike };
//         } else {
//           return r;
//         }
//       });
//     }

//     await Comment.findByIdAndUpdate(id, {
//       reply: updatedReply,
//     });

//     if (!findLike) {
//       // create notification
//       await Notification.create({
//         postId: id,
//         userId: post.userId.toString(),
//         profileImg,
//         username,
//         type: "like",
//       });
//     }

//     res.success("like was updated successfully!", 200);
//   } catch (error) {
//     console.log("erorrr", error);

//     res.fail(error.message);
//   }
// }
