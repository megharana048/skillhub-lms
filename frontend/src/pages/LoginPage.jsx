import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false);

  const [status, setStatus] =
    useState({
      loading: false,
      error: "",
    });

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentFormData) => ({
        ...currentFormData,
        [name]: value,
      }),
    );

    setStatus(
      (currentStatus) => ({
        ...currentStatus,
        error: "",
      }),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus({
      loading: true,
      error: "",
    });

    try {
      const user =
        await login(formData);

      const defaultRoute =
        user.role === "admin"
          ? "/admin"
          : user.role === "instructor"
            ? "/instructor"
            : "/my-learning";

      navigate(
        location.state?.from ||
          defaultRoute,
        {
          replace: true,
        },
      );
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error.response?.data
            ?.message ||
          "Login failed. Check your email and password.",
      });
    }
  }

  return (
    <div>
      <p className="font-bold uppercase tracking-[0.2em] text-indigo-400">
        Welcome back
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-white">
        Login to SkillHub
      </h1>

      <p className="mt-4 text-slate-400">
        Continue your learning journey.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-9 space-y-5"
      >
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Email address
          </label>

          <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950/80 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Mail
              size={18}
              className="text-slate-500"
            />

            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full bg-transparent px-3 py-3.5 text-white outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Password
          </label>

          <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950/80 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <LockKeyhole
              size={18}
              className="text-slate-500"
            />

            <input
              id="login-password"
              name="password"
              type={
                passwordVisible
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full bg-transparent px-3 py-3.5 text-white outline-none placeholder:text-slate-600"
            />

            <button
              type="button"
              onClick={() =>
                setPasswordVisible(
                  (currentValue) =>
                    !currentValue,
                )
              }
              className="text-slate-500 hover:text-indigo-300"
              aria-label={
                passwordVisible
                  ? "Hide password"
                  : "Show password"
              }
            >
              {passwordVisible ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {status.error && (
          <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-sm font-medium text-rose-400">
            {status.error}
          </p>
        )}

        <button
          type="submit"
          disabled={status.loading}
          className="glow-button w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3.5 font-bold text-white hover:-translate-y-0.5"
        >
          {status.loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-indigo-300 hover:text-violet-300"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;