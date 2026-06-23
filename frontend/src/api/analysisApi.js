import api from "./axiosInstance";

export const createResumeAnalysis = async ({ resumeFile, jobDescription }) => {
  const formData = new FormData();

  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);

  const { data } = await api.post("/analyses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getAnalysisHistory = async () => {
  const { data } = await api.get("/analyses");
  return data;
};

export const getSingleAnalysis = async (analysisId) => {
  const { data } = await api.get(`/analyses/${analysisId}`);
  return data;
};

export const deleteAnalysis = async (analysisId) => {
  const { data } = await api.delete(`/analyses/${analysisId}`);
  return data;
};