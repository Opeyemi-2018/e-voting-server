import { UniqueNumber } from "../models/unique-number-model.js";
import { errorHandler } from "../utils/error.js";

export const GenerateUniqueNumber = async (req, res, next) => {
  try {
    console.log("Received Data:", req.body); // Debugging line

    const { uniqueNumber } = req.body;

    if (!Array.isArray(uniqueNumber) || uniqueNumber.length === 0) {
      return next(errorHandler(400, "Please provide at least one number."));
    }
    
    const uniqueNumbers = [];

    for (let num of uniqueNumber) {
      if (!num.trim()) {
        return next(errorHandler(400, "Invalid number provided."));
      }

      // Check if the number already exists
      const exists = await UniqueNumber.findOne({ uniqueNumber: num });
      if (exists) {
        return next(errorHandler(400, `Number ${num} already exists.`));
      }

      uniqueNumbers.push({ uniqueNumber: num });
    }

    // Bulk insert the numbers
    await UniqueNumber.insertMany(uniqueNumbers);

    res.status(201).json({ msg: "✅ Numbers saved successfully!" });
  } catch (error) {
    console.error("Server Error:", error);
    return next(errorHandler(500, "Internal server error"));
  }
};

