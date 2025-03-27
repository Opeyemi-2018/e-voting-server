import mongoose from "mongoose";

const uniqueSchema = new mongoose.Schema({
    uniqueNumber: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
  }, { timestamps: true });
  
  export const UniqueNumber = mongoose.model("UniqueNumber", uniqueSchema);
  
