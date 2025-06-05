import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import Post from "../models/postSchema.js";
import Friend from "../models/friendSchema.js";
import FamilyRel from "../models/familyRelationship.js";
import Notification from "../models/notificationSchema.js";
import Overview from "../models/overviewSchema.js";
import PlaceLived from "../models/placeLived.js";
import Work from "../models/workSchema.js";
import Education from "../models/educationSchema.js";

export async function updateBackground(req, res) {
  const { image, id } = req.body;
  if (req.userId !== id) {
    res.fail("You are not authorized to change picture", 400);
  }
  try {
    const user = await User.findByIdAndUpdate(id, { backgroundImg: image });
    res.success("updated Image Successfully!", 200);
  } catch (error) {
    console.log("error", error);
    res.fail(error, 500);
  }
}

export async function updateProfileImg(req, res) {
  const { image, id } = req.body;
  if (req.userId !== id) {
    res.fail("You are not authorized to change image", 400);
  }
  try {
    const user = await User.findByIdAndUpdate(id, { profileImg: image });
    res.success("updated Image Successfully!", 200);
  } catch (error) {
    res.fail(error.message, 500);
  }
}

export async function editUserById(req, res, next) {
  const { username, password, viewerProfile, deleteAccount } = req.body;
  const id = req.params.id;

  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (id != req.userId) {
    res.fail("You are not athorize to edit");
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);
  try {
    if (deleteAccount) {
      await User.findByIdAndUpdate(id, { deleted: true });
      await Post.deleteMany({ userId: id });
      await Education.deleteMany({ userId: id });
      await FamilyRel.deleteMany({ userId: id });
      await Friend.deleteMany({ userId: id });
      await Notification.deleteMany({ userId: id });
      await Overview.deleteMany({ userId: id });
      await PlaceLived.deleteMany({ userId: id });
      await Work.deleteMany({ userId: id });
      await Friend.updateMany({}, { $pull: { friendRequestList: { id } } });
    } else {
      const user = await User.findById(id);
      await User.findByIdAndUpdate(id, {
        username: username ? username.toLowerCase() : user.username,
        viewerProfile: viewerProfile ? viewerProfile : user.viewerProfile,
        password: password ? hashPassword : user.password,
      });
      await Friend.findOneAndUpdate(
        { userId: id },
        {
          viewer: viewerProfile ? viewerProfile : user.viewerProfile,
        }
      );
    }
    res.success(
      "Updated successfully! You will be redirected to the login page in 5 seconds!"
    );
  } catch (error) {
    console.log("error is ", error);
    res.fail(error.message);
  }
}

export async function getGalleryByUserId(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.fail("This id is not valid!", 400);
      return;
    }
    const friendsUser = await Friend.findOne({ userId: id });
    let findFriend;
    if (friendsUser) {
      findFriend = friendsUser.listFriend.filter(
        (f) => f.id == req.userId && f.status == "accepted"
      );
    }

    const posts = await Post.find({ userId: id });
    if (!posts) {
      res.success("No photos or videos yet!", { photos: [], videos: [] });
    }

    let photos = [];
    let videos = [];

    posts.forEach((post) => {
      if (post.viewer == "public") {
        if (post.image) {
          photos.push({ image: post.image, id: post._id.toString() });
        }
        if (post.video) {
          videos.push({ video: post.video, id: post._id.toString() });
        }
      } else if (post.viewer == "private" && req.userId == id) {
        if (post.image) {
          photos.push({ image: post.image, id: post._id.toString() });
        }
        if (post.video) {
          videos.push({ video: post.video, id: post._id.toString() });
        }
      } else if (post.viewer == "friends" && findFriend.length) {
        if (post.image) {
          photos.push({ image: post.image, id: post._id.toString() });
        }
        if (post.video) {
          videos.push({ video: post.video, id: post._id.toString() });
        }
      }
    });
    res.success("gallery was found successfully!", { photos, videos });
  } catch (error) {
    console.log("error is", error);
    res.fail(error.message);
  }
}
