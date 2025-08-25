import { Candidate } from "../models/candidate-model.js";
import { Student } from "../models/student-model.js";
import { Vote } from "../models/vote-model.js";
import mongoose from "mongoose";

export const CastVote = async (req, res, next) => {
  const { matricNumber, votes } = req.body;

  try {
    const student = await Student.findOne({ matricNumber });

    if (!student) {
      return res.status(404).json({
        msg: "Invalid matric number. Please provide a valid matric number to vote.",
      });
    }

    if (student.voted) {
      return res
        .status(400)
        .json({ msg: "This matric number has already been used to vote." });
    }

    for (let vote of votes) {
      const { category, candidateID } = vote;
      const candidateObjectId = new mongoose.Types.ObjectId(candidateID);

      const candidate = await Candidate.findById(candidateObjectId);

      if (!candidate) {
        return res
          .status(404)
          .json({ msg: `Candidate for ${category} not found.` });
      }

      const existingVote = await Vote.findOne({ voterID: matricNumber, category });
      if (existingVote) {
        return res.status(400).json({
          msg: `You have already voted in the ${category} category.`,
        });
      }

      const newVote = new Vote({
        voterID: matricNumber,
        candidateID: candidate._id,
        category,
      });
      await newVote.save();

      candidate.votes += 1;
      await candidate.save();
    }

    student.voted = true;
    await student.save();

    res.status(200).json({ msg: "Vote successfully cast!" });
  } catch (error) {
    next(error);
  }
};


