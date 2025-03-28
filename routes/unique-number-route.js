import express from "express"
import {DeleteUniqueNumber, GenerateUniqueNumber, GetUniqueNumber} from "../controller/unique-number-controller.js"
// import { verifyToken } from "../utils/verify-token.js"
const router = express.Router()

router.post("/generate-unique-number",  GenerateUniqueNumber)
router.get("/get-unique-number",  GetUniqueNumber)
router.delete("/delete-unique-number/:id",  DeleteUniqueNumber)

export default router
