import mongoose from "mongoose";
import PlaceLived from "../models/placeLived.js";

export async function getPlaceLived(req, res) {
  const userId = req.params.id;
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    res.fail("This User Id is not valid!");
    return;
  }
  try {
    const places = await PlaceLived.findOne({ userId });
    res.success("Place was found successfully!", places);
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

    res.success("Place was found successfully!", places);
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
    res.success("Place was found successfully!");
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
    res.success("Place was found successfully!", places);
  } catch (error) {
    res.fail(error.message);
  }
}
