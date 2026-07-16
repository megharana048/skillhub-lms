import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

function LearnPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [courseResponse, progressResponse] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/progress/${courseId}`),
        ]);
        setCourse(courseResponse.data.course);
        setProgress(progressResponse.data.progress);
        setSelected(courseResponse.data.course.lessons[0] || null);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load learning page.");
      }
    }
    load();
  }, [courseId]);

  async function toggleLesson(lessonId) {
    try {
      const { data } = await api.put(`/progress/${courseId}/lessons/${lessonId}`);
      setProgress(data.progress);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Progress update failed.");
    }
  }

  if (error) return <p className="px-6 py-20 text-center text-red-700">{error}</p>;
  if (!course || !progress) return <Loader label="Preparing your lesson..." />;

  const completed = new Set(progress.completedLessons.map((item) => item.lesson));

  return (
    <section className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-bold text-indigo-600">{progress.progressPercent}% complete</p>
          <h1 className="mt-3 text-xl font-black">{course.title}</h1>
          <div className="mt-5 space-y-2">
            {course.lessons.map((lesson, index) => (
              <button
                key={lesson._id}
                type="button"
                onClick={() => setSelected(lesson)}
                className={`w-full rounded-xl p-3 text-left ${selected?._id === lesson._id ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100"}`}
              >
                <b>{completed.has(lesson._id) ? "✓" : index + 1}. {lesson.title}</b>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {selected ? (
            <>
              <h2 className="text-3xl font-black">{selected.title}</h2>
              <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950">
                {selected.videoUrl ? (
                  <video src={selected.videoUrl} controls className="aspect-video w-full" />
                ) : (
                  <div className="flex aspect-video items-center justify-center p-6 text-center text-slate-300">
                    No video URL has been added to this lesson.
                  </div>
                )}
              </div>
              <p className="mt-8 whitespace-pre-line leading-8 text-slate-600">
                {selected.content || "Lesson notes will appear here."}
              </p>
              {selected.resourceUrl ? (
                <a href={selected.resourceUrl} target="_blank" rel="noreferrer" className="mt-6 block font-bold text-indigo-600">
                  Open resource
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => toggleLesson(selected._id)}
                className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
              >
                {completed.has(selected._id) ? "Mark incomplete" : "Mark complete"}
              </button>
            </>
          ) : <p>No lessons available.</p>}
        </main>
      </div>
    </section>
  );
}

export default LearnPage;
