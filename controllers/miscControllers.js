import Category from "../models/categoryScheme.js";
import Chat from "../models/chatSchema.js";
import Friend from "../models/friendSchema.js";
import Notification from "../models/notificationSchema.js";
import User from "../models/userSchema.js";

export async function initialize(req, res) {
  let user, categories;

  try {
    categories = await Category.find();

    if (req.username) {
      user = await User.findOne({ username: req.username });
      user.password = undefined;
      //find user's friends
      let friends;
      friends = await Friend.findOne({ userId: user._id.toString() });
      if (!friends) {
        friends = { listFriend: [], viewer: "friends" };
      }

      //find unread msgs

      //find all message with user
      const findMsgs = await Chat.find({
        chatId: { $regex: user._id.toString() },
      }).populate("userId");

      //filter msg unread for user
      const filterMsgs = findMsgs.filter(
        (msg) =>
          msg.isRead == false &&
          msg.userId._id.toString() != user._id.toString()
      );

      let findAllMessages = [];
      filterMsgs.forEach((msg) => {
        let myMsg = {
          chatId: msg.chatId,
          username: msg.userId.username,
          profileImg: msg.userId.profileImg,
          id: msg._id,
          msg: msg.msg,
        };
        findAllMessages.push(myMsg);
      });

      //uniq unread msg for user
      const seenUsernames = new Set();
      const messages = findAllMessages.filter((user) => {
        if (seenUsernames.has(user.username)) {
          return false;
        }
        seenUsernames.add(user.username);
        return true;
      });

      // find Notofication

      const findNotification = await Notification.findOne({
        userId: req.userId,
      });
      let notificationList = [];
      if (findNotification) {
        notificationList = findNotification.notificationList;
      }
      res.success("Initialized successfully!", {
        categories,
        user,
        friends,
        messages,
        notificationList,
      });
    } else {
      res.success("Initialized successfully!", { categories });
    }
  } catch (error) {
    console.log("error is", error);
    res.fail(error.message, 500);
  }
}
export async function uploadFile(req, res) {
  const filename = req.file.filename;

  const body = {
    filename: filename,
    url: "/uploads" + "/" + filename,
  };
  res.success("The file was uploaded successfully!", body);
}
