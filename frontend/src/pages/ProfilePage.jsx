import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
  await updateProfile(form);
  setMessage("Profile updated successfully.");
} catch (error) {
      setMessage(error.response?.data?.message || "Update failed.");
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-slate-950 p-8 text-white">
          <h1 className="text-4xl font-black">{user?.name}</h1>
          <p className="mt-2 text-slate-300">{user?.email}</p>
          <p className="mt-4 capitalize text-indigo-300">{user?.role}</p>
        </div>
        <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl bg-white p-8 shadow-sm">
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Full name"
            required
            className="w-full rounded-xl border px-4 py-3"
          />
          <input
            value={form.avatar}
            onChange={(event) => setForm({ ...form, avatar: event.target.value })}
            placeholder="Avatar URL"
            className="w-full rounded-xl border px-4 py-3"
          />
          <textarea
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
            placeholder="Bio"
            rows="5"
            maxLength="300"
            className="w-full rounded-xl border px-4 py-3"
          />
          {message ? <p className="rounded-lg bg-indigo-50 p-3 text-indigo-700">{message}</p> : null}
          <button className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white">
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
