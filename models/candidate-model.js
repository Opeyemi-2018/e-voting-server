import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    category: { type: String, required: true },
    votes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
