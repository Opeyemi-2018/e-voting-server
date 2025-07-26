import express from "express";
import {
  CreateCandidate,
  GetCandidates,
  DeleteCandidate,
} from "../controller/candidate-controller.js";

const router = express.Router();
router.post("/create-candidate", CreateCandidate);
router.get("/get-candidate", GetCandidates);
router.delete("/delete-candidate/:id", DeleteCandidate);

export default router;
