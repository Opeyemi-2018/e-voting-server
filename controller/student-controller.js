import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import { Student } from "../models/student-model.js";

export const studentSignUp = async (req, res, next) => {
  const { email, matricNumber, password, userName } = req.body;

  if (!email || !matricNumber || !password || !userName) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existing = await Student.findOne({
      $or: [{ email }, { matricNumber }],
    });
    if (existing)
      return next(errorHandler(409, "Email or matric number already exists"));

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newStudent = new Student({
      email,
      matricNumber: matricNumber.toUpperCase(),
      userName,
      password: hashedPassword,
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    next(error);
  }
};

// SIGN IN
export const studentSignIn = async (req, res, next) => {
  const { matricNumber, password } = req.body;
  if (!matricNumber || !password) {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const student = await Student.findOne({
      matricNumber: matricNumber.toUpperCase(),
    });
    if (!student) return next(errorHandler(404, "Student not found"));

    const isPasswordCorrect = await bcrypt.compare(password, student.password);
    if (!isPasswordCorrect)
      return next(errorHandler(401, "Wrong matric number or password"));

    // Check if already voted
    // if (student.voted) {
    //   return next(errorHandler(403, "You have already voted."));
    // }

    const token = jwt.sign(
      { id: student._id, matricNumber: student.matricNumber },
      process.env.STUDENT_TOKEN,
      { expiresIn: "24h" }
    );

    const { password: _, ...rest } = student._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ token, student: rest });
  } catch (error) {
    next(error);
  }
};

// SIGN OUT
export const studentSignOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).select(
      "userName email matricNumber"
    );

    if (!student) return next(errorHandler(404, "Student not found"));

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const getVotedStudentsCount = async (req, res, next) => {
  try {
    const count = await Student.countDocuments({ voted: true });
    const unCount = await Student.countDocuments({ voted: false });

    res.status(200).json({
      success: true,
      votedCount: count,
      votedNonCount: unCount,
    });
  } catch (error) {
    next(error);
  }
};

// export const verifyMatricAndPassword = async (req, res, next) => {
//   const { matricNumber, password } = req.body;

//   if (!matricNumber || !password) {
//     return next(errorHandler(400, "Matric number and password are required"));
//   }

//   try {
//     // Find student by matric number
//     const student = await Student.findOne({
//       matricNumber: matricNumber.toUpperCase(),
//     });

//     if (!student) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Matric number not found" });
//     }

//     // Check password
//     const isPasswordCorrect = await bcrypt.compare(password, student.password);

//     if (!isPasswordCorrect) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Incorrect password" });
//     }

//     // Check if already voted
//     if (student.voted) {
//       return res
//         .status(403)
//         .json({ success: false, message: "You have already voted." });
//     }

//     // If all good
//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Valid matric number and password",
//         studentId: student._id,
//       });
//   } catch (error) {
//     next(error);
//   }
// };

// POST /api/student/verify-matric
// export const verifyMatricNumber = async (req, res) => {
//   const { matricNumber } = req.body;

//   try {
//     const student = await Student.findOne({ matricNumber: matricNumber.toUpperCase() });

//     if (!student) {
//       return res.status(404).json({ success: false, msg: "Matric number not found." });
//     }

//     if (student.voted) {
//       return res.status(400).json({ success: false, msg: "This matric number has already voted." });
//     }

//     return res.status(200).json({ success: true, msg: "Valid matric number." });
//   } catch (error) {
//     return res.status(500).json({ success: false, msg: "Server error." });
//   }
// };
