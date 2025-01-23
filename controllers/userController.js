import Overview from "../models/overViewSchema.js";
import User from "../models/userSchema.js";

export async function getUserById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const user = await User.findById(req.params.id);
    res.success(" User was found successfully!", user);
  } catch (error) {
    res.fail(error.message);
  }
}
export async function getOverview(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  // check user is userLogin
  if (req.userId != req.params.id) {
    res.fail("You are not authorized!");
    return;
  }

  try {
    const findOverview = await Overview.findById(req.params.id);
    res.success("overview was found successfully!", findOverview);
  } catch (error) {
    res.fail(error.message);
  }
}
