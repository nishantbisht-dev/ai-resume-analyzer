import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FileText, History, Home, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-white text-violet-700 shadow-lg shadow-violet-950/10"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen">
      <aside className="fixed left-5 top-5 hidden h-[calc(100vh-40px)] w-72 rounded-[2rem] p-5 lg:block glass-dark">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-lg">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">ResumeAI</h1>
            <p className="text-xs font-medium text-cyan-100">
              Smart Job Matcher
            </p>
          </div>
        </Link>

        <nav className="mt-9 space-y-2">
          <NavLink to="/dashboard" className={navLinkClass}>
            <Home size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/analyze" className={navLinkClass}>
            <FileText size={18} />
            Analyze Resume
          </NavLink>

          <NavLink to="/history" className={navLinkClass}>
            <History size={18} />
            Saved Reports
          </NavLink>
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
          <p className="text-sm font-bold text-white">{user?.name}</p>
          <p className="mt-1 truncate text-xs text-slate-300">{user?.email}</p>

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[21rem]">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Sparkles size={18} />
              </div>
              <span className="font-black text-slate-900">ResumeAI</span>
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
            >
              Logout
            </button>
          </div>

          <nav className="mt-4 grid grid-cols-3 gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-center text-xs font-bold ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-white/70 text-slate-600"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/analyze"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-center text-xs font-bold ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-white/70 text-slate-600"
                }`
              }
            >
              Analyze
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-center text-xs font-bold ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-white/70 text-slate-600"
                }`
              }
            >
              History
            </NavLink>
          </nav>
        </header>

        <div className="p-5 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;