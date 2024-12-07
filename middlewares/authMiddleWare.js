import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export async function checkToken(req, res, next) {
  console.log("req.cooke....", req.cookie);
  if (req.cookies?.token) {
    const token = req.cookie.token;
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
