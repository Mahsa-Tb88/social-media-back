import mongoose from "mongoose";
import Friend from "../models/friendSchema.js";

export async function makeFriend(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { userId, userProfileImg, userUsername, id, username, profileImg } =
    req.body;
  try {
    // add user who sent request to FriendRequestList of user got request
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
    // add user who got request to listfriend of user sent request
    const findUser = await Friend.findOne({ userId });
    if (findUser) {
      const updatedListFriend = [
        ...findUser.listFriend,
        { id, username, profileImg, status: "pending" },
      ];

      await Friend.findOneAndUpdate(
        { userId },
        { listFriend: updatedListFriend }
      );
    } else {
      await Friend.create({
        userId,
        listFriend: [{ id, username, profileImg, status: "pending" }],
        viewer: "friends",
      });
    }

    res.success("user was added to list of friends successfully!");
  } catch (error) {
    console.log("errorrrr", error.message);
    res.fail(error.message);
  }
}

export async function confirmFriend(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  const { id, username, profileImg, userId } = req.body;

  try {
    //add user who sent request to listfriend of user who accept request
    const findUser1 = await Friend.findOne({ userId });
    const updatedRequestList = findUser1.friendRequestList.filter(
      (f) => f.id != id
    );
    await Friend.findOneAndUpdate(
      { userId },
      {
        listFriend: [
          ...findUser1.listFriend,
          { id, username, profileImg, status: "accepted" },
        ],
        friendRequestList: updatedRequestList,
      }
    );

    //add the user who accept request to listFriend of user who sent request
    const findUser2 = await Friend.findOne({ userId: id });
    const updatedListFriend = findUser2.listFriend.map((f) => {
      if (f.id == userId) {
        return { ...f, status: "accepted" };
      } else {
        f;
      }
    });
    await Friend.findOneAndUpdate(
      { userId: id },
      { listFriend: updatedListFriend }
    );

    res.success("New friend was made successfully!");
  } catch (error) {
    console.log("errorrrr", error.message);
    res.fail(error.message);
  }
}

export async function removeRequestFriend(req, res) {
  //cancel request or delete request friend
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { id, userId } = req.body;
  try {
    //delete request
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

export async function removeFriend(req, res) {
  //cancel request or delete request friend
  const isValid = mongoose.isValidObjectId(req.params.userId);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { id, userId } = req.body;
  try {
    const findUser1 = await Friend.findOne({ userId: id });
    const updatedListFriend1 = findUser1.listFriend.filter(
      (f) => f.id != userId
    );
    await Friend.findOneAndUpdate(
      { userId:id },
      { listFriend: updatedListFriend1 }
    );


    const findUser2 = await Friend.findOne({ userId });
    const updatedListFriend2 = findUser2.listFriend.filter((f) => f.id != id);
    await Friend.findOneAndUpdate(
      { userId },
      { listFriend: updatedListFriend2 }
    );
    res.success("friend was removed successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}
