import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Calendar,
    Eye,
    FileText,
    Loader2,
    Plus,
    Sparkles,
    Trash2,
} from "lucide-react";
import { deleteAnalysis, getAnalysisHistory } from "../../api/analysisApi";

const AnalysisHistory = () => {
    const [analyses, setAnalyses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);

            const data = await getAnalysisHistory();

            setAnalyses(data.analyses || []);
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch analysis history";

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (analysisId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this analysis report?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(analysisId);

            await deleteAnalysis(analysisId);

            setAnalyses((prev) =>
                prev.filter((analysis) => analysis._id !== analysisId)
            );

            toast.success("Report deleted successfully");
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to delete report";

            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    };

    const getScoreBadgeClass = (score) => {
        if (score >= 80) {
            return "bg-green-100 text-green-700 border-green-200";
        }

        if (score >= 60) {
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }

        return "bg-red-100 text-red-700 border-red-200";
    };

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Analysis History
                    </h1>
                    <p className="mt-2 text-slate-600">
                        View all your saved AI resume analysis reports.
                    </p>
                </div>

                <Link
                    to="/analyze"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    New Analysis
                </Link>
            </div>

            {isLoading && (
                <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] p-8 text-center glass-card">
                    <Loader2 className="mb-4 animate-spin text-blue-600" size={46} />
                    <h3 className="text-lg font-bold text-slate-900">
                        Loading your reports
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Please wait while we fetch your saved analysis history.
                    </p>
                </div>
            )}

            {!isLoading && analyses.length === 0 && (
                <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] p-8 text-center glass-card">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <FileText size={34} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                        No saved reports yet
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        After you analyze your resume, your reports will be saved here
                        automatically.
                    </p>

                    <Link
                        to="/analyze"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Sparkles size={18} />
                        Analyze Resume Now
                    </Link>
                </div>
            )}

            {!isLoading && analyses.length > 0 && (
                <div className="grid gap-5">
                    {analyses.map((analysis) => (
                        <div
                            key={analysis._id}
                            className="rounded-[2rem] p-6 transition hover:-translate-y-1 glass-card"
                        >
                            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                                <div className="flex gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                        <FileText size={26} />
                                    </div>

                                    <div>
                                        <h2 className="break-all text-lg font-bold text-slate-900">
                                            {analysis.resumeFileName}
                                        </h2>

                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar size={15} />
                                                {new Date(analysis.createdAt).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold ${getScoreBadgeClass(
                                                    analysis.matchScore
                                                )}`}
                                            >
                                                Score: {analysis.matchScore}/100
                                            </span>
                                        </div>

                                        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                                            {analysis.summary}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        to={`/history/${analysis._id}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        <Eye size={17} />
                                        View Report
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(analysis._id)}
                                        disabled={deletingId === analysis._id}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {deletingId === analysis._id ? (
                                            <Loader2 className="animate-spin" size={17} />
                                        ) : (
                                            <Trash2 size={17} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisHistory;