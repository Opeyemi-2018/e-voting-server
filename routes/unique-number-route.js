import express from "express"
import {GenerateUniqueNumber} from "../controller/unique-number-controller.js"
// import { verifyToken } from "../utils/verify-token.js"
const router = express.Router()

router.post("/generate-unique-number",  GenerateUniqueNumber)

export default router
