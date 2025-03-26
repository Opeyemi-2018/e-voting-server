import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
    uniqueNumber: { type: String, required: true },
    category: { type: String, required: true }, 
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  });

  export const Vote = mongoose.model("Vote", VoteSchema)