import { UniqueNumber } from "../models/unique-number-model.js";
import { errorHandler } from "../utils/error.js";

export const GenerateUniqueNumber = async (req, res, next) => {
    if(!req.user || !req.user.isAdmin){
        return next(errorHandler(403, "access denied, only an admin can create vote"))
    }
  const { uniqueNumber } = req.body;
  if (!uniqueNumber) {
    return next(errorHandler(400, "unique number is required"));
  }

  try {
    const existingUniqueNumber = await UniqueNumber.findOne({ uniqueNumber });
    if (existingUniqueNumber) {
      next(errorHandler(400, " number already exist"));
    }

    const newUniqueNumber = new UniqueNumber({ uniqueNumber });
    await newUniqueNumber.save();
    return res.status(201).json({msg: "unique number successfully created"})
  } catch (error) {

  }
};
