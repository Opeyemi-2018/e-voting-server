import { Candidate } from "../models/candidate-model.js";
import { errorHandler } from "../utils/error.js";

// Create Candidate Function
export const CreateCandidate = async (req, res, next) => {
  try {
    const { name, category, image } = req.body;

    if (!name || !category || !image) {
      return next(errorHandler(400, "Name, category, and image are required"));
    }

    const exists = await Candidate.findOne({ name });
    if (exists) {
      return next(errorHandler(400, "Candidate already exists"));
    }

    const newCandidate = new Candidate({ name, category, image });

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
    );
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

    res.status(200).json({ msg: "Candidate deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
