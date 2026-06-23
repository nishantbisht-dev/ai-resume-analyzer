import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    AlertCircle,
    CheckCircle2,
    FileCheck2,
    FileText,
    Loader2,
    Sparkles,
    Upload,
    X,
} from "lucide-react";
import { createResumeAnalysis } from "../../api/analysisApi";

const MIN_JOB_DESCRIPTION_LENGTH = 250;

const AnalyzeResume = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF resume files are allowed");
            event.target.value = "";
            setResumeFile(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Resume file size must be less than 5 MB");
            event.target.value = "";
            setResumeFile(null);
            return;
        }

        setResumeFile(file);
        toast.success("Resume PDF uploaded successfully");
    };

    const removeResumeFile = () => {
        setResumeFile(null);

        const fileInput = document.getElementById("resume-upload");
        if (fileInput) {
            fileInput.value = "";
        }

        toast.success("Resume removed");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!resumeFile) {
            toast.error("Please upload your resume PDF first");
            return;
        }

        if (jobDescription.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
            toast.error(
                `Job description must be at least ${MIN_JOB_DESCRIPTION_LENGTH} characters long`
            );
            return;
        }

        setIsAnalyzing(true);
        setAnalysis(null);

        try {
            const data = await createResumeAnalysis({
                resumeFile,
                jobDescription: jobDescription.trim(),
            });

            setAnalysis(data.analysis);
            toast.success("Resume analyzed successfully");
        } catch (error) {
            console.log("Analyze resume error:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to analyze resume. Please check backend, Gemini API key, and PDF file.";

            toast.error(message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreStyle = (score) => {
        if (score >= 80) {
            return "bg-green-100 text-green-700 border-green-200";
        }

        if (score >= 60) {
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }

        return "bg-red-100 text-red-700 border-red-200";
    };

    const remainingCharacters =
        MIN_JOB_DESCRIPTION_LENGTH - jobDescription.trim().length;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Analyze Resume
                    </h1>
                    <p className="mt-2 max-w-2xl text-slate-600">
                        Upload your resume PDF and paste a detailed job description. AI will
                        compare both and give you a match score, missing skills, and
                        improvement suggestions.
                    </p>
                </div>

                <Link
                    to="/history"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/70 bg-white/65 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
                >
                    View History
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-[2rem] p-6 glass-card"
                >
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Upload Details
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Use a clean PDF resume and a detailed job description for better
                            AI results.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Resume PDF
                            </label>

                            {!resumeFile ? (
                                <label
                                    htmlFor="resume-upload"
                                    className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border-2 border-dashed border-violet-200 bg-white/55 px-5 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50/70"
                                >
                                    <Upload className="mb-3 text-slate-500" size={34} />

                                    <span className="font-semibold text-slate-800">
                                        Click to upload resume
                                    </span>

                                    <span className="mt-1 text-sm text-slate-500">
                                        PDF only, max 5 MB
                                    </span>

                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
                                                <FileCheck2 size={24} />
                                            </div>

                                            <div>
                                                <p className="font-bold text-green-800">
                                                    Resume uploaded successfully
                                                </p>

                                                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                                                    {resumeFile.name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={removeResumeFile}
                                            className="rounded-lg bg-white p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Job Description
                            </label>

                            <textarea
                                value={jobDescription}
                                onChange={(event) => setJobDescription(event.target.value)}
                                placeholder="Paste the full job description here. It should include required skills, responsibilities, experience, tools, and job expectations..."
                                rows={12}
                                className="soft-input w-full resize-none rounded-[1.4rem] px-4 py-3 text-sm outline-none"
                            />

                            <div className="mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                                <span
                                    className={
                                        jobDescription.trim().length >= MIN_JOB_DESCRIPTION_LENGTH
                                            ? "font-medium text-green-600"
                                            : "text-slate-500"
                                    }
                                >
                                    Minimum {MIN_JOB_DESCRIPTION_LENGTH} characters required
                                </span>

                                <span
                                    className={
                                        remainingCharacters <= 0
                                            ? "font-medium text-green-600"
                                            : "text-slate-500"
                                    }
                                >
                                    {jobDescription.trim().length} characters
                                    {remainingCharacters > 0
                                        ? `, ${remainingCharacters} more needed`
                                        : ", ready to analyze"}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isAnalyzing}
                            className="primary-btn flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-bold disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Analyzing Resume...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Analyze with AI
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="rounded-[2rem] p-6 glass-card">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Analysis Result
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Your AI report will appear here after analysis.
                        </p>
                    </div>

                    {!analysis && !isAnalyzing && (
                        <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl bg-slate-50 p-8 text-center">
                            <FileText className="mb-4 text-slate-400" size={48} />
                            <h3 className="text-lg font-bold text-slate-800">
                                No analysis yet
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-500">
                                Upload your resume and paste a job description to generate your
                                AI-powered resume match report.
                            </p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl bg-blue-50 p-8 text-center">
                            <Loader2 className="mb-4 animate-spin text-blue-600" size={48} />
                            <h3 className="text-lg font-bold text-slate-900">
                                AI is analyzing your resume
                            </h3>
                            <p className="mt-2 max-w-sm text-sm text-slate-600">
                                We are checking skills, job match, missing keywords, and resume
                                improvement points.
                            </p>
                        </div>
                    )}

                    {analysis && !isAnalyzing && (
                        <div className="space-y-5">
                            <div
                                className={`rounded-2xl border p-5 ${getScoreStyle(
                                    analysis.matchScore
                                )}`}
                            >
                                <p className="text-sm font-semibold">Match Score</p>
                                <div className="mt-2 flex items-end gap-1">
                                    <span className="text-5xl font-black">
                                        {analysis.matchScore}
                                    </span>
                                    <span className="mb-2 text-xl font-bold">/100</span>
                                </div>
                            </div>

                            <ResultSection title="Summary">
                                <p className="text-sm leading-6 text-slate-600">
                                    {analysis.summary}
                                </p>
                            </ResultSection>

                            <ResultSection title="Strong Skills">
                                <TagList
                                    items={analysis.strongSkills}
                                    emptyText="No strong skills found."
                                    type="success"
                                />
                            </ResultSection>

                            <ResultSection title="Missing Skills">
                                <TagList
                                    items={analysis.missingSkills}
                                    emptyText="No missing skills found."
                                    type="warning"
                                />
                            </ResultSection>

                            <ResultSection title="Improvement Suggestions">
                                <BulletList
                                    items={analysis.improvementSuggestions}
                                    emptyText="No suggestions generated."
                                />
                            </ResultSection>

                            <ResultSection title="Improved Bullet Points">
                                <BulletList
                                    items={analysis.improvedBulletPoints}
                                    emptyText="No improved bullet points generated."
                                />
                            </ResultSection>

                            <ResultSection title="Final Advice">
                                <p className="text-sm leading-6 text-slate-600">
                                    {analysis.finalAdvice}
                                </p>
                            </ResultSection>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <Link
                                    to={`/history/${analysis._id}`}
                                    className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Open Full Report
                                </Link>

                                <Link
                                    to="/history"
                                    className="flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    View All Reports
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ResultSection = ({ title, children }) => {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-600" />
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>

            {children}
        </section>
    );
};

const TagList = ({ items = [], emptyText, type }) => {
    if (!items.length) {
        return <p className="text-sm text-slate-500">{emptyText}</p>;
    }

    const style =
        type === "success"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-orange-50 text-orange-700 border-orange-200";

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
                <span
                    key={`${item}-${index}`}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${style}`}
                >
                    {item}
                </span>
            ))}
        </div>
    );
};

const BulletList = ({ items = [], emptyText }) => {
    if (!items.length) {
        return <p className="text-sm text-slate-500">{emptyText}</p>;
    }

    return (
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li
                    key={`${item}-${index}`}
                    className="flex gap-3 text-sm text-slate-600"
                >
                    <AlertCircle className="mt-0.5 shrink-0 text-blue-600" size={16} />
                    <span className="leading-6">{item}</span>
                </li>
            ))}
        </ul>
    );
};

export default AnalyzeResume;