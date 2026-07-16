import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const user = await register(form);
      navigate(user.role === "instructor" ? "/instructor" : "/my-learning");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Create your account</h1>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <input name="name" value={form.name} onChange={change} placeholder="Full name" required className="w-full rounded-xl border px-4 py-3" />
        <input name="email" type="email" value={form.email} onChange={change} placeholder="Email" required className="w-full rounded-xl border px-4 py-3" />
        <input name="password" type="password" value={form.password} onChange={change} placeholder="Minimum 6 characters" minLength="6" required className="w-full rounded-xl border px-4 py-3" />
        <select name="role" value={form.role} onChange={change} className="w-full rounded-xl border bg-white px-4 py-3">
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        {error ? <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p> : null}
        <button type="submit" className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center">
        Already registered? <Link className="font-bold text-indigo-600" to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
