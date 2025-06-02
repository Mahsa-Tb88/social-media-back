import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";
import Overview from "../models/overviewSchema.js";
import Post from "../models/postSchema.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    let selectedUsers = users.filter((user) => user._id != req.userId);
    selectedUsers = selectedUsers.map((user) => {
      user.password = undefined;
      user.emailRegister = undefined;
      user.bio = undefined;
      return user;
    });
    res.success("get all users successfully", selectedUsers);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function getUserById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This user Id is not valid!");
    return;
  }
  try {
    const user = await User.findById(req.params.id);
    user.password = undefined;
    res.success(" User was found successfully!", user);
  } catch (error) {
    console.log("error", error);
    res.fail(error.message);
  }
}

export async function findUserFriedns(req, res) {
  try {
    let friends;
    const findUser = await User.findById(req.params.id);
    if (!findUser) {
      res.fail("This user Id is not valis!", 400);
      return;
    }
    // check is friend
    friends = await Friend.findOne({ userId: req.params.id });

    const findFriend = friends.listFriend.filter(
      (f) => f.id == req.userId && f.status == "accepted"
    );

    if (friends.viewer == "private") {
      friends = { message: "This Section is private", listFriend: [] };
    } else if (friends.viewer == "friends" && !findFriend.length) {
      friends = {
        message: "You don’t have permission to view this section!",
        listFriend: [],
      };
    } else if (!friends) {
      friends = { message: "There is no friend yet!", listFriend: [] };
    } else {
      friends = {
        message: "list friends",
        listFriend: friends.listFriend,
      };
    }

    res.success("Friends were found successfully!", friends);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function getUserIntro(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.fail("This userId is not valid!");
      return;
    }
    const userFriend = await Friend.findOne({ userId: req.params.id });
    let isFriend;
    if (userFriend) {
      isFriend = userFriend.listFriend.find(
        (friend) => friend.id == req.userId && friend.status == "accepted"
      );
    }

    isFriend = isFriend ? true : false;
    const isOwner = req.userId == req.params.id ? true : false;

    const findOverview = await Overview.findOne({
      userId: req.params.id,
    });
    let overview = {};
    if (findOverview) {
      if (user.viewerProfile == "friends" && isFriend) {
        overview = findOverview;
      }
      if (isOwner || user.viewerProfile == "public") {
        overview = findOverview;
      }
    }
    res.success("UserInfo was found successfully", {
      overview,
      isFriend,
      isOwner,
    });
  } catch (error) {
    res.fail(error.message);
  }
}

export async function getSearchUser(req, res) {
  const { search, postId } = req.query;

  try {
    const users = await User.find({
      username: { $regex: "^" + search, $options: "i" }, // case-insensitive match
    }).select("username profileImg _id");
    //filter userLogin can not mention yourself
    let filterUsers = users.filter((user) => user._id != req.userId);

    //find userSearch that has a permisson to see the post and check if it is a friend to see the post if the post is for friends
    const post = await Post.findById(postId);
    const findFriend = await Friend.findOne({ userId: post.userId.toString() });
    function isFriend(userId) {
      const findUser = findFriend.listFriend.find(
        (f) => f.id == userId && f.status == "accepted"
      );
      if (findUser) {
        return true;
      } else {
        return false;
      }
    }

    if (post.viewer == "friends") {
      filterUsers = filterUsers.filter((user) => isFriend(user._id));
    }
    if (post.viewer == "private") {
      filterUsers = [];
    }

    res.success("get all users successfully", filterUsers);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function findUser(req, res) {
  const username = req.query.q;
  const query = {
    $or: [{ username: RegExp("^" + username, "i") }],
  };
  try {
    const findUser = await User.find(query);
    res.success("was found successfully!", findUser);
  } catch (error) {
    res.fail(error.message);
  }
}
