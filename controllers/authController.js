import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import Friend from "../models/friendSchema.js";
import Chat from "../models/chatSchema.js";

export async function loginUser(req, res) {
  const { username, password, remember } = req.body;
  if (!username && !password) {
    return res.fail("Please enter username and password!", 400);
  }
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      res.fail("This username is not registerd!", 402);
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.fail("This Password is not valid!", 402);
    }
    const token = jwt.sign(
      { username: username.toLowerCase() },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    const settings = { httpOnly: true, secure: true, sameSite: "Lax" };
    if (remember) {
      settings.maxAge = 7 * 86400 * 1000;
    }
    res.cookie("token", token, settings);
    user.password = undefined;

    //find user's friends
    let friends;
    const findFriends = await Friend.findOne({ userId: user._id.toString() });
    friends = {
      listFriend: findFriends?.listFriend || [],
      friendRequestList: findFriends?.friendRequestList || [],
      viewer: findFriends?.viewer,
      userId: findFriends?.userId,
    };

    //find unread msgs
    const findMsgs = await Chat.find({
      chatId: { $regex: user._id.toString() },
    }).populate("userId");
    // console.log("findMsgs//", findMsgs);

    const filterMsgs = findMsgs.filter(
      (msg) =>
        msg.isRead == false && msg.userId._id.toString() != user._id.toString()
    );
    console.log("filterMsgs", filterMsgs);
    let findAllMessages = [];
    filterMsgs.forEach((msg) => {
      let myMsg = {
        chatId: msg.chatId,
        username: msg.userId.username,
        profileImg: msg.userId.profileImg,
        id: msg._id,
      };
      findAllMessages.push(myMsg);
    });

    const seenUsernames = new Set();
    console.log("msgsss", findAllMessages);
    const messages = findAllMessages.filter((user) => {
      if (seenUsernames.has(user.username)) {
        return false;
      }
      seenUsernames.add(user.username);
      return true;
    });

    console.log("messages//", messages);

    res.success("Login Successfully", { user, friends, messages });
  } catch (error) {
    res.fail(error.message);
  }
}

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.fail("Please Enter a value for all field!");
  }

  try {
    const findUsername = await User.findOne({
      username: username.toLowerCase(),
    });
    const findEmail = await User.findOne({ username: username.toLowerCase() });

    if (findUsername || findEmail) {
      return res.fail("Username or Email is already exist!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username.toLowerCase(),
      emailRegister: email.toLowerCase(),
      password: hashPassword,
    });

    newUser.password = undefined;
    res.success("New User created successfully!", newUser);
  } catch (error) {
    res.fail(error.message, 500);
  }
}

export function logoutUser(req, res) {
  res.clearCookie("token");
  res.success("logout was done Successully!");
}
