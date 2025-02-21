import mongoose from "mongoose";
import Friend from "../models/friendSchema.js";

export async function makeFriend(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const {
    userId,
    userProfileImg,
    userUsername,
    id,
    username,
    profileImg,
    status,
  } = req.body;
  try {
    const findUserGetRequest = await Friend.findOne({ userId: id });
    if (findUserGetRequest) {
      const updatedFriendRequestList = [
        ...findUserGetRequest.friendRequestList,
        { id: userId, profileImg: userProfileImg, username: userUsername },
      ];

      await Friend.findOneAndUpdate(
        { userId: id },
        { friendRequestList: updatedFriendRequestList }
      );
    } else {
      await Friend.create({
        userId: id,
        friendRequestList: [
          { id: userId, profileImg: userProfileImg, username: userUsername },
        ],
      });
    }

    const findUser = await Friend.findOne({ userId });
    if (findUser) {
      const findFriend = findUser.listFriend.find((f) => f.id == id);
      let updatedListFriend;
      if (findFriend) {
        updatedListFriend = Friend.listFriend.map((f) => {
          if (f.id == id) {
            return { ...f, status };
          } else {
            f;
          }
        });
      } else {
        updatedListFriend = [
          ...findUser.listFriend,
          { id, username, profileImg, status },
        ];
      }

      await Friend.findOneAndUpdate(
        { userId },
        { listFriend: updatedListFriend }
      );
    } else {
      await Friend.create({
        userId,
        listFriend: [{ id, username, profileImg, status }],
        viewer: "friends",
      });
    }

    res.success("user was added to list of friends successfully!");
  } catch (error) {
    console.log("errorrrr", error.message);
    res.fail(error.message);
  }
}

export async function removeFriend(req, res) {
  //cancel request or delete friend
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { id, userId } = req.body;
  try {
    //delete request friend if there is
    const findUserGotRequest = await Friend.findOne({ userId: id });
    const findUsersentRequest = findUserGotRequest?.friendRequestList.find(
      (f) => f.id == userId
    );
    if (findUsersentRequest) {
      const updatedList = findUserGotRequest.friendRequestList.filter(
        (f) => f.id != userId
      );
      await Friend.findOneAndUpdate(
        { userId: id },
        { friendRequestList: updatedList }
      );
    }
    const findUser = await Friend.findOne({ userId });
    const updatedListFriend = findUser.listFriend.filter((f) => f.id != id);

    await Friend.findOneAndUpdate(
      { userId },
      { listFriend: updatedListFriend }
    );
    res.success("friend was removed successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}


