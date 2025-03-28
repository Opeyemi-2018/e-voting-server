import { Candidate } from "../models/candidate-model.js";
import { errorHandler } from "../utils/error.js";

export const CreateCandidate = async (req, res, next) => {
    try {
    const { name, category } = req.body;

    if (!name || !category) {
      return next(errorHandler(400, "Name and category are required"));
    }

    const exists = await Candidate.findOne({ name });
    if (exists) {
      return next(errorHandler(400, "Candidate already exists"));
    }

    const newCandidate = new Candidate({ name, category });
    await newCandidate.save();

    res.status(201).json({ msg: "Candidate added successfully!", candidate: newCandidate });
  } catch (error) {
    next(error);
  }
}

export const GetCandidates = async (req, res, next) => {
    try {
      const candidates = await Candidate.find().select("name category votes");
      res.status(200).json(candidates);
    } catch (error) {
      next(error);
    }
  };
  
  
  export const DeleteCandidate = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // if (!mongoose.Types.ObjectId.isValid(id)) {
      //   return res.status(400).json({ msg: "Invalid candidate ID" });
      // }
  
      const candidate = await Candidate.findByIdAndDelete(id);
  
      if (!candidate) {
        return res.status(404).json({ msg: "Candidate not found" });
      }
  
      res.status(200).json({ msg: "Candidate deleted successfully!" });
    } catch (error) {
      next(error);
    }
  };
  