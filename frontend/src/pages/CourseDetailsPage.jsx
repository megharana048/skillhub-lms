import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "", message: "" });

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        setCourse(data.course);
        setStatus({ loading: false, error: "", message: "" });
      } catch (error) {
        setStatus({
          loading: false,
          error: error.response?.data?.message || "Course not found.",
          message: "",
        });
      }
    }
    load();
  }, [courseId]);

  async function enroll() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }
    if (user.role !== "student") {
      setStatus((current) => ({
        ...current,
        message: "Only student accounts can enroll.",
      }));
      return;
    }
    try {
      await api.post(`/enrollments/${courseId}`);
      navigate(`/learn/${courseId}`);
    } catch (error) {
      setStatus((current) => ({
        ...current,
        message: error.response?.data?.message || "Enrollment failed.",
      }));
    }
  }

  if (status.loading) return <Loader label="Loading course..." />;

  if (status.error) {
    return (
      <section className="px-6 py-24 text-center">
        <h1 className="text-4xl font-black">{status.error}</h1>
        <Link to="/courses" className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white">
          Browse Courses
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.5fr_0.8fr]">
          <div>
            <Link to="/courses" className="font-bold text-indigo-300">← Back</Link>
            <p className="mt-8 font-bold uppercase tracking-[0.2em] text-indigo-300">
              {course.category}
            </p>
            <h1 className="mt-4 text-5xl font-black">{course.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              {course.shortDescription}
            </p>
            <p className="mt-6">Created by <b>{course.instructor?.name}</b></p>
          </div>
          <aside className="rounded-2xl bg-white p-6 text-slate-900">
            <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-indigo-100">
              {course.thumbnail?.url ? (
                <img src={course.thumbnail.url} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <b className="text-indigo-700">{course.category}</b>
              )}
            </div>
            <p className="mt-6 text-3xl font-black">
              {course.price > 0 ? `₹${course.price}` : "Free"}
            </p>
            <button
              type="button"
              onClick={enroll}
              className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
            >
              Enroll Now
            </button>
            {status.message ? (
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                {status.message}
              </p>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black">About this course</h2>
          <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
            {course.description}
          </p>
          <h2 className="mt-12 text-3xl font-black">Curriculum</h2>
          <div className="mt-6 space-y-3">
            {course.lessons.map((lesson, index) => (
              <div key={lesson._id} className="rounded-xl border border-slate-200 p-4">
                <b>{index + 1}. {lesson.title}</b>
                <p className="mt-1 text-sm text-slate-500">
                  {lesson.duration || 0} minutes
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CourseDetailsPage;
