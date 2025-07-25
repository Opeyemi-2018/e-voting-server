// import { UniqueNumber } from "../models/unique-number-model.js";
// import { errorHandler } from "../utils/error.js";

// export const GenerateUniqueNumber = async (req, res, next) => {
//   try {
//     console.log("Received Data:", req.body);

//     const { uniqueNumbers } = req.body;

//     // Validate input is an array with at least one number
//     if (!Array.isArray(uniqueNumbers)) {
//       return next(errorHandler(400, "Input must be an array of numbers"));
//     }

//     if (uniqueNumbers.length === 0) {
//       return next(errorHandler(400, "Please provide at least one number"));
//     }

//     // Process and validate each number
//     const validNumbers = [];
//     const invalidNumbers = [];

//     uniqueNumbers.forEach((num) => {
//       if (typeof num !== "string") {
//         invalidNumbers.push(num);
//         return;
//       }

//       const processedNum = num.trim().toUpperCase();

//       if (/^CSC\d+$/.test(processedNum)) {
//         validNumbers.push(processedNum);
//       } else {
//         invalidNumbers.push(num);
//       }
//     });

//     if (invalidNumbers.length > 0) {
//       return next(
//         errorHandler(
//           400,
//           `Invalid numbers detected (must be like CSC1, CSC2): ${invalidNumbers.join(
//             ", "
//           )}`
//         )
//       );
//     }

//     const uniqueSet = new Set(validNumbers);
//     if (uniqueSet.size !== validNumbers.length) {
//       return next(errorHandler(400, "Duplicate numbers found in your request"));
//     }

//     const existingNumbers = await UniqueNumber.find({
//       uniqueNumber: { $in: validNumbers },
//     });

//     if (existingNumbers.length > 0) {
//       const existing = existingNumbers.map((n) => n.uniqueNumber);
//       return next(
//         errorHandler(400, `These numbers already exist: ${existing.join(", ")}`)
//       );
//     }

//     const docsToInsert = validNumbers.map((num) => ({ uniqueNumber: num }));
//     const result = await UniqueNumber.insertMany(docsToInsert, {
//       ordered: false,
//     });

//     res.status(201).json({
//       success: true,
//       msg: `✅ ${result.length} number(s) saved successfully!`,
//       savedNumbers: validNumbers,
//       count: result.length,
//     });
//   } catch (error) {
//     console.error("Server Error:", error);

//     if (error.code === 11000) {
//       return next(
//         errorHandler(400, "Some numbers already exist (please try again)")
//       );
//     }

//     return next(errorHandler(500, "Internal server error"));
//   }
// };

// export const GetUniqueNumber = async (req, res, next) => {
//   try {
//     const uniqueNumbers = await UniqueNumber.find();
//     const count = uniqueNumbers.length;

//     res.status(200).json({
//       success: true,
//       count,
//       uniqueNumbers,
//     });
//   } catch (error) {
//     console.error("Error getting unique numbers:", error);
//     return next(errorHandler(500, "Error getting unique numbers"));
//   }
// };

// export const VerifyUniqueID = async (req, res, next) => {
//   try {
//     const { voterID } = req.body;

//     const voter = await UniqueNumber.findOne({ uniqueNumber: voterID, used: false });

//     if (!voter) {
//       return res.status(400).json({ success: false, message: "Invalid or already used voter ID" });
//     }

//     res.status(200).json({ success: true, message: "Voter ID verified" });
//   } catch (error) {
//     console.error("Error verifying voter:", error);
//     return next(errorHandler(500, "Error verifying voter ID"));
//   }
// };

// export const DeleteUniqueNumber = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await UniqueNumber.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Number deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting number:", error);
//     return next(errorHandler(500, "Error deleting number"));
//   }
// }

// export const GetUsedUniqueNumbers = async (req, res, next) => {
//   try {
//     const usedNumbers = await UniqueNumber.find({ used: true });
//     const unUsedNumber = await UniqueNumber.find({ used: false });

//     res.status(200).json({
//       success: true,
//       usedNum: usedNumbers.length,
//       unUsedNum: unUsedNumber.length,
//       usedNumbers,
//     });
//   } catch (error) {
//     console.error("Error fetching used numbers:", error);
//     return next(errorHandler(500, "Error fetching used numbers"));
//   }
// };
