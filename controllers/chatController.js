import Chat from "../models/chatSchema.js";

export async function getChats(req, res) {
  const chatId = req.params.id;

  const isValid = mongoose.isValidObjectId(chatId);
  if (!isValid) {
    res.fail("This Id is not valid!");
    return;
  }
  const isAuthorized = chatId.includes(req.userId);
  if (!isAuthorized) {
    res.fail("You are not authorized!");
    return;
  }

  try {
    const chats = await Chat.findById(chatId);
    res.success("chats was found successfully", chats);
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}
