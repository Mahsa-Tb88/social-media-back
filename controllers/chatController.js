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

export async function sendChats(req, res) {
  const chatId = req.params.id;
  //   const isValid = mongoose.isValidObjectId(chatId);

  //   if (!isValid) {
  //     res.fail("This Id is not valid!");
  //     return;
  //   }
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
