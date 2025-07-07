import mongoose from "mongoose";
import PlaceLived from "../models/placeLived.js";
import User from "../models/userSchema.js";
import Friend from "../models/friendSchema.js";

export async function getPlaceLived(req, res) {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.fail("This user id is not valid!");
      return;
    }

    const findUserFriend = await Friend.findOne({ userId: id });
    let friend;
    if (findUserFriend) {
      friend = findUserFriend.listFriend.find(
        (f) => f.id == req.userId && f.status == "accepted"
      );
    }

    const isFriend = friend ? true : false;
    const isOwner = req.userId == id ? true : false;
    let usedToLiveCity = [];
    let hometown = {};
    let currentCity = {};

    const findPlaces = await PlaceLived.findOne({ userId: id });

    if (findPlaces) {
      findPlaces?.usedToLiveCity.forEach((w) => {
        if (w.viewer == "public" || (w.viewer == "friends" && isFriend)) {
          usedToLiveCity.push(w);
        }
      });

      if (
        findPlaces?.hometown.viewer == "public" ||
        (findPlaces?.hometown.viewer == "friends" && isFriend)
      ) {
        hometown = findPlaces.hometown;
      }

      if (
        findPlaces?.currentCity.viewer == "public" ||
        (findPlaces?.currentCity.viewer == "friends" && isFriend)
      ) {
        currentCity = findPlaces.currentCity;
      }

      if (isOwner) {
        usedToLiveCity = findPlaces?.usedToLiveCity;
        currentCity = findPlaces?.currentCity;
        hometown = findPlaces?.hometown;
      }
    }
    res.success("Place was found successfully!", {
      places: [usedToLiveCity, currentCity, hometown],
      isFriend,
      isOwner,
    });
  } catch (error) {
    res.fail(error.message);
  }
}

export async function addPlace(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { hometown, currentCity, usedToLiveCity } = req.body;
  try {
    const places = await PlaceLived.findOne({ userId });

    if (places) {
      if (hometown) {
        await PlaceLived.findOneAndUpdate({ userId }, { hometown });
      } else if (currentCity) {
        await PlaceLived.findOneAndUpdate({ userId }, { currentCity });
      } else {
        await PlaceLived.findOneAndUpdate(
          { userId },
          { usedToLiveCity: [...places.usedToLiveCity, usedToLiveCity] }
        );
      }
    } else {
      await PlaceLived.create({
        userId,
        hometown,
        currentCity,
        usedToLiveCity: usedToLiveCity ? [usedToLiveCity] : [],
      });
    }

    res.success("Place was added successfully!", places);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function editPlace(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  const { hometown, currentCity, usedToLiveCity } = req.body;
  try {
    const places = await PlaceLived.findOne({ userId });

    if (hometown) {
      await PlaceLived.findOneAndUpdate(
        { userId },
        { hometown: { ...places.hometown, value: hometown.value } }
      );
    }
    if (currentCity) {
      await PlaceLived.findOneAndUpdate(
        { userId },
        { hometown: { ...places.currentCity, value: currentCity.value } }
      );
    }
    if (usedToLiveCity) {
      const updatedUsedToLiveCity = places.usedToLiveCity.map((c) => {
        if (c.id == usedToLiveCity.id) {
          return { ...c, value: usedToLiveCity.value };
        } else {
          return c;
        }
      });

      await PlaceLived.findOneAndUpdate(
        { userId },
        { usedToLiveCity: updatedUsedToLiveCity }
      );
    }
    res.success("Place was updated successfully!");
  } catch (error) {
    res.fail(error.message);
  }
}

export async function deletePlace(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }

  try {
    const places = await PlaceLived.findOne({ userId });
    if (req.body.title == "hometown") {
      await PlaceLived.findOneAndUpdate({ userId }, { hometown: {} });
    } else if (req.body.title == "currentCity") {
      await PlaceLived.findOneAndUpdate({ userId }, { currentCity: {} });
    } else {
      const updatedPlace = places.usedToLiveCity.filter(
        (item) => req.body.titleId != item.id
      );
      await PlaceLived.findOneAndUpdate(
        { userId },
        { usedToLiveCity: updatedPlace }
      );
    }
    res.success("Place was deleted successfully!", places);
  } catch (error) {
    res.fail(error.message);
  }
}

export async function filterViewer(req, res) {
  const id = req.params.id;
  const isValid = mongoose.isValidObjectId(id);
  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  if (id != req.userId) {
    res.fail("You are not authorized");
    return;
  }
  const { viewer, itemId, title } = req.body;
  try {
    const user = await PlaceLived.findOne({ userId: id });
    if (title == "hometown") {
      await PlaceLived.findOneAndUpdate(
        { userId: id },
        { hometown: { ...user.hometown, viewer } }
      );
    } else if (title == "currentCity") {
      await PlaceLived.findOneAndUpdate(
        { userId: id },
        { currentCity: { ...user.currentCity, viewer } }
      );
    } else {
      const updated = user.usedToLiveCity.map((u) => {
        if (u.id == itemId) {
          return { ...u, viewer };
        } else {
          return u;
        }
      });
      await PlaceLived.findOneAndUpdate(
        { userId: id },
        { usedToLiveCity: updated }
      );
    }

    res.success("Filter viewer was changed successfully!");
  } catch (error) {
    console.log(error.message);
    res.fail(error.message);
  }
}
