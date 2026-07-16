import { useEffect, useState } from "react";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

function AdminPage() {
  const [state, setState] = useState({ loading: true, error: "", stats: null, users: [], courses: [] });

  async function load() {
    try {
      const [stats, users, courses] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/courses"),
      ]);
      setState({
        loading: false,
        error: "",
        stats: stats.data.stats,
        users: users.data.users,
        courses: courses.data.courses,
      });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.response?.data?.message || "Admin load failed." }));
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleUser(id) {
    await api.patch(`/admin/users/${id}/status`);
    load();
  }

  async function deleteCourse(id) {
    if (!window.confirm("Delete this course?")) return;
    await api.delete(`/admin/courses/${id}`);
    load();
  }

  if (state.loading) return <Loader label="Loading admin dashboard..." />;

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">Admin Dashboard</h1>
        {state.error ? <p className="mt-6 text-red-700">{state.error}</p> : null}
        {state.stats ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(state.stats).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="capitalize text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="mt-3 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Users</h2>
          <table className="mt-6 w-full min-w-[700px] text-left">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {state.users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="py-3 font-bold">{user.name}</td>
                  <td>{user.email}</td><td>{user.role}</td>
                  <td>{user.isActive ? "Active" : "Blocked"}</td>
                  <td><button onClick={() => toggleUser(user._id)} className="font-bold text-indigo-600">{user.isActive ? "Block" : "Activate"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Courses</h2>
          <table className="mt-6 w-full min-w-[700px] text-left">
            <thead><tr><th>Title</th><th>Instructor</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {state.courses.map((course) => (
                <tr key={course._id} className="border-t">
                  <td className="py-3 font-bold">{course.title}</td>
                  <td>{course.instructor?.name}</td>
                  <td>{course.isPublished ? "Published" : "Draft"}</td>
                  <td><button onClick={() => deleteCourse(course._id)} className="font-bold text-red-600">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;
