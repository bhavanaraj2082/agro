import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false, 
      trim: true,
    },
    email: {
      type: String,
      required: false, 
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      trim: true,
    },
    url: {
      type: String,
      required: false,
      trim: true,
    },
    issue: {
      type: [mongoose.Schema.Types.Mixed], 
      required: false,
      trim: true,
      maxSize: 2000000,
    },
    requirement: {
      type: String,  // Updated to String to accept values like "Yes", "No"
      required: false,
    },
    rating: {
      type: String,
      required: false,
      trim: true,
    },
    feedback: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: false, 
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "feedback",
  }
);

// Ensure the model is only created once
const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
export default Feedback;
