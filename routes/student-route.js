import express from "express";
import {
  studentSignIn,
  studentSignOut,
  studentSignUp,
  getStudentProfile, getAllStudents, getVotedStudentsCount
} from "../controller/student-controller.js";

const router = express.Router();

router.post("/sign-up", studentSignUp);
router.post("/sign-in", studentSignIn);
router.get("/sign-out", studentSignOut);
router.get("/students", getAllStudents);
router.get("/voted-students", getVotedStudentsCount);
router.get("/student-profile/:id", getStudentProfile);

export default router;
