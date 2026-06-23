import fs from "fs";
import pdfParse from "pdf-parse";

export const extractPdfText = async (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);

    const text = pdfData.text
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    if (!text || text.length < 100) {
      throw new Error("Could not extract enough readable text from the resume");
    }

    return text;
  } catch (error) {
    throw new Error(`PDF text extraction failed: ${error.message}`);
  }
};