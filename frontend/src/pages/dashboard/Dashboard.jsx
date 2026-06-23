import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  History,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-[2rem] p-8 text-white glass-dark md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
            AI powered resume intelligence
          </p>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Hey {user?.name?.split(" ")[0]}, make your resume job-ready.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Upload your resume, paste any job description, and get a clean AI
            report with match score, missing skills, strong points, and better
            resume bullet suggestions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/analyze"
              className="primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold"
            >
              Analyze Resume
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/history"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              View Saved Reports
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <FeatureCard
          icon={<FileText size={25} />}
          title="Upload Resume"
          description="Upload your PDF resume and extract useful information from it."
        />

        <FeatureCard
          icon={<Target size={25} />}
          title="Match With Job"
          description="Compare your resume with real job descriptions and get a score."
        />

        <FeatureCard
          icon={<Sparkles size={25} />}
          title="Improve With AI"
          description="Get missing skills, better bullet points, and clear final advice."
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] p-6 glass-card">
          <h2 className="text-2xl font-black text-slate-900">
            What this project shows in your resume
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <MiniPoint text="MERN stack full-stack development" />
            <MiniPoint text="JWT authentication and protected routes" />
            <MiniPoint text="PDF upload and text extraction" />
            <MiniPoint text="Google Gemini AI integration" />
            <MiniPoint text="MongoDB saved analysis history" />
            <MiniPoint text="Responsive modern dashboard UI" />
          </div>
        </div>

        <div className="rounded-[2rem] p-6 glass-card">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <History size={24} />
          </div>

          <h2 className="text-xl font-black text-slate-900">
            Keep improving
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Every analysis is saved, so you can compare different job
            descriptions and improve your resume step by step.
          </p>

          <Link
            to="/history"
            className="mt-5 inline-flex items-center gap-2 text-sm font-black text-violet-700"
          >
            Open history
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="rounded-[2rem] p-6 transition hover:-translate-y-1 glass-card">
      <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-violet-700">
        {icon}
      </div>

      <h3 className="text-lg font-black text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
};

const MiniPoint = ({ text }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/65 p-4">
      <ShieldCheck className="shrink-0 text-violet-600" size={19} />
      <p className="text-sm font-semibold text-slate-700">{text}</p>
    </div>
  );
};

export default Dashboard;