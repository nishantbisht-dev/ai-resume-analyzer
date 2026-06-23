import express from "express";
import {
  createAnalysis,
  getMyAnalyses,
  getSingleAnalysis,
  deleteAnalysis,
} from "../controllers/analysisController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, uploadResume.single("resume"), createAnalysis);

router.get("/", protect, getMyAnalyses);

router.get("/:id", protect, getSingleAnalysis);

router.delete("/:id", protect, deleteAnalysis);

export default router;