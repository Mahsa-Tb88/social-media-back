import mongoose from "mongoose";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";
import Overview from "../models/overviewSchema.js";
import Post from "../models/postSchema.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    let selectedUsers = users.filter(
      (user) => user._id != req.userId && !user.deleted
    );

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
  console.log("yeees");
  try {
    let friends;
    const findUser = await User.findById(req.params.id);
    if (!findUser) {
      res.fail("This user Id is not valis!", 400);
      return;
    }

    friends = await Friend.findOne({ userId: req.params.id });
    if (friends) {
      if (req.params.id == req.userId) {
        friends = {
          message: "list friends",
          listFriend: friends.listFriend,
        };
      } else {
        // check is friend
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
      }

      //to get updated profileimg of users
      let ids = [];
      friends.listFriend = friends.listFriend.filter(
        (f) => f.status == "accepted"
      );
      friends.listFriend.forEach((element) => {
        ids.push(element.id);
      });
      friends.listFriend = await User.find(
        { _id: { $in: ids } },
        "_id profileImg username"
      );
    } else {
      friends = { listFriend: [], message: "There is no friends yet!" };
    }
    friends.listFriend = friends.listFriend.filter(
      (f) => !f.username.includes("*")
    );

    res.success("Friends were found successfully!", friends);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function findMutualUserFriedns(req, res) {
  try {
    // id is userId not userLoginId
    const id = req.params.id;
    console.log("id is", id);

    const findUser = await User.findById(id);
    if (!findUser) {
      res.fail("This user Id is not valis!", 400);
      return;
    }

    let findUserFriend = await Friend.findOne({ userId: id });
    if (findUserFriend) {
      findUserFriend = findUserFriend.listFriend.filter(
        (f) => f.status == "accepted"
      );
    }

    let findUserLoginFriend = await Friend.findOne({ userId: req.userId });
    if (findUserLoginFriend) {
      findUserLoginFriend = findUserLoginFriend.listFriend.filter(
        (f) => f.status == "accepted"
      );
    }

    //find mutual friend:
    let mutualFriends = [];

    if (findUserFriend && findUserLoginFriend) {
      mutualFriends = findUserFriend.filter((item1) =>
        findUserLoginFriend.some((item2) => item1.id === item2.id)
      );
    }

    //update profileImg
    let ids = [];
    mutualFriends = mutualFriends.filter((f) => f.status == "accepted");
    mutualFriends.slice(0, 3).forEach((element) => {
      ids.push(element.id);
    });
    mutualFriends = await User.find(
      { _id: { $in: ids } },
      "_id profileImg username"
    );

    res.success(
      "Mutual friends and number of friends were found successfully!",
      {
        mutualFriends,
        numOfFriends: findUserFriend || [],
      }
    );
  } catch (error) {
    console.log("error is ", error);
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
      let findUser;
      if (findFriend) {
        findUser = findFriend.listFriend.find(
          (f) => f.id == userId && f.status == "accepted"
        );
      }
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
    console.log("finduser", findUser);
    const findFriend = await Friend.findOne({ userId: req.userId });
    let userList = [];
    if (findFriend && findUser) {
      findFriend.listFriend.forEach((u) => {
        //check listFriend
        const user1 = findUser.find((f) => f._id.toString() == u.id);
        if (user1) {
          userList.push({
            profileImg: user1.profileImg,
            id: user1._id.toString(),
            username: user1.username,
            status: u.status,
          });
        }
      });

      findFriend.friendRequestList.forEach((u) => {
        //check friendRequestList
        const user2 = findUser.find((f) => f._id.toString() == u.id);
        if (user2) {
          userList.push({
            profileImg: user2.profileImg,
            id: user2._id.toString(),
            username: user2.username,
            status: "requested",
          });
        }
      });
    }

    if (userList.length != findUser.length) {
      // check an elememt of array A is in array B
      findUser.forEach((f) => {
        const user = userList.find((u) => u.id == f._id.toString());
        if (!user) {
          userList.push({
            profileImg: f.profileImg,
            id: f._id.toString(),
            username: f.username,
            status: "",
          });
        }
      });
    }
    res.success("was found successfully!", userList);
  } catch (error) {
    console.log("eror", error);
    res.fail(error.message);
  }
}
