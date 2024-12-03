import User from "../models/userSchema.js";
import bcrypt from "bcrypt";

export async function loginUser(req, res) {}

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.fail("Please Enter a value for all field!");
  }

  try {
    const findUsername = await User.findOne({ username });
    const findEmail = await User.findOne({ email });

    if (findUsername || findEmail) {
      return res.fail("Username or Email is already exist!");
    }
    const hashPassword = bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password,
    });
    newUser.password = undefined;
    res.success("New User created successfully!", newUser);
  } catch (error) {
    res.fail(e.message, 500);
  }
}
