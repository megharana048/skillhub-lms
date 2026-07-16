import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

function MyLearningPage() {
  const [state, setState] = useState({ loading: true, error: "", items: [] });

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/enrollments/my");
        setState({ loading: false, error: "", items: data.enrollments });
      } catch (error) {
        setState({
          loading: false,
          error: error.response?.data?.message || "Unable to load courses.",
          items: [],
        });
      }
    }
    load();
  }, []);

  if (state.loading) return <Loader label="Loading your courses..." />;

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black">My Learning</h1>
        {state.error ? <p className="mt-8 text-red-700">{state.error}</p> : null}
        {!state.error && state.items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No enrolled courses"
              description="Browse courses and enroll to begin learning."
              action={
                <Link to="/courses" className="rounded-lg bg-indigo-600 px-5 py-3 font-bold text-white">
                  Browse Courses
                </Link>
              }
            />
          </div>
        ) : null}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {state.items.map((item) => (
            <article key={item._id} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">{item.course.title}</h2>
              <p className="mt-2 text-sm text-slate-500">
                By {item.course.instructor?.name}
              </p>
              <div className="mt-6 flex justify-between text-sm">
                <span>Progress</span><b>{item.progressPercent}%</b>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${item.progressPercent}%` }} />
              </div>
              <Link to={`/learn/${item.course._id}`} className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-bold text-white">
                Continue Learning
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyLearningPage;
