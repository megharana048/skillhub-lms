import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

function InstructorPage() {
  const [state, setState] = useState({ loading: true, error: "", courses: [] });

  async function load() {
    try {
      const { data } = await api.get("/courses/instructor/mine");
      setState({ loading: false, error: "", courses: data.courses });
    } catch (error) {
      setState({
        loading: false,
        error: error.response?.data?.message || "Unable to load courses.",
        courses: [],
      });
    }
  }

  useEffect(() => { load(); }, []);

  async function publish(id) {
    await api.patch(`/courses/${id}/publish`);
    load();
  }

  async function remove(id) {
    if (!window.confirm("Delete this course permanently?")) return;
    await api.delete(`/courses/${id}`);
    load();
  }

  if (state.loading) return <Loader label="Loading instructor dashboard..." />;

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-indigo-600">Instructor</p>
            <h1 className="mt-3 text-4xl font-black">Manage Courses</h1>
          </div>
          <Link to="/instructor/courses/new" className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-bold text-white">
            Create Course
          </Link>
        </div>
        {state.error ? <p className="mt-8 text-red-700">{state.error}</p> : null}
        {!state.error && state.courses.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No courses created" description="Create your first course." />
          </div>
        ) : null}
        <div className="mt-10 overflow-x-auto rounded-2xl bg-white shadow-sm">
          {state.courses.length > 0 ? (
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Students</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.courses.map((course) => (
                  <tr key={course._id} className="border-t">
                    <td className="px-5 py-4 font-bold">{course.title}</td>
                    <td className="px-5 py-4">{course.isPublished ? "Published" : "Draft"}</td>
                    <td className="px-5 py-4">{course.enrollmentCount}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <Link to={`/instructor/courses/${course._id}/edit`} className="font-bold text-indigo-600">Edit</Link>
                        <button onClick={() => publish(course._id)} className="font-bold text-emerald-600">
                          {course.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => remove(course._id)} className="font-bold text-red-600">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default InstructorPage;
