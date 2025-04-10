import Category from "../models/categoryScheme.js";
import Chat from "../models/chatSchema.js";
import Friend from "../models/friendSchema.js";
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
      const findMsgs = await Chat.find({
        chatId: { $regex: user._id.toString() },
      }).populate("userId");
      console.log("findMsgs//", findMsgs);

      const filterMsgs = findMsgs.filter(
        (msg) => msg.isRead == false && msg.userId != user._id.toString()
      );

      let messages = [];
      filterMsgs.forEach((msg) => {
        let myMsg = {
          chatId: msg.chatId,
          username: msg.userId.username,
          profileImg: msg.userId.profileImg,
          id: msg._id,
        };
        messages.push(myMsg);
      });

      console.log("messages//", messages);
      res.success("Initialized successfully!", {
        categories,
        user,
        friends,
        messages,
      });
    } else {
      res.success("Initialized successfully!", { categories });
    }
  } catch (error) {
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
