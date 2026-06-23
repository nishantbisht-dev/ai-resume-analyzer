import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register, authLoading, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const result = await register(formData);

        if (result.success) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg">
            <div className="w-full max-w-md rounded-[2rem] p-8 glass-card">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg">
                        <Sparkles size={26} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-slate-900">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Start analyzing your resume with AI.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nishant Bisht"
                            className="soft-input w-full rounded-2xl px-4 py-3 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nishant@example.com"
                            className="soft-input w-full rounded-2xl px-4 py-3 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            className="soft-input w-full rounded-2xl px-4 py-3 outline-none"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {authLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-blue-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;