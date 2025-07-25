import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  matricNumber: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  voted: { type: Boolean, default: false },
});

export const Student = mongoose.model("Student", studentSchema);
