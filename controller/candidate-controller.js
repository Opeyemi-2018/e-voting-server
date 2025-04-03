import { Candidate } from "../models/candidate-model.js";
import { errorHandler } from "../utils/error.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure 'uploads' folder exists
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Upload Middleware
const upload = multer({ storage });

export const uploadCandidateImage = upload.single("image");

// Create Candidate Function
export const CreateCandidate = async (req, res, next) => {
  try {
    const { name, category } = req.body;

    if (!name || !category || !req.file) {
      return next(errorHandler(400, "Name, category, and image are required"));
    }

    const exists = await Candidate.findOne({ name });
    if (exists) {
      return next(errorHandler(400, "Candidate already exists"));
    }

    // Corrected Image Path (relative to frontend access)
    const imagePath = `/uploads/${req.file.filename}`;

    const newCandidate = new Candidate({ name, category, image: imagePath });

    await newCandidate.save();

    res
      .status(201)
      .json({ msg: "Candidate added successfully!", candidate: newCandidate });
  } catch (error) {
    next(error);
  }
};

// Get All Candidates
export const GetCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().select(
      "name category votes image"
    ); // Include image field
    res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
};

// Delete Candidate
export const DeleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    // Delete Image File from Server
    const imagePath = path.join(uploadDir, path.basename(candidate.image));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ msg: "Candidate deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
