import { Candidate } from "../models/candidate-model.js";
import { UniqueNumber } from "../models/unique-number-model.js";
import { Vote } from "../models/vote-model.js";
import mongoose from "mongoose";


export const CastVote = async (req, res, next) => {
  const { uniqueNumber, votes } = req.body;

  try {
    console.log("Received vote request:", req.body);

    // Step 1: Verify the unique number
    const uniqueNumberDoc = await UniqueNumber.findOne({ uniqueNumber });
    if (!uniqueNumberDoc) {
      return res.status(404).json({ msg: "Invalid unique number. Please provide a valid unique number to vote." });
    }

    if (uniqueNumberDoc.used) {
      return res.status(400).json({ msg: "This unique number has already been used to vote." });
    }

    // Step 2: Handle each vote in the request
    for (let vote of votes) {
      const { category, candidateID } = vote;

      // Convert the candidateID to ObjectId using 'new' keyword
      const candidateObjectId = new mongoose.Types.ObjectId(candidateID);  // Correct way to instantiate ObjectId

      const candidate = await Candidate.findById(candidateObjectId);
      console.log("Candidate found:", candidate); // Check if the candidate is now found

      if (!candidate) {
        return res.status(404).json({ msg: `Candidate for ${category} not found.` });
      }

      // Step 3: Check if the user has already voted in the selected category
      const existingVote = await Vote.findOne({ uniqueNumber, category });
      if (existingVote) {
        return res.status(400).json({ msg: `You have already voted in the ${category} category.` });
      }

      // Step 4: Create a new vote record for this category
      const newVote = new Vote({
        voterID: uniqueNumber, // Set the uniqueNumber as voterID (String now)
        candidateID: candidate._id,
        category,
      });
      await newVote.save();

      // Step 5: Update the candidate's vote count
      candidate.votes += 1;
      await candidate.save();
    }

    // Step 6: Mark the unique number as used
    uniqueNumberDoc.used = true;
    await uniqueNumberDoc.save();

    // Step 7: Send a success response
    res.status(200).json({ msg: "Vote successfully cast!" });
  } catch (error) {
    next(error);
  }
};
