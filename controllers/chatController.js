import mongoose from "mongoose";
import Chat from "../models/chatSchema.js";
import User from "../models/userSchema.js";

export async function getChats(req, res) {
  const chatId = req.params.id;

  const isAuthorized = chatId.includes(req.userId);
  if (!isAuthorized) {
    res.fail("You are not authorized!");
    return;
  }

  try {
    const chats = await Chat.find({ chatId });
    const userId = chatId.replace(req.userId, "");
    const findUser = await User.findById(userId);
    res.success("chats was found successfully", { chats, user: findUser });
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}
export async function getAllMsgOfUser(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(userId);
  if (!isValid) {
    res.fail("This id is not valid!");
    return;
  }

  try {
    const chats = await Chat.find({
      chatId: { $regex: userId.toString() },
    }).populate("userId");
    const mySet = new Set();

    const filterChats = chats.filter((chat) => {
      if (mySet.has(chat.chatId)) {
        return false;
      }
      mySet.add(chat.chatId);
      return true;
    });

    // make an array of objects of same chatId
    let ListGroup = [];
    let list = [];
    filterChats.forEach((c) => {
      for (let i = 0; i < chats.length; i++) {
        if (c.chatId == chats[i].chatId) {
          list.push(chats[i]);
        }
      }
      ListGroup.push(list);
      list = [];
    });
    // select the last item
    const ListChat = [];
    ListGroup.forEach((list) => {
      const listLength = list.length;
      let lastElement = list[listLength - 1];

      let item = {
        chatId: lastElement.chatId,
        updatedAt: lastElement.updatedAt,
        isRead: lastElement.isRead,
        msg: lastElement.msg,
        msgId: lastElement._id,
        userId: lastElement.userId._id,
        username: lastElement.userId.username,
        profileImg: lastElement.userId.profileImg,
      };

      ListChat.push(item);
    });

    const sortedListChat = ListChat.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.success("chats was found successfully", ListChat);
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}

export async function sendChats(req, res) {
  const chatId = req.params.id;

  const isAuthorized = chatId.includes(req.userId);
  if (!isAuthorized) {
    res.fail("You are not authorized!");
    return;
  }

  try {
    const { msg } = req.body;

    await Chat.create({ chatId, msg, userId: req.userId });
    res.success("chats was found successfully");
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}

export async function changeToRead(req, res) {
  const id = req.params.id;
  const { chatId } = req.body;
  const isAuthorized = chatId.includes(req.userId);
  if (!isAuthorized) {
    res.fail("You are not authorized!");
    return;
  }

  try {
    await Chat.findByIdAndUpdate(id, { isRead: true });
    res.success("chats was updated successfully");
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}
