import { UniqueNumber } from "../models/unique-number-model.js";
import { errorHandler } from "../utils/error.js";

export const GenerateUniqueNumber = async (req, res, next) => {
  try {
    console.log("Received Data:", req.body);

    const { uniqueNumbers } = req.body;

    // Validate input is an array with at least one number
    if (!Array.isArray(uniqueNumbers)) {
      return next(errorHandler(400, "Input must be an array of numbers"));
    }

    if (uniqueNumbers.length === 0) {
      return next(errorHandler(400, "Please provide at least one number"));
    }

    // Process and validate each number
    const validNumbers = [];
    const invalidNumbers = [];

    uniqueNumbers.forEach((num) => {
      if (typeof num !== "string") {
        invalidNumbers.push(num);
        return;
      }

      const processedNum = num.trim().toUpperCase();

      if (/^CSC\d+$/.test(processedNum)) {
        validNumbers.push(processedNum);
      } else {
        invalidNumbers.push(num);
      }
    });

    if (invalidNumbers.length > 0) {
      return next(
        errorHandler(
          400,
          `Invalid numbers detected (must be like CSC1, CSC2): ${invalidNumbers.join(
            ", "
          )}`
        )
      );
    }

    const uniqueSet = new Set(validNumbers);
    if (uniqueSet.size !== validNumbers.length) {
      return next(errorHandler(400, "Duplicate numbers found in your request"));
    }

    const existingNumbers = await UniqueNumber.find({
      uniqueNumber: { $in: validNumbers },
    });

    if (existingNumbers.length > 0) {
      const existing = existingNumbers.map((n) => n.uniqueNumber);
      return next(
        errorHandler(400, `These numbers already exist: ${existing.join(", ")}`)
      );
    }

    const docsToInsert = validNumbers.map((num) => ({ uniqueNumber: num }));
    const result = await UniqueNumber.insertMany(docsToInsert, {
      ordered: false,
    });

    res.status(201).json({
      success: true,
      msg: `✅ ${result.length} number(s) saved successfully!`,
      savedNumbers: validNumbers,
      count: result.length,
    });
  } catch (error) {
    console.error("Server Error:", error);

    if (error.code === 11000) {
      return next(
        errorHandler(400, "Some numbers already exist (please try again)")
      );
    }

    return next(errorHandler(500, "Internal server error"));
  }
};
