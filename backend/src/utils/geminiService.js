import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in Render environment variables");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const safeJsonParse = (text) => {
  try {
    if (!text) {
      throw new Error("Empty AI response received");
    }

    const cleanedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    throw new Error(`AI response was not valid JSON: ${text}`);
  }
};

export const analyzeResumeWithGemini = async ({
  resumeText,
  jobDescription,
}) => {
  const ai = getGeminiClient();

  const prompt = `
You are an expert ATS resume analyzer and technical recruiter.

Analyze the resume against the job description.

Return ONLY valid JSON. Do not include markdown. Do not include explanation outside JSON.

JSON format:
{
  "matchScore": number,
  "summary": "string",
  "missingSkills": ["string"],
  "strongSkills": ["string"],
  "improvementSuggestions": ["string"],
  "improvedBulletPoints": ["string"],
  "finalAdvice": "string"
}

Rules:
- matchScore must be between 0 and 100.
- missingSkills should include important skills from the job description that are missing or weak in the resume.
- strongSkills should include matching skills already present in the resume.
- improvementSuggestions should be clear and practical.
- improvedBulletPoints should rewrite resume points in a stronger way.
- finalAdvice should be short and useful.
- Keep all text simple and beginner-friendly.

Resume:
${resumeText.slice(0, 8000)}

Job Description:
${jobDescription}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText =
      typeof response.text === "function" ? response.text() : response.text;

    const parsedResult = safeJsonParse(responseText);

    return {
      matchScore: Math.min(
        100,
        Math.max(0, Number(parsedResult.matchScore) || 0)
      ),
      summary: parsedResult.summary || "No summary generated.",
      missingSkills: Array.isArray(parsedResult.missingSkills)
        ? parsedResult.missingSkills
        : [],
      strongSkills: Array.isArray(parsedResult.strongSkills)
        ? parsedResult.strongSkills
        : [],
      improvementSuggestions: Array.isArray(parsedResult.improvementSuggestions)
        ? parsedResult.improvementSuggestions
        : [],
      improvedBulletPoints: Array.isArray(parsedResult.improvedBulletPoints)
        ? parsedResult.improvedBulletPoints
        : [],
      finalAdvice: parsedResult.finalAdvice || "No final advice generated.",
    };
  } catch (error) {
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
};