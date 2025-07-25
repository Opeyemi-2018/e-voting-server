
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    voterID: { type: String, required: true },  
    candidateID: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    category: { type: String, required: true }, // Add back the category field if needed
  },
  { timestamps: true }
);

export const Vote = mongoose.model("Vote", voteSchema);
