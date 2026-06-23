import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    FileText,
    Loader2,
    Sparkles,
    Target,
    Trash2,
} from "lucide-react";
import { deleteAnalysis, getSingleAnalysis } from "../../api/analysisApi";

const AnalysisDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchSingleReport = async () => {
            try {
                setIsLoading(true);

                const data = await getSingleAnalysis(id);

                setAnalysis(data.analysis);
            } catch (error) {
                const message =
                    error.response?.data?.message || "Failed to fetch analysis report";

                toast.error(message);
                navigate("/history");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSingleReport();
    }, [id, navigate]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmDelete) return;

        try {
            setIsDeleting(true);

            await deleteAnalysis(id);

            toast.success("Report deleted successfully");
            navigate("/history");
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to delete report";

            toast.error(message);
        } finally {
            setIsDeleting(false);
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

    if (isLoading) {
        return (
            <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] p-8 text-center glass-card">
                <Loader2 className="mb-4 animate-spin text-blue-600" size={46} />
                <h3 className="text-lg font-bold text-slate-900">
                    Loading saved report
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                    Please wait while we fetch your full analysis.
                </p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                    Report not found
                </h2>

                <Link
                    to="/history"
                    className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                >
                    Back to History
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <Link
                        to="/history"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={17} />
                        Back to History
                    </Link>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Full Analysis Report
                    </h1>

                    <p className="mt-2 break-all text-slate-600">
                        {analysis.resumeFileName}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isDeleting ? (
                        <Loader2 className="animate-spin" size={17} />
                    ) : (
                        <Trash2 size={17} />
                    )}
                    Delete Report
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-6">
                    <div
                        className={`rounded-3xl border p-6 ${getScoreStyle(
                            analysis.matchScore
                        )}`}
                    >
                        <div className="flex items-center gap-3">
                            <Target size={24} />
                            <p className="font-bold">Resume Match Score</p>
                        </div>

                        <div className="mt-5 flex items-end gap-1">
                            <span className="text-6xl font-black">
                                {analysis.matchScore}
                            </span>
                            <span className="mb-2 text-2xl font-bold">/100</span>
                        </div>
                    </div>

                    <InfoCard
                        icon={<Calendar size={22} />}
                        title="Created On"
                        value={new Date(analysis.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    />

                    <InfoCard
                        icon={<FileText size={22} />}
                        title="Resume File"
                        value={analysis.resumeFileName}
                    />

                    <Link
                        to="/analyze"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        <Sparkles size={19} />
                        Analyze Another Resume
                    </Link>
                </div>

                <div className="space-y-6">
                    <ResultSection title="Summary">
                        <p className="text-sm leading-7 text-slate-600">
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
                            emptyText="No improvement suggestions generated."
                        />
                    </ResultSection>

                    <ResultSection title="Improved Bullet Points">
                        <BulletList
                            items={analysis.improvedBulletPoints}
                            emptyText="No improved bullet points generated."
                        />
                    </ResultSection>

                    <ResultSection title="Final Advice">
                        <p className="text-sm leading-7 text-slate-600">
                            {analysis.finalAdvice}
                        </p>
                    </ResultSection>

                    <ResultSection title="Job Description Used">
                        <p className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                            {analysis.jobDescription}
                        </p>
                    </ResultSection>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, title, value }) => {
    return (
        <div className="rounded-[2rem] p-6 glass-card">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {icon}
            </div>

            <p className="text-sm font-semibold text-slate-500">{title}</p>
            <p className="mt-1 break-all font-bold text-slate-900">{value}</p>
        </div>
    );
};

const ResultSection = ({ title, children }) => {
    return (
        <section className="rounded-[2rem] p-6 glass-card">
            <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 size={19} className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
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
                    <span className="leading-7">{item}</span>
                </li>
            ))}
        </ul>
    );
};

export default AnalysisDetails;