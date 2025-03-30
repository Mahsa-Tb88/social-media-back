import jwt from "jsonwebtoken";
import Friend from "../models/friendSchema.js";
import User from "../models/userSchema.js";

export async function checkToken(req, res, next) {
  if (req.cookies?.token) {
    const token = req.cookies.token;
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ username: decode.username });
      if (user) {
        req.username = user.username;
        req.role = user.isAdmin == "user" ? "user" : "admin";
        req.userId = user._id.toString();
      }
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
}

export async function isAuthorized(req, res, next) {
  const userId = req.params.id;
  if (req.userId == userId) {
    return next();
  }
  try {
    const user = await Friend.findOne({ userId });
    if (!user) {
      res.fail("User not found!");
      return;
    }
    const isFriend = user.listFriend.filter(
      (f) => f.id == req.userId && f.status == "accepted"
    );
    if (!isFriend.length) {
      res.fail("Access denied: Not a friend");
      return;
    }

    next();
  } catch (error) {
    res.fail(error.message);
  }
}
