import express from "express";
import {
  DeleteUniqueNumber,
  GenerateUniqueNumber,
  GetUniqueNumber,
  VerifyUniqueID,
  GetUsedUniqueNumbers
} from "../controller/unique-number-controller.js";
// import { verifyToken } from "../utils/verify-token.js"
const router = express.Router();

router.post("/generate-unique-number", GenerateUniqueNumber);
router.get("/get-unique-number", GetUniqueNumber);
router.post("/verify-uniqueID", VerifyUniqueID);
router.delete("/delete-unique-number/:id", DeleteUniqueNumber);
router.get("/used-unique-number", GetUsedUniqueNumbers);

export default router;
