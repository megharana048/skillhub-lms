import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
};

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });

  function change(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setStatus((currentStatus) => ({
      ...currentStatus,
      error: "",
    }));
  }

  async function submit(event) {
    event.preventDefault();

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setStatus({
        loading: false,
        error: "Please enter your complete name.",
      });
      return;
    }

    if (!cleanEmail) {
      setStatus({
        loading: false,
        error: "Please enter your email address.",
      });
      return;
    }

    if (form.password.length < 8) {
      setStatus({
        loading: false,
        error: "Password must contain at least 8 characters.",
      });
      return;
    }

    setStatus({
      loading: true,
      error: "",
    });

    try {
      const registeredUser = await register({
        name: cleanName,
        email: cleanEmail,
        password: form.password,
        role: form.role,
      });

      const userRole =
        registeredUser?.role || form.role;

      if (userRole === "instructor") {
        navigate("/instructor", {
          replace: true,
        });
        return;
      }

      if (userRole === "admin") {
        navigate("/admin", {
          replace: true,
        });
        return;
      }

      navigate("/my-learning", {
        replace: true,
      });
    } catch (requestError) {
      setStatus({
        loading: false,
        error:
          requestError.response?.data?.message ||
          requestError.message ||
          "Registration failed. Please try again.",
      });
    }
  }

  return (
    <div>
      <p className="font-bold uppercase tracking-[0.2em] text-[#6366F1]">
        Join SkillHub
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] text-[#F8FAFC]">
        Create your account
      </h1>

      <p className="mt-4 leading-7 text-[#94A3B8]">
        Start learning practical and career-focused skills.
      </p>

      <form
        onSubmit={submit}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="register-name"
            className="mb-2 block text-sm font-semibold text-[#94A3B8]"
          >
            Full name
          </label>

          <input
            id="register-name"
            name="name"
            type="text"
            value={form.name}
            onChange={change}
            placeholder="Enter your full name"
            autoComplete="name"
            required
            className="w-full rounded-2xl border border-[#243047] bg-[#0B1120] px-4 py-3.5 text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 block text-sm font-semibold text-[#94A3B8]"
          >
            Email address
          </label>

          <div className="flex items-center rounded-2xl border border-[#243047] bg-[#0B1120] px-4 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20">
            <Mail
              size={18}
              className="shrink-0 text-[#64748B]"
            />

            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full bg-transparent px-3 py-3.5 text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-2 block text-sm font-semibold text-[#94A3B8]"
          >
            Password
          </label>

          <div className="flex items-center rounded-2xl border border-[#243047] bg-[#0B1120] px-4 focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20">
            <LockKeyhole
              size={18}
              className="shrink-0 text-[#64748B]"
            />

            <input
              id="register-password"
              name="password"
              type={
                passwordVisible
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={change}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full bg-transparent px-3 py-3.5 text-[#F8FAFC] outline-none placeholder:text-[#64748B]"
            />

            <button
              type="button"
              onClick={() =>
                setPasswordVisible(
                  (currentValue) => !currentValue,
                )
              }
              className="text-[#64748B] hover:text-[#A78BFA]"
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

        <div>
          <label
            htmlFor="register-role"
            className="mb-2 block text-sm font-semibold text-[#94A3B8]"
          >
            Register as
          </label>

          <select
            id="register-role"
            name="role"
            value={form.role}
            onChange={change}
            className="w-full rounded-2xl border border-[#243047] bg-[#0B1120] px-4 py-3.5 text-[#F8FAFC] outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
          >
            <option value="student">
              Student
            </option>

            <option value="instructor">
              Instructor
            </option>
          </select>
        </div>

        {status.error ? (
          <p className="rounded-2xl border border-[#F43F5E]/25 bg-[#F43F5E]/10 p-4 text-sm font-medium text-[#F43F5E]">
            {status.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status.loading}
          className="primary-button w-full rounded-2xl px-5 py-3.5 font-bold"
        >
          {status.loading
            ? "Creating account..."
            : "Create Account"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#94A3B8]">
        Already registered?{" "}
        <Link
          to="/login"
          className="font-bold text-[#A78BFA] hover:text-[#6366F1]"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;