import mongoose from "mongoose";

const uniqueSchema = new mongoose.Schema({
  uniqueNumber: { 
    type: String, 
    required: [true, "Number is required"],
    unique: true,  // This creates an index automatically
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^CSC\d+$/i.test(v);
      },
      message: props => `${props.value} is not a valid format! Use CSC followed by numbers (e.g., CSC1)`
    }
  },
  used: { 
    type: Boolean, 
    default: false 
  },
}, { 
  timestamps: true 
});


export const UniqueNumber = mongoose.model("UniqueNumber", uniqueSchema);