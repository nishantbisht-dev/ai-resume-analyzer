import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeFileName: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    summary: {
      type: String,
      required: true,
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strongSkills: {
      type: [String],
      default: [],
    },

    improvementSuggestions: {
      type: [String],
      default: [],
    },

    improvedBulletPoints: {
      type: [String],
      default: [],
    },

    finalAdvice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;