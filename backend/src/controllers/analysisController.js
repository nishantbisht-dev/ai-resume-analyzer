import fs from "fs";
import Analysis from "../models/Analysis.js";
import { extractPdfText } from "../utils/extractPdfText.js";
import { analyzeResumeWithGemini } from "../utils/geminiService.js";

const deleteUploadedFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const createAnalysis = async (req, res) => {
  let uploadedFilePath;

  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    uploadedFilePath = req.file.path;

    const trimmedJobDescription = jobDescription?.trim();

    if (
      !trimmedJobDescription ||
      trimmedJobDescription.length < 50 ||
      trimmedJobDescription.length > 1000
    ) {
      deleteUploadedFile(uploadedFilePath);

      return res.status(400).json({
        success: false,
        message: "Job description must be between 50 and 1000 characters long",
      });
    }

    const resumeText = await extractPdfText(uploadedFilePath);

    const aiResult = await analyzeResumeWithGemini({
      resumeText,
      jobDescription: trimmedJobDescription,
    });

    const analysis = await Analysis.create({
      user: req.user.id,
      resumeFileName: req.file.originalname,
      resumeText,
      jobDescription: trimmedJobDescription,
      matchScore: aiResult.matchScore,
      summary: aiResult.summary,
      missingSkills: aiResult.missingSkills,
      strongSkills: aiResult.strongSkills,
      improvementSuggestions: aiResult.improvementSuggestions,
      improvedBulletPoints: aiResult.improvedBulletPoints,
      finalAdvice: aiResult.finalAdvice,
    });

    deleteUploadedFile(uploadedFilePath);

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    deleteUploadedFile(uploadedFilePath);

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message,
    });
  }
};

export const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user.id })
      .select("-resumeText -jobDescription")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis history",
      error: error.message,
    });
  }
};

export const getSingleAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis report not found",
      });
    }

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis report",
      error: error.message,
    });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis report not found",
      });
    }

    await analysis.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Analysis report deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete analysis report",
      error: error.message,
    });
  }
};